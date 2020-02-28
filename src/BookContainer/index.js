import React, {Component} from 'react'
import BookList from '../BookList'


import {Button} from 'semantic-ui-react'


class BookContainer extends Component{
	constructor(props){
		super(props)
		this.state={
			books : []
		}
	}
	componentDidMount(){
		this.getBooks()
	}
	getBooks = async()=>{
		try{
			const bookResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/books/',{
				credentials: 'include'
			})
			console.log("status of the fetch call>>>", bookResponse);
			
			const bookJson = await bookResponse.json()
			
			console.log("the json >>", bookJson);
			
			this.setState({
				books: bookJson.data
			})
		}
		catch(err){
			console.log(err)
		}
	}
	render(){
			// console.log("the state of books before sent to book list container>>", this.state.books);
			return(
			<div> 
				<BookList books={this.state.books}/>
			</div>
			)
		}
}

export default BookContainer