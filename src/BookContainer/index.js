import React, {Component} from 'react'
import BookList from '../BookList'

import '../index.css'

import {Button, Message} from 'semantic-ui-react'


class BookContainer extends Component{
	constructor(props){
		super(props)
		this.state={
			books : [],
			visible : true
		}
	}
	componentDidMount(){
		this.getBooks()
		this.handleDismiss()
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
	 handleDismiss = () => {
      setTimeout(() => {
        this.setState({ visible: false })
      }, 2700)
    }
	
	render(){
			
			return(
			<div> 
				
      			
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
      
				<BookList books={this.state.books}/>
			</div>
			)
		}
}

export default BookContainer