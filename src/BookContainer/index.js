import React, {Component} from 'react'
import BookList from '../BookList'
import NavBarContainer from '../NavBarContainer'
import AddBookModal from '../AddBookModal'
import EditBookForm from '../EditBookForm'
import SearchBook from '../SearchBook'
import FavoriteBooks from '../FavoriteBooks'
import '../index.css'

import {Message} from 'semantic-ui-react'


class BookContainer extends Component{
	constructor(props){
		super(props)
		this.state={
			books : [],
			visible : true,
			addBookModalVisible : true,
			state : true,
			editVisible : false,
			buyVisible : false,
			favVisible : false,
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
	}
	handleDismiss = () => {
		setTimeout(() => {
			this.setState({ visible: false })
		}, 2000)
	}

	getBooks = async()=>{	
		try{]
			console.log("i made it into get books function")
			const bookResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/books',{
				credentials: 'include'
			})			
			const bookJson = await bookResponse.json()
			console.log("this are the books >>" + bookJson.data)	
			this.setState({
				books: bookJson.data
			})
		}
		catch(err){
			console.error(err)
		}
	}

	addBook = async(bookToAdd)=>{
	
		try{
			const addBookResponse = await fetch(process.env.REACT_APP_API_URL+'/api/v1/books',{
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
			state:false,
			buyVisible:false,
			favVisible : false
		})
	}
	closeEditForm =()=>{
		this.setState({
			addBookModalVisible: true,
			editVisible: false,
			state:false,
			buyVisible: false
		})
	}
	openAddBookModal=()=>{
		this.closeSearch()
		this.openEditForm()
		this.setState({
			addBookModalVisible: false,
			state: false,
			editVisible: false,
			buyVisible: false,
			favVisible : false
			
		})
	}
	closeAddBookModal=()=>{
		this.setState({
			addBookModalVisible: true,
			editVisible: false,
			state : true,
			buyVisible: false	
		})

	}
	openSearch=()=>{
		this.setState({
			buyVisible : true,
			favVisible : false
		})
	}
	closeSearch=()=>{
		this.setState({
			buyVisible : false,
			favVisible : false
		})
	}
	openFav=()=>{
		this.setState({
			favVisible : true
		})
	}

	render(){

		
			
		return(
			<div> 

			<NavBarContainer logout={this.props.logout} closeModal={this.closeAddBookModal} 
			openModal={this.openAddBookModal} 
			homeState={this.state.state}
			closeModal={this.closeAddBookModal}
			openSearch={this.openSearch}
			openFav={this.openFav}/>
			<div className="listContainer">
			{
				this.state.visible
				?
				<Message size='mini' color='black'
				header='Welcome back!'
				content=''
				/>
				: 
				null
			}
			</div>
			{
				this.state.favVisible
				?
					<FavoriteBooks/>
				:
					this.state.buyVisible
					?
						<SearchBook userAddress={this.props.userAddress}/>
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
								<BookList books={this.state.books} delete={this.deleteBook} edit={this.editBook}/>
							:
								<AddBookModal listBook={this.addBook}/>

			}
			</div>
			)
	}
}

export default BookContainer