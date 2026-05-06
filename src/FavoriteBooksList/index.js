import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import '../LoginRegisterForm/index.css'

function FavoriteBookList(props) {
	if (!props.books || props.books.length === 0) {
		return (
			<div className='listContainer'>
				<div className='section-header'>
					<h2 className='section-title'>My Favorites</h2>
				</div>
				<div className='section-divider' />
				<div className='empty-state'>
					<div className='empty-state-icon'>❤️</div>
					<p>No favorites yet. Browse books and save the ones you like.</p>
				</div>
			</div>
		)
	}

	return (
		<div className='listContainer'>
			<div className='section-header'>
				<h2 className='section-title'>My Favorites</h2>
			</div>
			<div className='section-divider' />
			<div className='book-grid'>
				{props.books.map((book) => (
					<div key={book.id} className='book-card'>
						{book.Book_Id.image
							? <img className='book-card-img' src={book.Book_Id.image} alt={book.Book_Id.title} />
							: <div className='book-card-img-placeholder'>📖</div>
						}
						<div className='book-card-body'>
							<p className='book-card-title'>{book.Book_Id.title}</p>
							<p className='book-card-isbn'>ISBN: {book.Book_Id.ISBN}</p>
							<p className='book-card-desc'>{book.Book_Id.description}</p>
							<p className='book-card-price'>${book.Book_Id.price}</p>
							<p className='book-card-address'>📍 {book.Book_Id.address}</p>
						</div>
						<div className='book-card-footer'>
							<Button size='small' color='green'>
								<Icon name='dollar' />Buy
							</Button>
							<Button size='small' color='red' onClick={() => props.deleteFavorite(book.id)}>
								<Icon name='heart broken' />Remove
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default FavoriteBookList
