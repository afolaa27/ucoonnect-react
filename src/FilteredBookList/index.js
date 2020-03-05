import React from 'react'
import { Item, Button, Image, Container,Icon} from 'semantic-ui-react'
import '../index.css'

function FilteredBookList(props){
	//console.log('in the filtered list component >>>>', props.books)
	const books = props.books.map((book)=>{
		return(		
				<Item key={book.id}>
					<Item.Image src={book.image}/>
					<Item.Content>
						<Item.Header>
							{book.title}
						</Item.Header>
						<Item.Meta>
							ISBN :{book.ISBN}
						</Item.Meta>
						<Item.Description>
							{book.description}
						</Item.Description>
						<Item.Meta>
							${book.price}
						</Item.Meta>
						<Item.Meta>
							{book.distance}mi
						</Item.Meta>
						
						<Item.Extra>
							<Button floated="right" size='small' ><Icon name='money'></Icon>Buy</Button>
							<Button floated="left" size='small'onClick={()=>props.favorite(book.id)}><Icon name='favorite'></Icon>Add To Favorites</Button>
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

export default FilteredBookList