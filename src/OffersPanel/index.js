import React, { Component } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import io from 'socket.io-client'
import '../LoginRegisterForm/index.css'

class OffersPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offers: [],
            activeOffer: null,
            messages: [],
            newMessage: '',
            sending: false,
        }
        this.socket = null
    }

    componentDidMount() {
        this.fetchOffers()
    }

    componentWillUnmount() {
        if (this.socket) this.socket.disconnect()
    }

    fetchOffers = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/offers/`, { credentials: 'include' })
            const json = await res.json()
            this.setState({ offers: json.data || [] })
        } catch (e) {}
    }

    openOffer = async (offer) => {
        this.setState({ activeOffer: offer, messages: [] })
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/offers/${offer.id}/messages`, { credentials: 'include' })
        const json = await res.json()
        this.setState({ messages: json.data || [] })

        if (this.socket) this.socket.disconnect()
        this.socket = io(process.env.REACT_APP_API_URL, { withCredentials: true })
        this.socket.emit('join_offer', { offer_id: offer.id })
        this.socket.on('new_message', (msg) => {
            this.setState(prev => ({ messages: [...prev.messages, msg] }))
        })
    }

    updateStatus = async (offerId, status) => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/offers/${offerId}/status`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        })
        const json = await res.json()
        this.setState({
            activeOffer: json.data,
            offers: this.state.offers.map(o => o.id === offerId ? json.data : o)
        })
        if (status === 'accepted' && this.props.onOfferAccepted) {
            this.props.onOfferAccepted(json.data)
        }
    }

    sendMessage = async () => {
        const { newMessage, activeOffer } = this.state
        if (!newMessage.trim() || !activeOffer) return
        this.setState({ sending: true })
        await fetch(`${process.env.REACT_APP_API_URL}/api/v1/offers/${activeOffer.id}/messages`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ body: newMessage })
        })
        this.setState({ newMessage: '', sending: false })
    }

    handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.sendMessage() }
    }

    render() {
        const { offers, activeOffer, messages, newMessage, sending } = this.state
        const currentUserId = this.props.currentUserId

        return (
            <div className='offers-panel-layout'>
                <div className='offers-list'>
                    <div className='offers-list-header'>
                        <h3>Offers</h3>
                        <span className='offers-count'>{offers.length}</span>
                    </div>
                    {offers.length === 0 ? (
                        <div className='notif-empty'>
                            <span style={{fontSize:'2rem'}}>💬</span>
                            <p>No offers yet</p>
                        </div>
                    ) : (
                        offers.map(o => (
                            <div
                                key={o.id}
                                className={`offer-list-item ${activeOffer && activeOffer.id === o.id ? 'active' : ''}`}
                                onClick={() => this.openOffer(o)}
                            >
                                <div className='offer-list-book'>{o.book && o.book.title}</div>
                                <div className='offer-list-meta'>
                                    <span className='offer-list-user'>
                                        {o.buyer && o.buyer.id === currentUserId ? `To: ${o.seller && o.seller.username}` : `From: ${o.buyer && o.buyer.username}`}
                                    </span>
                                    <span className={`offer-status-pill ${o.status}`}>{o.status}</span>
                                </div>
                                <div className='offer-list-amount'>${o.amount}</div>
                            </div>
                        ))
                    )}
                </div>

                <div className='offer-chat-panel'>
                    {!activeOffer ? (
                        <div className='offer-chat-empty'>
                            <span style={{fontSize:'3rem'}}>💬</span>
                            <p>Select an offer to view the conversation</p>
                        </div>
                    ) : (
                        <>
                            <div className='offer-chat-header'>
                                <div>
                                    <p className='chat-book-title'>{activeOffer.book && activeOffer.book.title}</p>
                                    <span className={`offer-status-badge ${activeOffer.status}`}>
                                        {activeOffer.status === 'pending' && '⏳ Pending'}
                                        {activeOffer.status === 'accepted' && '✅ Accepted'}
                                        {activeOffer.status === 'declined' && '❌ Declined'}
                                    </span>
                                    <span className='offer-amount' style={{marginLeft:'12px'}}>
                                        Offer: <strong>${activeOffer.amount}</strong>
                                    </span>
                                </div>
                                {activeOffer.status === 'pending' && activeOffer.seller && activeOffer.seller.id === currentUserId && (
                                    <div className='offer-actions'>
                                        <Button size='small' color='green' onClick={() => this.updateStatus(activeOffer.id, 'accepted')}>
                                            <Icon name='check' /> Accept
                                        </Button>
                                        <Button size='small' color='red' onClick={() => this.updateStatus(activeOffer.id, 'declined')}>
                                            <Icon name='times' /> Decline
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className='chat-messages'>
                                {messages.map((msg, i) => {
                                    const isMine = (msg.sender && msg.sender.id === currentUserId) || msg.sender_id === currentUserId
                                    return (
                                        <div key={msg.id || i} className={`chat-bubble-wrap ${isMine ? 'mine' : 'theirs'}`}>
                                            {!isMine && <p className='chat-sender'>{msg.sender_username || (msg.sender && msg.sender.username)}</p>}
                                            <div className={`chat-bubble ${isMine ? 'mine' : 'theirs'}`}>{msg.body}</div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className='chat-input-row'>
                                <input
                                    className='chat-input'
                                    placeholder='Type a message...'
                                    value={newMessage}
                                    onChange={e => this.setState({ newMessage: e.target.value })}
                                    onKeyDown={this.handleKeyDown}
                                    disabled={activeOffer.status === 'declined'}
                                />
                                <Button primary icon='send' loading={sending} onClick={this.sendMessage}
                                    disabled={activeOffer.status === 'declined'} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        )
    }
}

export default OffersPanel
