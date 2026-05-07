import React, { useState } from 'react'
import { Icon } from 'semantic-ui-react'
import NotificationPanel from '../NotificationPanel'
import '../LoginRegisterForm/index.css'

function Navbar(props) {
	const [open, setOpen] = useState(false)
	const nav = (fn) => { fn(); setOpen(false) }

	const { currentUser } = props

	return (
		<>
			{/* ── Top header bar ── */}
			<div className='app-header'>
				{/* Left: notification bell */}
				<button
					className='header-notif-btn'
					onClick={() => { props.toggleNotifPanel(); setOpen(false) }}
					aria-label='Notifications'
				>
					<Icon name='bell' size='large' />
					{props.notifCount > 0 && (
						<span className='header-notif-badge'>{props.notifCount}</span>
					)}
				</button>

				{/* Center: brand */}
				<div className='app-brand'>
					<span className='brand-name'>UConnect</span>
					<span className='brand-sub'>textbook marketplace</span>
				</div>

				{/* Right: profile icon + hamburger */}
				<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
					<button
						className='header-notif-btn'
						onClick={() => { props.openProfile(); setOpen(false) }}
						aria-label='Profile'
					>
						{currentUser && currentUser.avatar
							? <img src={currentUser.avatar} alt='avatar' className='header-avatar-img' />
							: <Icon name='user circle' size='large' />
						}
					</button>
					<button className='hamburger-btn' onClick={() => setOpen(!open)} aria-label='Menu'>
						<Icon name={open ? 'times' : 'bars'} size='large' />
					</button>
				</div>
			</div>

			{/* ── Backdrop ── */}
			{open && <div className='drawer-backdrop' onClick={() => setOpen(false)} />}

			{/* ── Slide-in drawer (right) ── */}
			<div className={`nav-drawer ${open ? 'open' : ''}`}>
				<div className='drawer-item' onClick={() => nav(props.openProfile)}>
					<Icon name='user circle' /> My Profile
				</div>
				<div className='drawer-divider' />
				<div className='drawer-item' onClick={() => nav(props.closeModal)}>
					<Icon name='home' /> My Books
				</div>
				<div className='drawer-item' onClick={() => nav(props.openModal)}>
					<Icon name='plus circle' /> List a Book
				</div>
				<div className='drawer-item' onClick={() => nav(props.openSearch)}>
					<Icon name='search' /> Browse
				</div>
				<div className='drawer-item' onClick={() => nav(props.openDiscover)}>
					<Icon name='lightbulb' /> Discover
				</div>
				<div className='drawer-item' onClick={() => nav(props.openFav)}>
					<Icon name='heart' /> Favorites
				</div>
				<div className='drawer-item' onClick={() => nav(props.openOffers)}>
					<Icon name='handshake' /> Offers
				</div>
				<div className='drawer-logout drawer-item' onClick={props.logout}>
					<Icon name='sign out' /> Log Out
				</div>
			</div>

			{/* ── Notification panel ── */}
			{props.notifPanelOpen && (
				<NotificationPanel
					notifications={props.notifications}
					markRead={props.markRead}
				/>
			)}
		</>
	)
}

export default Navbar
