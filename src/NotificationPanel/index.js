import React from 'react'
import '../LoginRegisterForm/index.css'

const ICONS = {
	new_offer:    '🤝',
	new_message:  '💬',
	price_drop:   '📉',
	book_sold:    '📦',
	offer_update: '✅',
}

function NotificationPanel({ notifications, markRead }) {
	return (
		<div className='notif-panel'>
			<div className='notif-panel-header'>
				<h3>Notifications</h3>
				<span className='notif-panel-sub'>Updates on your books, offers &amp; messages</span>
			</div>
			{!notifications || notifications.length === 0 ? (
				<div className='notif-empty'>
					<span style={{fontSize:'2rem'}}>🔔</span>
					<p>No notifications yet</p>
					<p style={{fontSize:'0.8rem', color:'#94A3B8'}}>You'll be notified about offers, messages, and price drops here</p>
				</div>
			) : (
				<div className='notif-list'>
					{notifications.map(n => {
						const icon = ICONS[n.type] || '📚'
						const msg = n.message
							|| (n.Buyer_id && n.Book_id
								? `${n.Buyer_id.username} is interested in "${n.Book_id.title}"`
								: 'New notification')
						const book = n.book || (n.Book_id && n.Book_id.title)
						return (
							<div
								key={n.id}
								className={`notif-item${!n.read ? ' unread' : ''}`}
								onClick={() => n.id && !n.read && markRead(n.id)}
							>
								<div className='notif-icon-wrap'>
									<span style={{fontSize:'1.4rem'}}>{icon}</span>
								</div>
								<div className='notif-content'>
									<p className='notif-title'>{msg}</p>
									{book && <p className='notif-message'>{book}</p>}
									{n.created_at && (
										<p className='notif-time'>
											{new Date(n.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
											{' · '}
											{new Date(n.created_at).toLocaleDateString()}
										</p>
									)}
								</div>
								{!n.read && <div className='notif-dot' />}
							</div>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default NotificationPanel
