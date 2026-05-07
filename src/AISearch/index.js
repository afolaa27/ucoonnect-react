import React, { Component } from 'react'
import { Button, Form, Input, Icon } from 'semantic-ui-react'
import BookDetailModal from '../BookDetailModal'
import '../LoginRegisterForm/index.css'

const SUBJECTS = ['All','Mathematics','Computer Science','Engineering','Physics','Chemistry',
	'Biology','Business','Economics','Psychology','Sociology','History','Literature',
	'Philosophy','Art & Design','Music','Medicine & Health','Law','Political Science','Education','Other']

class AISearch extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: '',
			featuredBooks: [],
			internalResults: [],
			bookPreviews: [],
			loading: false,
			searched: false,
			sortBy: 'none',
			subjectFilter: 'All',
			conditionFilter: 'All',
			selectedBook: null,
		}
	}

	componentDidMount() {
		this.loadFeatured()
	}

	loadFeatured = async () => {
		try {
			const res = await fetch(`${process.env.REACT_APP_API_URL}/api/v1/books/all`, { credentials: 'include' })
			const json = await res.json()
			this.setState({ featuredBooks: (json.data || []).slice(0, 6) })
		} catch (e) {}
	}

	handleChange = (e) => this.setState({ query: e.target.value })

	search = async () => {
		const { query } = this.state
		if (!query.trim()) return
		this.setState({ loading: true, searched: false })

		try {
			const [internalRes, openLibRes] = await Promise.all([
				fetch(
					`${process.env.REACT_APP_API_URL}/api/v1/books/recommend?q=${encodeURIComponent(query)}`,
					{ credentials: 'include' }
				),
				fetch(
					`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=title,author_name,first_sentence,cover_i,isbn,subject&limit=6`
				)
			])

			const internalJson = await internalRes.json()
			const openLibJson = await openLibRes.json()

			const bookPreviews = (openLibJson.docs || []).map(item => {
				const firstSentence = item.first_sentence
					? (Array.isArray(item.first_sentence)
						? item.first_sentence[0]
						: (item.first_sentence.value || item.first_sentence))
					: null
				const subjects = (item.subject || []).slice(0, 4).join(' · ')
				return {
					title: item.title || 'Unknown Title',
					authors: (item.author_name || []).join(', '),
					description: firstSentence || subjects || null,
					cover: item.cover_i
						? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
						: null,
					isbn: item.isbn ? item.isbn[0] : null,
				}
			})

			this.setState({
				internalResults: internalJson.data || [],
				bookPreviews,
				loading: false,
				searched: true,
			})
		} catch (e) {
			this.setState({ loading: false, searched: true })
		}
	}

	applyFilters(books) {
		const { sortBy, subjectFilter, conditionFilter } = this.state
		let out = [...books]
		if (subjectFilter !== 'All') out = out.filter(b => b.subject === subjectFilter)
		if (conditionFilter !== 'All') out = out.filter(b => b.condition === conditionFilter)
		if (sortBy === 'price-asc') out.sort((a, b) => a.price - b.price)
		else if (sortBy === 'price-desc') out.sort((a, b) => b.price - a.price)
		return out
	}

	openDetail = (book) => this.setState({ selectedBook: book })
	closeDetail = () => this.setState({ selectedBook: null })

	renderInternalCard = (book, key) => {
		const { favorite, openChat } = this.props
		return (
			<div key={key} className='book-card'>
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
					</div>
					<div className='book-card-footer'>
						<Button size='small' color='violet' onClick={() => this.openDetail(book)}>
							<Icon name='idea' />Ask AI
						</Button>
						{favorite && (
							<Button size='small' color='blue' onClick={() => favorite(book.id)}>
								<Icon name='heart' />Save
							</Button>
						)}
						{openChat && (
							<Button size='small' color='green' onClick={() => openChat(book)}>
								<Icon name='comment' />Make Offer
							</Button>
						)}
					</div>
				</div>
			</div>
		)
	}

	renderPreviewCard = (book, i) => (
		<div key={i} className='book-card preview-card'>
			{book.cover
				? <img className='book-card-img' src={book.cover} alt={book.title} />
				: <div className='book-card-img-placeholder'>📚</div>
			}
			<div className='book-card-right'>
				<div className='book-card-body'>
					<p className='book-card-title'>{book.title}</p>
					{book.authors && <p className='book-card-isbn'>{book.authors}</p>}
					{book.isbn && <p className='book-card-isbn'>ISBN: {book.isbn}</p>}
					{book.description && (
						<p className='book-card-desc preview-desc'>"{book.description}"</p>
					)}
				</div>
				<div className='book-card-footer'>
					<Button size='small' color='violet' onClick={() => this.openDetail(book)}>
						<Icon name='idea' />Ask AI
					</Button>
					<span className='preview-badge'>
						<Icon name='book' /> Open Library
					</span>
				</div>
			</div>
		</div>
	)

	render() {
		const { query, featuredBooks, internalResults, bookPreviews, loading, searched, sortBy, subjectFilter, conditionFilter, selectedBook } = this.state

		const filterBar = (
			<div className='booklist-filters'>
				<div className='filter-group'>
					<span className='filter-label'>Sort by</span>
					<select className='filter-dropdown' value={sortBy} onChange={e => this.setState({ sortBy: e.target.value })}>
						<option value='none'>Default</option>
						<option value='price-asc'>Price: Low to High</option>
						<option value='price-desc'>Price: High to Low</option>
					</select>
					<span className='filter-label' style={{marginLeft:'16px'}}>Subject</span>
					<select className='filter-dropdown' value={subjectFilter} onChange={e => this.setState({ subjectFilter: e.target.value })}>
						{SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
					</select>
					<span className='filter-label' style={{marginLeft:'16px'}}>Condition</span>
					<select className='filter-dropdown' value={conditionFilter} onChange={e => this.setState({ conditionFilter: e.target.value })}>
						{['All','New','Like New','Good','Fair','Poor'].map(c => <option key={c} value={c}>{c}</option>)}
					</select>
				</div>
			</div>
		)

		return (
			<div className='listContainer'>
				{selectedBook && (
					<BookDetailModal book={selectedBook} onClose={this.closeDetail} />
				)}

				<div className='ai-search-hero'>
					<div className='ai-search-icon'>✨</div>
					<h2 className='section-title'>Discover Books</h2>
					<p className='ai-search-sub'>Search our marketplace, then tap "Ask AI" on any book to get a summary or ask questions</p>
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

				{/* ── Featured books (before search) ── */}
				{!searched && featuredBooks.length > 0 && (() => {
					const filtered = this.applyFilters(featuredBooks)
					return (
						<>
							<div className='section-header'>
								<h2 className='section-title'>
									Available on UConnect
									<span className='ai-count-badge'>{filtered.length}</span>
								</h2>
							</div>
							<div className='section-divider' />
							{filterBar}
							{filtered.length === 0 ? (
								<div className='empty-state' style={{padding:'32px'}}>
									<p>No books match the selected filters.</p>
								</div>
							) : (
								<div className='book-grid'>
									{filtered.map(book => this.renderInternalCard(book, book.id))}
								</div>
							)}
						</>
					)
				})()}

				{/* ── Search results ── */}
				{searched && (
					<>
						<div className='section-header'>
							<h2 className='section-title'>
								Available on UConnect
								<span className='ai-count-badge'>{internalResults.length}</span>
							</h2>
						</div>
						<div className='section-divider' />
						{filterBar}
						{(() => {
							const filtered = this.applyFilters(internalResults)
							return filtered.length === 0 ? (
								<div className='empty-state' style={{ padding: '32px' }}>
									<p>No listings match that search — check back later or browse all books.</p>
								</div>
							) : (
								<div className='book-grid'>
									{filtered.map(book => this.renderInternalCard(book, book.id))}
								</div>
							)
						})()}

						<div className='section-header' style={{ marginTop: '40px' }}>
							<h2 className='section-title'>
								Book Descriptions
								<span className='ai-count-badge'>{bookPreviews.length}</span>
							</h2>
						</div>
						<div className='section-divider' />
						<p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '16px' }}>
							Descriptions from Open Library — tap "Ask AI" to learn more, or search Browse to find listings near you.
						</p>
						{bookPreviews.length === 0 ? (
							<div className='empty-state' style={{ padding: '32px' }}>
								<p>No book descriptions found for that search.</p>
							</div>
						) : (
							<div className='book-grid'>
								{bookPreviews.map((book, i) => this.renderPreviewCard(book, i))}
							</div>
						)}
					</>
				)}
			</div>
		)
	}
}

export default AISearch
