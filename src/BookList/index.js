import React, { useState } from 'react'
import { Button, Icon } from 'semantic-ui-react' // Icon used in card footer buttons
import '../LoginRegisterForm/index.css'

const SUBJECTS = [
	'All', 'Mathematics', 'Computer Science', 'Engineering', 'Physics', 'Chemistry',
	'Biology', 'Business', 'Economics', 'Psychology', 'Sociology',
	'History', 'Literature', 'Philosophy', 'Art & Design', 'Music',
	'Medicine & Health', 'Law', 'Political Science', 'Education', 'Other'
]

function BookList(props) {
	const [sortBy, setSortBy] = useState('none')
	const [subjectFilter, setSubjectFilter] = useState('All')
	const [conditionFilter, setConditionFilter] = useState('All')

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

	let displayed = [...props.books]

	if (subjectFilter !== 'All') displayed = displayed.filter(b => b.subject === subjectFilter)
	if (conditionFilter !== 'All') displayed = displayed.filter(b => b.condition === conditionFilter)

	if (sortBy === 'price-asc') displayed.sort((a, b) => a.price - b.price)
	else if (sortBy === 'price-desc') displayed.sort((a, b) => b.price - a.price)
	else if (sortBy === 'distance-asc') displayed.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
	else if (sortBy === 'distance-desc') displayed.sort((a, b) => (b.distance ?? -1) - (a.distance ?? -1))

	return (
		<div className='listContainer'>
			<div className='section-header'>
				<h2 className='section-title'>My Books</h2>
			</div>
			<div className='section-divider' />

			{/* ── Sub-nav filters ── */}
			<div className='booklist-filters'>
				<div className='filter-group'>
					<span className='filter-label'>Sort by</span>
					<select className='filter-dropdown' value={sortBy} onChange={e => setSortBy(e.target.value)}>
						<option value='none'>Default</option>
						<option value='price-asc'>Price: Low to High</option>
						<option value='price-desc'>Price: High to Low</option>
						<option value='distance-asc'>Distance: Nearest</option>
						<option value='distance-desc'>Distance: Farthest</option>
					</select>
					<span className='filter-label' style={{marginLeft:'16px'}}>Subject</span>
					<select className='filter-dropdown' value={subjectFilter} onChange={e => setSubjectFilter(e.target.value)}>
						{SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
					</select>
					<span className='filter-label' style={{marginLeft:'16px'}}>Condition</span>
					<select className='filter-dropdown' value={conditionFilter} onChange={e => setConditionFilter(e.target.value)}>
						{['All','New','Like New','Good','Fair','Poor'].map(c => <option key={c} value={c}>{c}</option>)}
					</select>
				</div>
			</div>

			{displayed.length === 0 ? (
				<div className='empty-state'>
					<div className='empty-state-icon'>🔍</div>
					<p>No books match the selected filters.</p>
				</div>
			) : (
				<div className='book-grid'>
					{displayed.map((book) => (
						<div key={book.id} className='book-card'>
							{book.image
								? <img className='book-card-img' src={book.image} alt={book.title} />
								: <div className='book-card-img-placeholder'>📖</div>
							}
							<div className='book-card-right'>
								<div className='book-card-body'>
									<p className='book-card-title'>{book.title}</p>
									<div style={{display:'flex', gap:6, flexWrap:'wrap', marginBottom:4}}>
										{book.subject && <span className='book-subject-badge'>{book.subject}</span>}
										{book.condition && <span className={`book-condition-badge condition-${book.condition.toLowerCase().replace(' ','-')}`}>{book.condition}</span>}
									</div>
									<p className='book-card-isbn'>ISBN: {book.ISBN}</p>
									<p className='book-card-desc'>{book.description}</p>
									<p className='book-card-price'>${book.price}</p>
									{book.distance != null
										? <span className='book-card-distance'>📍 {book.distance} mi away</span>
										: <span className='book-card-distance' style={{color:'#CBD5E1'}}>📍 Location unavailable</span>
									}
								</div>
								<div className='book-card-footer'>
									<Button size='small' onClick={() => props.edit(book.id)}>
										<Icon name='edit' />Edit
									</Button>
									<Button size='small' color='red' onClick={() => props.delete(book.id)}>
										<Icon name='trash' />Delete
									</Button>
									<Button size='small' color='teal' onClick={() => props.openOffers && props.openOffers()}>
										<Icon name='handshake' />Offers
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default BookList
