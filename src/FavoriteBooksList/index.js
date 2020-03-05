import React from 'react'
import { Item, Button, Image, Container,Icon} from 'semantic-ui-react'
import '../index.css'

function FavoriteBookList(props){

const books = props.books.map((book)=>{
		console.log('>>>> one', book)
			return(	
					<Item key={book.id}>
						<Item.Image src={book.Book_Id.image}	/>
						<Item.Content>
							<Item.Header>
								{book.Book_Id.title}
							</Item.Header>
							<Item.Meta>
								ISBN :{book.Book_Id.ISBN}
							</Item.Meta>
							<Item.Meta>
								${book.Book_Id.price}
							</Item.Meta>
							<Item.Description>
								{book.Book_Id.description}
							</Item.Description>
							<Item.Meta>
								Pickup Address: {book.Book_Id.address}
							</Item.Meta>
							<Item.Extra>
								<Button floated="right" size='small' onClick={()=>props.deleteFavorite(book.id)}><Icon name='trash'></Icon>Remove Favorite</Button>
								<Button floated="left" size='small'onClick><Icon name='money'></Icon>Buy</Button>
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

export default FavoriteBookList