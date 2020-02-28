import React from 'react'
import { Item, Button, Image, Container } from 'semantic-ui-react'

function BoookList(props){
	console.log(props.books);
	const books = props.books.map((book)=>{

		return(
				
				<Item key={book.id}>
					<Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png'	/>
					<Item.Content>
						<Item.Header>
							{book.title}
						</Item.Header>
						<Item.Meta>
							{book.ISBN}
						</Item.Meta>
						<Item.Meta>
							${book.price}
						</Item.Meta>
						<Item.Description>
							{book.description}
						</Item.Description>
						<Item.Extra>
							<Button floated="right">Delete</Button>
							<Button floated="left">Edit</Button>
						</Item.Extra>
					</Item.Content>
				</Item>
			

			)
	})
	return(
		<Container item>
		<Item.Group divided>
			{books}
		</Item.Group>
		</Container>
		)
}

export default BoookList