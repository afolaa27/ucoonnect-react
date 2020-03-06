import React from 'react'
import { Item, Button, Image, Container,Icon, Divider} from 'semantic-ui-react'
import '../index.css'

function BoookList(props){
	
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
						<Item.Meta>
							Pickup Address: {book.address}
						</Item.Meta>
						<Item.Extra>
							<Button floated="right" size='small' onClick={()=>props.delete(book.id)}><Icon name='trash'></Icon>Delete</Button>
							<Button floated="left" size='small'onClick={()=>props.edit(book.id)}><Icon name='edit'></Icon>Edit</Button>
						</Item.Extra>
					</Item.Content>
				</Item>

			)
	})
	return(
		 
		<Container className="listContainer">
		<h2>My Books</h2>
		<Divider/>
		<Item.Group divided>
			{books}
		</Item.Group>
		
		</Container>
		)
}

export default BoookList