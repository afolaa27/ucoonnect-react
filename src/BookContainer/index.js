import React, {Component} from 'react'
import BookList from '../BookList'
import NavBarContainer from '../NavBarContainer'
import AddBookModal from '../AddBookModal'
import '../index.css'

import {Message} from 'semantic-ui-react'


class BookContainer extends Component{
	constructor(props){
		super(props)
		this.state={
			books : [],
			visible : true,
			addBookModalVisible : false,
			state : true
		}
	}
	componentDidMount(){
		this.getBooks()
		this.handleDismiss()
	}
	handleDismiss = () => {
		setTimeout(() => {
			this.setState({ visible: false })
		}, 2700)
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
		console.log("this is the book>>>", bookToAdd)
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
	openAddBookModal=()=>{
		this.setState({
			addBookModalVisible: true,
			state: false
		})
	}
	
	closeAddBookModal=()=>{
		this.setState({
			addBookModalVisible: false,
			state : true
		})
	}
	render(){

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
				<Message size='mini'
				header='Welcome back!'
				content=''
				/>
				: 
				null
			}
			</div>
			{

				this.state.state
				?
				<BookList books={this.state.books}/>
				:
				<AddBookModal listBook={this.addBook}/>
			}
			</div>
			)
	}
}

export default BookContainer