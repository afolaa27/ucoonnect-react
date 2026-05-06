import React from 'react'
import { Menu } from 'semantic-ui-react'
import '../LoginRegisterForm/index.css'

function Navbar(props) {
	return (
		<Menu inverted size='small'>
			{props.homeState
				? <Menu.Item name='List a Book' onClick={props.openModal} icon='plus circle' />
				: <Menu.Item name='My Books' onClick={props.closeModal} icon='home' />
			}

			<Menu.Item name='Browse' onClick={props.openSearch} icon='search' />
			<Menu.Item name='Favorites' onClick={props.openFav} icon='heart' />
			<Menu.Item name='Notifications' icon='bell' />

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
	)
}

export default Navbar