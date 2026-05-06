import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import '../LoginRegisterForm/index.css'

function BookList(props) {
	if (!props.books || props.books.length === 0) {
		return (
			<div className='listContainer'>
				<div className='section-header'>
					<h2 className='section-title'>My Books</h2>
				</div>
				<div className='section-divider' />
				<div className='empty-state'>
					<div className='empty-state-icon'>📚</div>
					<p>You haven't listed any books yet.<br />Click "List a Book" to get started.</p>
				</div>
			</div>
		)
	}

	return (
		<div className='listContainer'>
			<div className='section-header'>
				<h2 className='section-title'>My Books</h2>
			</div>
			<div className='section-divider' />
			<div className='book-grid'>
				{props.books.map((book) => (
					<div key={book.id} className='book-card'>
						{book.image
							? <img className='book-card-img' src={book.image} alt={book.title} />
							: <div className='book-card-img-placeholder'>📖</div>
						}
						<div className='book-card-body'>
							<p className='book-card-title'>{book.title}</p>
							<p className='book-card-isbn'>ISBN: {book.ISBN}</p>
							<p className='book-card-desc'>{book.description}</p>
							<p className='book-card-price'>${book.price}</p>
							<p className='book-card-address'>📍 {book.address}</p>
						</div>
						<div className='book-card-footer'>
							<Button size='small' onClick={() => props.edit(book.id)}>
								<Icon name='edit' />Edit
							</Button>
							<Button size='small' color='red' onClick={() => props.delete(book.id)}>
								<Icon name='trash' />Delete
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default BookList
