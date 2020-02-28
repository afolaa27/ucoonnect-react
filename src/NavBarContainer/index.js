import React from 'react'
import {Button, Menu, Input, icon} from 'semantic-ui-react'


function Navbar(props){
			return(
			<div > 
			<Menu inverted size='small'>
		        <Menu.Item
		          name='List'
		 
		          icon='add'
		        />
		        <Menu.Item
		          name='Buy'
		         
		          icon='shop'
		        />
		        <Menu.Item
		          name='Favorites'
		          
		          icon='favorite'
		        />
		        <Menu.Item
		          name='Notifications'
		          
		          icon='bell'
		        />
		        <Menu.Menu position='right'>
		          
		          <Menu.Item
		            name='logout'
		            onClick={props.logout}
		            icon='sign-out'
		          />
		        </Menu.Menu>
     		 </Menu>
			</div>
			)
		
}

export default Navbar