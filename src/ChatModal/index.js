import React, { Component } from 'react'
import { Modal, Button, Form, Input, Icon } from 'semantic-ui-react'
import io from 'socket.io-client'
import '../LoginRegisterForm/index.css'

class ChatModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offerAmount: '',
            offerMessage: '',
            messages: [],
            newMessage: '',
            offer: null,
            submitting: false,
            sending: false,
        }
        this.socket = null
        this.messagesEnd = null
    }

    componentWillUnmount() {
        if (this.socket) this.socket.disconnect()
    }

    scrollToBottom = () => {
        if (this.messagesEnd) this.messagesEnd.scrollIntoView({ behavior: 'smooth' })
    }

    componentDidUpdate(_, prevState) {
        if (prevState.messages.length !== this.state.messages.length) {
            this.scrollToBottom()
        }
    }

    submitOffer = async () => {
        const { offerAmount, offerMessage } = this.state
        if (!offerAmount) return
        this.setState({ submitting: true })
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/offers/`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    book_id: this.props.book.id,
                    amount: parseInt(offerAmount),
                    message: offerMessage || `Hi, I'd like to offer $${offerAmount} for your book.`
                })
            })
            const json = await res.json()
            if (res.ok) {
                this.setState({ offer: json.data, submitting: false })
                this.loadMessages(json.data.id)
                this.connectSocket(json.data.id)
            }
        } catch (e) {
            this.setState({ submitting: false })
        }
    }

    loadMessages = async (offerId) => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/offers/${offerId}/messages`, {
            credentials: 'include'
        })
        const json = await res.json()
        this.setState({ messages: json.data || [] })
    }

    connectSocket = (offerId) => {
        this.socket = io(process.env.REACT_APP_API_URL, { withCredentials: true })
        this.socket.emit('join_offer', { offer_id: offerId })
        this.socket.on('new_message', (msg) => {
            this.setState(prev => ({ messages: [...prev.messages, msg] }))
        })
    }

    sendMessage = async () => {
        const { newMessage, offer } = this.state
        if (!newMessage.trim() || !offer) return
        this.setState({ sending: true })
        try {
            await fetch(`${process.env.REACT_APP_API_URL}/api/v1/offers/${offer.id}/messages`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ body: newMessage })
            })
            this.setState({ newMessage: '', sending: false })
        } catch (e) {
            this.setState({ sending: false })
        }
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            this.sendMessage()
        }
    }

    render() {
        const { book, currentUser, onClose } = this.props
        const { offer, messages, offerAmount, offerMessage, newMessage, submitting, sending } = this.state

        return (
            <Modal open={true} onClose={onClose} size='small'>
                <Modal.Header>
                    <div className='chat-modal-header'>
                        <div>
                            <p className='chat-book-title'>{book.title}</p>
                            <p className='chat-book-price'>Asking: <strong>${book.price}</strong></p>
                        </div>
                        <Icon name='times' style={{ cursor: 'pointer', opacity: 0.5 }} onClick={onClose} />
                    </div>
                </Modal.Header>

                <Modal.Content>
                    {!offer ? (
                        <div className='offer-form'>
                            <p className='offer-form-label'>Make an offer to <strong>{book.owner && book.owner.username}</strong></p>
                            <Form>
                                <Form.Field>
                                    <label>Your Offer ($)</label>
                                    <Input
                                        type='number'
                                        placeholder={`e.g. ${Math.round(book.price * 0.8)}`}
                                        value={offerAmount}
                                        onChange={e => this.setState({ offerAmount: e.target.value })}
                                    />
                                </Form.Field>
                                <Form.Field>
                                    <label>Message to Seller (optional)</label>
                                    <input
                                        placeholder="Hi, I'm interested in your book..."
                                        value={offerMessage}
                                        onChange={e => this.setState({ offerMessage: e.target.value })}
                                    />
                                </Form.Field>
                                <Button primary fluid loading={submitting} onClick={this.submitOffer}>
                                    Send Offer
                                </Button>
                            </Form>
                        </div>
                    ) : (
                        <div className='chat-thread'>
                            <div className='chat-offer-banner'>
                                <span className={`offer-status-badge ${offer.status}`}>
                                    {offer.status === 'pending' && '⏳ Offer Pending'}
                                    {offer.status === 'accepted' && '✅ Offer Accepted'}
                                    {offer.status === 'declined' && '❌ Offer Declined'}
                                </span>
                                <span className='offer-amount'>Your offer: <strong>${offer.amount}</strong></span>
                            </div>

                            <div className='chat-messages'>
                                {messages.map((msg, i) => {
                                    const isMine = msg.sender_id === (currentUser && currentUser.id) ||
                                                   (msg.sender && msg.sender.id === (currentUser && currentUser.id))
                                    return (
                                        <div key={msg.id || i} className={`chat-bubble-wrap ${isMine ? 'mine' : 'theirs'}`}>
                                            {!isMine && (
                                                <p className='chat-sender'>{msg.sender_username || (msg.sender && msg.sender.username)}</p>
                                            )}
                                            <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>
                                                {msg.body}
                                            </div>
                                        </div>
                                    )
                                })}
                                <div ref={el => this.messagesEnd = el} />
                            </div>

                            <div className='chat-input-row'>
                                <input
                                    className='chat-input'
                                    placeholder='Type a message...'
                                    value={newMessage}
                                    onChange={e => this.setState({ newMessage: e.target.value })}
                                    onKeyDown={this.handleKeyDown}
                                    disabled={offer.status === 'declined'}
                                />
                                <Button primary icon='send' loading={sending} onClick={this.sendMessage}
                                    disabled={offer.status === 'declined'} />
                            </div>
                        </div>
                    )}
                </Modal.Content>
            </Modal>
        )
    }
}

export default ChatModal
