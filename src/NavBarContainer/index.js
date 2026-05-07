import React from 'react'
import { Menu, Icon } from 'semantic-ui-react'
import NotificationPanel from '../NotificationPanel'
import '../LoginRegisterForm/index.css'

function Navbar(props) {
	return (
		<div>
			<Menu inverted size='small'>
				{props.homeState
					? <Menu.Item name='List a Book' onClick={props.openModal} icon='plus circle' />
					: <Menu.Item name='My Books' onClick={props.closeModal} icon='home' />
				}
				<Menu.Item name='Browse' onClick={props.openSearch} icon='search' />
				<Menu.Item name='Discover' onClick={props.openDiscover} icon='lightbulb' />
				<Menu.Item name='Favorites' onClick={props.openFav} icon='heart' />
				<Menu.Item name='Offers' onClick={props.openOffers} icon='handshake' />

				<Menu.Item
					onClick={props.toggleNotifPanel}
					style={{ position: 'relative' }}
				>
					<Icon name='bell' />
					Notifications
					{props.notifCount > 0 && (
						<span className='notif-badge'>{props.notifCount}</span>
					)}
				</Menu.Item>

				<Menu.Item
					className='nav-brand'
					style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
				>
					UConnect
					<span>Textbook Marketplace</span>
				</Menu.Item>

				<Menu.Menu position='right'>
					<Menu.Item name='Log Out' onClick={props.logout} icon='sign out' />
				</Menu.Menu>
			</Menu>

			{props.notifPanelOpen && (
				<NotificationPanel
					notifications={props.notifications}
					markRead={props.markRead}
				/>
			)}
		</div>
	)
}

export default Navbar
