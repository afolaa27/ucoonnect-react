import React from 'react'
import { Item, Button, Image, Container,Icon } from 'semantic-ui-react'
import '../index.css'

function BoookList(props){
	console.log(props.books);
	const books = props.books.map((book)=>{

		return(
				
				<Item key={book.id}>
					<Item.Image src={book.image}	/>
					<Item.Content>
						<Item.Header>
							{book.title}
						</Item.Header>
						<Item.Meta>
							ISBN :{book.ISBN}
						</Item.Meta>
						<Item.Meta>
							${book.price}
						</Item.Meta>
						<Item.Description>
							{book.description}
						</Item.Description>
						<Item.Extra>
							<Button floated="right" size='small' ><Icon name='trash'></Icon>Delete</Button>
							<Button floated="left" size='small'><Icon name='edit'></Icon>Edit</Button>
						</Item.Extra>
					</Item.Content>
				</Item>
			

			)
	})
	return(
		 

		<Container className="listContainer">

		<Item.Group divided>
			{books}
		</Item.Group>
		</Container>
		)
}

export default BoookList