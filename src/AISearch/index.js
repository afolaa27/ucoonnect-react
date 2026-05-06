import React, { Component } from 'react'
import { Button, Form, Input, Icon } from 'semantic-ui-react'
import '../LoginRegisterForm/index.css'

class AISearch extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: '',
			internalResults: [],
			googleResults: [],
			loading: false,
			searched: false,
		}
	}

	handleChange = (e) => this.setState({ query: e.target.value })

	search = async () => {
		const { query } = this.state
		if (!query.trim()) return
		this.setState({ loading: true, searched: false })

		try {
			const [internalRes, googleRes] = await Promise.all([
				fetch(
					`${process.env.REACT_APP_API_URL}/api/v1/books/recommend?q=${encodeURIComponent(query)}`,
					{ credentials: 'include' }
				),
				fetch(
					`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=6&printType=books`
				)
			])

			const internalJson = await internalRes.json()
			const googleJson = await googleRes.json()

			const googleBooks = (googleJson.items || []).map(item => ({
				id: item.id,
				title: item.volumeInfo.title || 'Unknown Title',
				authors: (item.volumeInfo.authors || []).join(', '),
				description: item.volumeInfo.description || '',
				thumbnail: item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.smallThumbnail,
				isbn: ((item.volumeInfo.industryIdentifiers || []).find(i => i.type === 'ISBN_13') || {}).identifier || '',
				publisher: item.volumeInfo.publisher || '',
			}))

			this.setState({
				internalResults: internalJson.data || [],
				googleResults: googleBooks,
				loading: false,
				searched: true,
			})
		} catch (e) {
			this.setState({ loading: false, searched: true })
		}
	}

	render() {
		const { query, internalResults, googleResults, loading, searched } = this.state

		return (
			<div className='listContainer'>
				<div className='ai-search-hero'>
					<div className='ai-search-icon'>✨</div>
					<h2 className='section-title'>Discover Books</h2>
					<p className='ai-search-sub'>Type keywords, a subject, or an author — we'll search our marketplace and suggest matching titles</p>
				</div>

				<div className='search-bar' style={{ marginBottom: '32px' }}>
					<Form onSubmit={this.search} style={{ display: 'flex', gap: '12px', width: '100%', margin: 0 }}>
						<Input
							value={query}
							onChange={this.handleChange}
							placeholder='e.g. "organic chemistry", "data structures", "Toni Morrison"...'
							style={{ flex: 1 }}
						/>
						<Button primary type='submit' loading={loading}>
							<Icon name='search' /> Search
						</Button>
					</Form>
				</div>

				{searched && (
					<>
						<div className='section-header'>
							<h2 className='section-title'>
								Available on UConnect
								<span className='ai-count-badge'>{internalResults.length}</span>
							</h2>
						</div>
						<div className='section-divider' />
						{internalResults.length === 0 ? (
							<div className='empty-state' style={{ padding: '32px' }}>
								<p>No listings match that search — check back later or browse all books.</p>
							</div>
						) : (
							<div className='book-grid'>
								{internalResults.map(book => (
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
									</div>
								))}
							</div>
						)}

						<div className='section-header' style={{ marginTop: '40px' }}>
							<h2 className='section-title'>
								Google Books Suggestions
								<span className='ai-count-badge'>{googleResults.length}</span>
							</h2>
						</div>
						<div className='section-divider' />
						<p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '12px' }}>
							These titles match your search — search our Browse page to see if they're listed near you.
						</p>
						{googleResults.length === 0 ? (
							<div className='empty-state' style={{ padding: '32px' }}>
								<p>No external suggestions found.</p>
							</div>
						) : (
							<div className='book-grid'>
								{googleResults.map(book => (
									<div key={book.id} className='book-card google-book-card'>
										{book.thumbnail
											? <img className='book-card-img' src={book.thumbnail} alt={book.title} />
											: <div className='book-card-img-placeholder'>📚</div>
										}
										<div className='book-card-body'>
											<p className='book-card-title'>{book.title}</p>
											{book.authors && <p className='book-card-isbn'>{book.authors}</p>}
											{book.publisher && <p className='book-card-isbn'>{book.publisher}</p>}
											<p className='book-card-desc'>{book.description}</p>
											{book.isbn && <p className='book-card-isbn'>ISBN: {book.isbn}</p>}
										</div>
										<div className='book-card-footer'>
											<span className='google-books-badge'>
												<Icon name='google' /> Google Books
											</span>
										</div>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>
		)
	}
}

export default AISearch
