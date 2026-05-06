import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import '../LoginRegisterForm/index.css'

function FilteredBookList(props) {
	if (!props.books || props.books.length === 0) {
		return (
			<div className='empty-state'>
				<div className='empty-state-icon'>🔍</div>
				<p>No books found near that location.</p>
			</div>
		)
	}

	return (
		<div>
			<div className='section-header'>
				<h2 className='section-title'>Books Near You</h2>
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
							{book.distance && (
								<span className='book-card-distance'>📍 {book.distance} mi away</span>
							)}
						</div>
						<div className='book-card-footer'>
							<Button size='small' color='blue' onClick={() => props.favorite(book.id)}>
								<Icon name='heart' />Save
							</Button>
							<Button size='small' color='green'>
								<Icon name='dollar' />Buy
							</Button>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default FilteredBookList
