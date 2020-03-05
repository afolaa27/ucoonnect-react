import React from 'react'
import {Modal, Button, Input, Container, Form} from 'semantic-ui-react'
import '../index.css'


function BuyBookModal(props){
	return(
		<Modal>
			<Container>
				<Form>
					<Input></Input>
					<Input></Input>
					<Button type='Submit'></Button>
				</Form>
			</Container>
		</Modal>

		)
}

export default BuyBookModal