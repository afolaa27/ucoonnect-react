import React, {Component} from 'react'
import { Item, Button, Image, Container,Icon} from 'semantic-ui-react'
import FavoriteBooksList from '../FavoriteBooksList'
import '../index.css'

class FavoriteBooks extends Component{
	constructor(props){
		super(props)
		this.state={
			favorites : []
		}
	}
	componentDidMount= async()=>{
		await this.getFavorites()
	}
	getFavorites = async()=>{
		try{
			const favoriteBooksResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/favorites/',{
				credentials: 'include'
			})			
			const favoriteBooksJson = await favoriteBooksResponse.json()	
			console.log('information recieved>>>',favoriteBooksJson)
			this.setState({
				favorites: favoriteBooksJson.data
			})
		}
		catch(err){
			console.error(err)
		}
	}
	deleteFavorite = async(id)=>{
		try{
		    const deleteResponse = await fetch(process.env.REACT_APP_API_URL+'/api/v1/favorites/'+ id, {
		    	method : 'DELETE',
		    	credentials:'include'
		    })
		    const deleteJson = deleteResponse.json();
		    if(deleteJson.status===200){
		    	this.setState({
		    		favorites: this.state.favorites.filter(book=>book.id !==id)
		    	})
		    }else{
		    	throw new Error('Cant delete this book')
		    }
		  }
		    catch(err){
		      console.error(err)
		  }
		  this.getFavorites()
	}
	render(){
		console.log("these are my favorites>>>",this.state.favorites)
		return(
			<FavoriteBooksList books={this.state.favorites} deleteFavorite={this.deleteFavorite}/>
			
		)
}
}
export default FavoriteBooks