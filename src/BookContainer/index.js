import React, {Component} from 'react'
import io from 'socket.io-client'
import BookList from '../BookList'
import NavBarContainer from '../NavBarContainer'
import AddBookModal from '../AddBookModal'
import EditBookForm from '../EditBookForm'
import SearchBook from '../SearchBook'
import FavoriteBooks from '../FavoriteBooks'
import AISearch from '../AISearch'
import ChatModal from '../ChatModal'
import OffersPanel from '../OffersPanel'
import ProfileModal from '../ProfileModal'
import '../LoginRegisterForm/index.css'
import {Message} from 'semantic-ui-react'

function haversineDistance(lat1, lon1, lat2, lon2) {
	const R = 3958.8
	const dLat = (lat2 - lat1) * (Math.PI / 180)
	const dLon = (lon2 - lon1) * (Math.PI / 180)
	const a = Math.sin(dLat / 2) ** 2 +
		Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
	return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 10) / 10
}

async function geocode(address) {
	const controller = new AbortController()
	const timer = setTimeout(() => controller.abort(), 5000)
	try {
		const res = await fetch(
			`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`,
			{ headers: { 'Accept-Language': 'en' }, signal: controller.signal }
		)
		const data = await res.json()
		if (data && data[0]) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
	} catch (e) {}
	finally { clearTimeout(timer) }
	return null
}


class BookContainer extends Component{
	constructor(props){
		super(props)
		this.state={
			books : [],
			booksReady: false,
			visible : props.justLoggedIn || false,
			addBookModalVisible : true,
			state : true,
			editVisible : false,
			buyVisible : false,
			favVisible : false,
			discoverVisible : false,
			offersVisible : false,
			chatBook : null,
			currentUser : null,
			profileVisible: false,
			notifications: [],
			notifCount: 0,
			notifPanelOpen: false,
			bookToEdit :{
				title : '',
				price : '',
				description : '',
				ISBN : '',
				address : ''
			}
		}
	}
	componentDidMount(){
		this.getBooks()
		this.handleDismiss()
		this.pollNotifications()
		this.notifInterval = setInterval(this.pollNotifications, 30000)
		this.getCurrentUser()
	}

	componentWillUnmount() {
		clearInterval(this.notifInterval)
		clearTimeout(this.notifTimer)
		if (this.userSocket) this.userSocket.disconnect()
	}
	handleDismiss = () => {
		setTimeout(() => {
			this.setState({ visible: false })
		}, 2000)
	}

	getBooks = async () => {
		try {
			const bookResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/books/', {
				method: 'GET',
				credentials: 'include'
			})
			const bookJson = await bookResponse.json()
			const books = bookJson.data || []
			this.setState({ books, booksReady: true })
			this._distGen = (this._distGen || 0) + 1
			this.computeDistances(books, this._distGen)
		} catch (err) {
			console.error(err)
			this.setState({ booksReady: true })
		}
	}

	computeDistances = async (books, gen) => {
		if (!this.props.userAddress || !books.length) return
		const userCoords = await geocode(this.props.userAddress)
		if (!userCoords || this._distGen !== gen) return
		const distances = {}
		for (const book of books) {
			if (this._distGen !== gen) return
			if (!book.address) continue
			const coords = await geocode(book.address)
			if (coords) distances[book.id] = haversineDistance(userCoords.lat, userCoords.lng, coords.lat, coords.lng)
		}
		if (this._distGen !== gen) return
		this.setState(prev => ({
			books: prev.books.map(b => b.id in distances ? { ...b, distance: distances[b.id] } : b)
		}))
	}

	addBook = async(bookToAdd)=>{
	
		try{
			const addBookResponse = await fetch(process.env.REACT_APP_API_URL+'/api/v1/books/',{
				method:'POST',
				body:JSON.stringify(bookToAdd),
				credentials:'include',
				headers:{
					'Content-Type':'application/json'
				}
			})
			const addBookJson = await addBookResponse.json()
			if(addBookResponse.status === 201){
				this.setState({
					books:[...this.state.books, addBookJson.data],
					addBookModalVisible : false,
				})
			}

		}

		catch(err){
			console.error(err)
		}
		this.closeAddBookModal()
	}
	deleteBook= async(id)=>{
		try{
		    const deleteResponse = await fetch(process.env.REACT_APP_API_URL+'/api/v1/books/'+ id, {
		    	method : 'DELETE',
		    	credentials:'include'
		    })
		    const deleteJson = deleteResponse.json();
		    if(deleteJson.status===200){
		    	this.setState({
		    		books: this.state.books.filter(book=>book.id !==id)
		    	})
		    }else{
		    	throw new Error('Cant delete this book')
		    }
		  }
		    catch(err){
		      console.error(err)
		  }
		  this.getBooks()
	}
	editBook=async(id)=>{
		const bookToEdit = this.state.books.find((book)=>book.id === id)
			
			this.openEditForm()
			this.setState({
				bookToEdit : {
					...bookToEdit
				}
			})
		

	}
	handleEditChange=(event)=>{
		this.setState({
			bookToEdit:{
				...this.state.bookToEdit,
				[event.target.name]: event.target.value
			}
		})
	}
	changeState=(bookEdited)=>{
	
		this.setState({
			bookToEdit:{
				...this.state.bookToEdit,
				address : bookEdited.value
			}
		})
	}
	
	updateBook= async (bookEdited)=>{
		

		const body = this.state.bookToEdit

		body.image = bookEdited.image
		body.address= bookEdited.value

		try{
		    const updateResponse = await fetch(process.env.REACT_APP_API_URL+'/api/v1/books/'+this.state.bookToEdit.id,{
		    	method:'PUT',
		    	body : JSON.stringify(body),
		    		credentials: 'include',
		    	headers:{
		    		'Content-Type' : 'application/json'
		    	}
		    })

		    const updateResponseJson = await updateResponse.json();
		    if(updateResponse.status===200){
		    	const newBookUpdated = this.state.books.map((book)=>{
		    		if(book.id === updateResponseJson.data.id){
		    			return updateResponseJson.data
		    		}else{
		    			return book
		    		}
		    	})
		    	this.setState({
		    		books : newBookUpdated
		    	})
		    	this.closeEditForm()

		    }
		  }
		    catch(err){
		      console.error(err)
		  }
	}
	buyBook= async(id)=>{

	}
	openEditForm =()=>{
		this.setState({
			editVisible: true,
			state: false,
			buyVisible: false,
			favVisible: false,
			discoverVisible: false,
			offersVisible: false,
			chatBook: null,
			profileVisible: false,
		})
	}
	closeEditForm =()=>{
		this.setState({
			addBookModalVisible: true,
			editVisible: false,
			state: false,
			buyVisible: false,
			favVisible: false,
			discoverVisible: false,
			offersVisible: false,
			chatBook: null,
			profileVisible: false,
		})
	}
	openAddBookModal=()=>{
		this.setState({
			addBookModalVisible: false,
			editVisible: false,
			state: false,
			buyVisible: false,
			favVisible: false,
			discoverVisible: false,
			offersVisible: false,
			chatBook: null,
			profileVisible: false,
		})
	}
	closeAddBookModal=()=>{
		this.setState({
			addBookModalVisible: true,
			editVisible: false,
			state: true,
			buyVisible: false,
			favVisible: false,
			discoverVisible: false,
			offersVisible: false,
			chatBook: null,
			profileVisible: false,
		})
	}
	openSearch=()=>{
		this.setState({
			buyVisible: true,
			favVisible: false,
			discoverVisible: false,
			offersVisible: false,
			addBookModalVisible: true,
			editVisible: false,
			chatBook: null,
			profileVisible: false,
		})
	}
	closeSearch=()=>{
		this.setState({
			buyVisible: false,
			favVisible: false,
			discoverVisible: false,
			offersVisible: false,
			chatBook: null,
			profileVisible: false,
		})
	}
	openFav=()=>{
		this.setState({
			favVisible: true,
			buyVisible: false,
			discoverVisible: false,
			offersVisible: false,
			addBookModalVisible: true,
			editVisible: false,
			chatBook: null,
			profileVisible: false,
		})
	}

	pollNotifications = async () => {
		try {
			const res = await fetch(process.env.REACT_APP_API_URL + '/api/v1/notifications/unread_count', { credentials: 'include' })
			const json = await res.json()
			this.setState({ notifCount: json.data.count })
		} catch (e) {}
	}

	fetchNotifications = async () => {
		try {
			const res = await fetch(process.env.REACT_APP_API_URL + '/api/v1/notifications/', { credentials: 'include' })
			const json = await res.json()
			this.setState({ notifications: json.data || [] })
		} catch (e) {}
	}

	toggleNotifPanel = async () => {
		const opening = !this.state.notifPanelOpen
		if (opening) {
			await this.fetchNotifications()
			clearTimeout(this.notifTimer)
			this.notifTimer = setTimeout(() => this.setState({ notifPanelOpen: false }), 15000)
		} else {
			clearTimeout(this.notifTimer)
		}
		this.setState({ notifPanelOpen: opening })
	}

	favoriteBook = async (id) => {
		await fetch(process.env.REACT_APP_API_URL + '/api/v1/favorites/' + id, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
		})
	}

	markRead = async (id) => {
		await fetch(process.env.REACT_APP_API_URL + `/api/v1/notifications/${id}/read`, {
			method: 'PATCH',
			credentials: 'include'
		})
		this.setState({
			notifications: this.state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
			notifCount: Math.max(0, this.state.notifCount - 1)
		})
	}

	openDiscover = () => {
		this.setState({ discoverVisible: true, buyVisible: false, favVisible: false, offersVisible: false, addBookModalVisible: true, editVisible: false, chatBook: null, profileVisible: false })
	}

	getCurrentUser = async () => {
		try {
			const res = await fetch(process.env.REACT_APP_API_URL + '/api/v1/users/loggedin', { credentials: 'include' })
			const json = await res.json()
			if (json.data) {
				this.setState({ currentUser: json.data })
				this.connectUserSocket(json.data.id)
			}
		} catch (e) {}
	}

	connectUserSocket = (userId) => {
		this.userSocket = io(process.env.REACT_APP_API_URL, { withCredentials: true })
		this.userSocket.on('connect', () => {
			this.userSocket.emit('join_user_room', { user_id: userId })
		})
		this.userSocket.on('new_notification', (data) => {
			this.setState(prev => ({
				notifCount: prev.notifCount + 1,
				notifications: [{ ...data, id: Date.now() }, ...prev.notifications],
			}))
		})
	}

	openChat = (book) => this.setState({ chatBook: book })
	closeChat = () => this.setState({ chatBook: null })

	openProfile = () => this.setState({ profileVisible: true })
	closeProfile = () => this.setState({ profileVisible: false })
	handleProfileUpdated = (updatedUser) => {
		this.setState({ currentUser: updatedUser })
		if (this.props.onAddressUpdated && updatedUser.address) {
			this.props.onAddressUpdated(updatedUser.address)
		}
	}

	openOffers = () => this.setState({ offersVisible: true, buyVisible: false, favVisible: false, discoverVisible: false, addBookModalVisible: true, editVisible: false, chatBook: null, profileVisible: false })

	render(){

		
			
		return(
			<React.Fragment>
			<div>

			<NavBarContainer
				logout={this.props.logout}
				closeModal={this.closeAddBookModal}
				openModal={this.openAddBookModal}
				homeState={this.state.state}
				openSearch={this.openSearch}
				openFav={this.openFav}
				openDiscover={this.openDiscover}
				openOffers={this.openOffers}
				notifCount={this.state.notifCount}
				notifications={this.state.notifications}
				notifPanelOpen={this.state.notifPanelOpen}
				toggleNotifPanel={this.toggleNotifPanel}
				markRead={this.markRead}
				openProfile={this.openProfile}
				currentUser={this.state.currentUser}
			/>
			<div className="listContainer">
			{this.state.visible && this.state.currentUser && (
				<Message size='mini' color='black'
					header={this.props.isNewUser
						? `Welcome to UConnect, ${this.state.currentUser.username}! 🎉`
						: `Welcome back, ${this.state.currentUser.username}!`}
					content={this.props.isNewUser ? 'Your account is ready. Browse books near you to get started.' : ''}
				/>
			)}
			</div>
			{
				this.state.discoverVisible
				?
					<AISearch favorite={this.favoriteBook} openChat={this.openChat} currentUser={this.state.currentUser} />
				:
					this.state.offersVisible
					?
						<OffersPanel currentUserId={this.state.currentUser && this.state.currentUser.id} onOfferAccepted={this.openCheckout} />
					:
						this.state.favVisible
						?
							<FavoriteBooks/>
						:
							this.state.buyVisible
							?
								<SearchBook userAddress={this.props.userAddress} openChat={this.openChat}/>
							:
								this.state.editVisible
								?

									<EditBookForm bookToEdit={this.state.bookToEdit} handleEditChange={this.handleEditChange}
										statePassed={this.state.bookToEdit}
										updateBook={this.updateBook}
										changeState={this.changeState}/>
								:
									this.state.addBookModalVisible
									?
										<BookList books={this.state.books} delete={this.deleteBook} edit={this.editBook} openOffers={this.openOffers}/>
									:
										<AddBookModal listBook={this.addBook}/>

			}
			</div>
			{this.state.chatBook && (
				<ChatModal
					book={this.state.chatBook}
					currentUser={this.state.currentUser}
					onClose={this.closeChat}
				/>
			)}
			{this.state.profileVisible && (
				<ProfileModal
					currentUser={this.state.currentUser}
					onClose={this.closeProfile}
					onUpdated={this.handleProfileUpdated}
					onDeleted={this.props.logout}
				/>
			)}
			</React.Fragment>
		)
	}
}

export default BookContainer