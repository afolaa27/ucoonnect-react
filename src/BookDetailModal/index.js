import React, { Component } from 'react'
import { Modal, Button, Icon } from 'semantic-ui-react'
import '../LoginRegisterForm/index.css'

class BookDetailModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            messages: [],
            input: '',
            loading: false,
        }
        this.messagesEnd = null
    }

    componentDidMount() {
        this.sendMessage('Give me a quick 2-3 sentence summary of this book and what kind of student would benefit from it.', true)
    }

    componentDidUpdate(_, prevState) {
        if (prevState.messages.length !== this.state.messages.length) {
            if (this.messagesEnd) this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
        }
    }

    sendMessage = async (text, isAuto = false) => {
        const content = text || this.state.input.trim()
        if (!content || this.state.loading) return

        const userMsg = { role: 'user', content }
        const nextMessages = [...this.state.messages, userMsg]

        this.setState({ messages: nextMessages, input: '', loading: true })

        const { book } = this.props
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/ai/book_chat`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    book: {
                        title: book.title,
                        authors: book.authors || '',
                        description: book.description || '',
                        isbn: book.isbn || book.ISBN || '',
                        subject: book.subject || '',
                        price: book.price || '',
                    },
                    messages: nextMessages,
                }),
            })
            const json = await res.json()
            const reply = json.data && json.data.reply
            if (reply) {
                this.setState(prev => ({
                    messages: [...prev.messages, { role: 'assistant', content: reply }],
                    loading: false,
                }))
            } else {
                const errText = json.error || 'Something went wrong. Please try again.'
                this.setState(prev => ({
                    messages: [...prev.messages, { role: 'error', content: errText }],
                    loading: false,
                }))
            }
        } catch (e) {
            this.setState(prev => ({
                messages: [...prev.messages, { role: 'error', content: 'Could not reach the AI service. Check your connection.' }],
                loading: false,
            }))
        }
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            this.sendMessage()
        }
    }

    render() {
        const { book, onClose } = this.props
        const { messages, input, loading } = this.state

        const suggestions = [
            'Is this textbook worth the price?',
            'What topics does this book cover?',
            'Is this good for beginners?',
        ]

        return (
            <Modal open={true} onClose={onClose} size='small' className='book-detail-modal'>
                <Modal.Header>
                    <div className='chat-modal-header'>
                        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1 }}>
                            {book.cover || book.image
                                ? <img
                                    src={book.cover || book.image}
                                    alt={book.title}
                                    style={{ width: 56, height: 72, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }}
                                  />
                                : <div style={{ width: 56, height: 72, background: '#e5e7eb', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>📖</div>
                            }
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p className='chat-book-title' style={{ marginBottom: 2 }}>{book.title}</p>
                                {book.authors && <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{book.authors}</p>}
                                {(book.isbn || book.ISBN) && <p style={{ margin: 0, fontSize: '0.75rem', color: '#9ca3af' }}>ISBN: {book.isbn || book.ISBN}</p>}
                                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                                    {book.subject && <span className='book-subject-badge'>{book.subject}</span>}
                                    {book.price && <span className='book-card-price' style={{ margin: 0, fontSize: '0.85rem' }}>${book.price}</span>}
                                </div>
                            </div>
                        </div>
                        <Icon name='times' style={{ cursor: 'pointer', opacity: 0.5, flexShrink: 0 }} onClick={onClose} />
                    </div>
                </Modal.Header>

                <Modal.Content style={{ padding: 0, display: 'flex', flexDirection: 'column', height: 420 }}>
                    {/* AI label */}
                    <div style={{ padding: '10px 16px 6px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#7c3aed', letterSpacing: '0.05em' }}>✨ ASK AI</span>
                    </div>

                    {/* Message thread */}
                    <div className='chat-messages' style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
                        {messages.length === 0 && !loading && (
                            <p style={{ color: '#9ca3af', fontSize: '0.85rem', textAlign: 'center', marginTop: 24 }}>
                                Loading summary...
                            </p>
                        )}
                        {messages.map((msg, i) => {
                            if (msg.role === 'user' && i === 0) return null
                            if (msg.role === 'error') return (
                                <div key={i} className='chat-bubble-wrap theirs'>
                                    <div className='chat-bubble theirs' style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', fontSize: '0.82rem' }}>
                                        ⚠️ {msg.content}
                                    </div>
                                </div>
                            )
                            return (
                                <div key={i} className={`chat-bubble-wrap ${msg.role === 'user' ? 'mine' : 'theirs'}`}>
                                    {msg.role === 'assistant' && (
                                        <p className='chat-sender' style={{ fontSize: '0.7rem', color: '#7c3aed' }}>✨ AI Assistant</p>
                                    )}
                                    <div className={`chat-bubble ${msg.role === 'user' ? 'mine' : 'theirs'}`}
                                        style={msg.role === 'assistant' ? { background: '#f5f3ff', color: '#1f2937', border: '1px solid #e9d5ff' } : {}}>
                                        {msg.content}
                                    </div>
                                </div>
                            )
                        })}
                        {loading && (
                            <div className='chat-bubble-wrap theirs'>
                                <p className='chat-sender' style={{ fontSize: '0.7rem', color: '#7c3aed' }}>✨ AI Assistant</p>
                                <div className='chat-bubble theirs' style={{ background: '#f5f3ff', border: '1px solid #e9d5ff' }}>
                                    <span className='ai-typing-dots'><span>.</span><span>.</span><span>.</span></span>
                                </div>
                            </div>
                        )}
                        <div ref={el => this.messagesEnd = el} />
                    </div>

                    {/* Quick suggestion chips */}
                    {messages.length <= 2 && !loading && (
                        <div style={{ padding: '6px 16px', display: 'flex', gap: 6, flexWrap: 'wrap', borderTop: '1px solid #f3f4f6' }}>
                            {suggestions.map(s => (
                                <button key={s} onClick={() => this.sendMessage(s)} className='ai-suggestion-chip'>
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className='chat-input-row' style={{ borderTop: '1px solid #e5e7eb', padding: '10px 12px' }}>
                        <input
                            className='chat-input'
                            placeholder='Ask anything about this book...'
                            value={input}
                            onChange={e => this.setState({ input: e.target.value })}
                            onKeyDown={this.handleKeyDown}
                            disabled={loading}
                        />
                        <Button primary icon='send' loading={loading} onClick={() => this.sendMessage()} disabled={!input.trim()} />
                    </div>
                </Modal.Content>
            </Modal>
        )
    }
}

export default BookDetailModal
