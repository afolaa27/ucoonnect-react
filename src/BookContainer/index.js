import React, {Component} from 'react'
import BookList from '../BookList'
import NavBarContainer from '../NavBarContainer'
import AddBookModal from '../AddBookModal'
import EditBookForm from '../EditBookForm'
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
		try{
			const bookResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/books/',{
				credentials: 'include'
			})			
			const bookJson = await bookResponse.json()	
			this.setState({
				books: bookJson.data
			})
		}
		catch(err){
			console.log(err)
		}
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
					books:[...this.state.books, addBookJson.data]
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
		      console.log(err)
		  }
	}
	openEditForm =()=>{
		this.setState({

			editVisible: true,
			state:false,
		})
	}
	closeEditForm =()=>{
		this.setState({
			addBookModalVisible: true,
			editVisible: false,
			state:false,
		})
	}
	openAddBookModal=()=>{
		this.openEditForm()
		this.setState({
			addBookModalVisible: false,
			state: false,
			
		})
	}
	
	closeAddBookModal=()=>{

		this.setState({
			addBookModalVisible: true,
			editVisible: false,
			state : true	
		})

	}

	render(){

		console.log('After setState the state >>>>', this.state.bookToEdit)
		return(
			<div> 

			<NavBarContainer logout={this.props.logout} closeModal={this.closeAddBookModal} 
			openModal={this.openAddBookModal} 
			homeState={this.state.state}
			closeModal={this.closeAddBookModal}/>
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