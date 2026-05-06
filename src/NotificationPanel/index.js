import React from 'react'
import '../LoginRegisterForm/index.css'

function NotificationPanel({ notifications, markRead }) {
	return (
		<div className='notif-panel'>
			<div className='notif-panel-header'>
				<h3>Notifications</h3>
				<span className='notif-panel-sub'>Click a notification to mark as read</span>
			</div>
			{!notifications || notifications.length === 0 ? (
				<div className='notif-empty'>
					<span style={{fontSize:'2rem'}}>🔔</span>
					<p>No notifications yet</p>
					<p style={{fontSize:'0.8rem', color:'#94A3B8'}}>When buyers are interested in your books, you'll see it here</p>
				</div>
			) : (
				<div className='notif-list'>
					{notifications.map(n => (
						<div
							key={n.id}
							className={`notif-item${!n.read ? ' unread' : ''}`}
							onClick={() => !n.read && markRead(n.id)}
						>
							<div className='notif-icon-wrap'>
								<span style={{fontSize:'1.4rem'}}>📚</span>
							</div>
							<div className='notif-content'>
								<p className='notif-title'>
									<strong>{n.Buyer_id && n.Buyer_id.username}</strong> is interested in <strong>{n.Book_id && n.Book_id.title}</strong>
								</p>
								<p className='notif-message'>"{n.message}"</p>
								{n.created_at && (
									<p className='notif-time'>{new Date(n.created_at).toLocaleDateString()}</p>
								)}
							</div>
							{!n.read && <div className='notif-dot' />}
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default NotificationPanel
