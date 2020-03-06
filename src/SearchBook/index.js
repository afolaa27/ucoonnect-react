import React, {Component} from 'react'
import {Button, Container, Form, Search, Grid, Input,Checkbox, Icon, Message, Divider} from 'semantic-ui-react'
import mapBox from 'mapbox-gl'
import FilteredBookList from '../FilteredBookList'
import BuyBookModal from '../BuyBookModal'

import '../index.css'
import 'mapbox-gl/dist/mapbox-gl.css'
mapBox.accessToken=process.env.REACT_APP_API_TOKEN

class SearchBook extends Component{
	constructor(props){
		super(props)
		this.state={
			books:[],
			lng: '',
			lat:'',
			zoom: 10,
			show: true,
			filteredBooks:[],
			search :'',
			searchLat : '',
			searchLng : '',
			message : '',
			visible:false,
			map : '',
			showFiltered : false,
			showBuyModal : false
		}
	}
	componentDidMount= async()=>{
		await this.getAddress(this.props.userAddress)
		await this.getBooks()
		this.handlemap()

	}
	getAddress= async(address)=>{
		const mapBox = await fetch(
			'https://api.mapbox.com/geocoding/v5/mapbox.places/'+address+'.json?country=us&limit=10&access_token='+process.env.REACT_APP_API_TOKEN)
		const mapBoxJson = await mapBox.json()
		/*console.log('Mapbox result in search', mapBoxJson.features[0].center);*/
		this.setState({
			lng: mapBoxJson.features[0].center[0],
			lat: mapBoxJson.features[0].center[1]
		})
	}
	getSearchCordinates= async(address)=>{
		const mapBox = await fetch(
			'https://api.mapbox.com/geocoding/v5/mapbox.places/'+address+'.json?country=us&limit=10&access_token='+process.env.REACT_APP_API_TOKEN)
		const mapBoxJson = await mapBox.json()
		/*console.log('Mapbox result in search', mapBoxJson.features[0].center);*/
		this.setState({
			searchLng: mapBoxJson.features[0].center[0],
			searchLat: mapBoxJson.features[0].center[1],
			lng: mapBoxJson.features[0].center[0],
			lat: mapBoxJson.features[0].center[1],
		})
	}
	handlemap=()=>{
		console.log('im hit');
		this.state.map = new mapBox.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/mapbox/streets-v11',
			center: [this.state.lng, this.state.lat],
			zoom: this.state.zoom
		})
	}

	getBooks= async ()=>{
		try{
			const bookResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/books/all',{
				credentials: 'include'
			})			
			const bookJson = await bookResponse.json()	
			console.log('the json >>>', bookJson.data)
			this.setState({
				books: bookJson.data
			})
		}
		catch(err){
			console.error(err)
		}
	}
	handleChange=(event)=>{
		this.setState({
			[event.target.name]: event.target.value,
		})

	}
	distance= async(book)=>{

		const bookAddress= await fetch(
			'https://api.mapbox.com/geocoding/v5/mapbox.places/'+book.address+'.json?country=us&limit=10&access_token='+process.env.REACT_APP_API_TOKEN)
		const bookAddressJson = await bookAddress.json()
		let bookLng = bookAddressJson.features[0].center[0]
		let bookLat = bookAddressJson.features[0].center[1]



		const getDistance = await fetch('https://api.mapbox.com/directions/v5/mapbox/driving/'+this.state.searchLng+','+this.state.searchLat+';'+bookLng +','+ bookLat+'?geometries=geojson&access_token='+process.env.REACT_APP_API_TOKEN)

		const distanceJson = await getDistance.json()
		console.log(">>>> distance between user and search address >>>>>,", distanceJson)
		
		let distanceMiles = Math.round((distanceJson.routes[0].distance/1609)*100)/100
		/*let driveTime = Math.round(distanceJson.routes[0].duration/60)
		
		console.log('returns directions	>>>',driveTime )*/
		book.distance = distanceMiles
		book.lat = bookLat
		book.lng = bookLng
		console.log('returns mile>>>', book)
		new mapBox.Marker().setLngLat([book.lng,book.lat]).addTo(this.state.map);
	
	}

	handleSubmit= async()=>{
		await this.getSearchCordinates(this.state.search)
		let booksDist = []

		if(this.state.books.length>0){
		
			this.state.books.forEach( (book) => {
				this.distance(book)
			})
			console.log('bookk >>', this.state.books)

			if(!this.state.books[0].distance){
				console.log("book aint got no distance")
				this.handleSubmit()

			} else {
				this.filterBooks(this.state.books)
				this.getBooks()
			}

		}else{
			this.handleDismiss()
			this.setState({
				visible:true,
				message : "there are no books available at this time please try again later!"
			})
		}

	}
	filterBooks = (books) => {
		let filteredList=books.filter((book) => book.distance <10)
		
		this.setState({
			filteredBooks : filteredList,
			showFiltered : true
		})
	}
	handleDismiss = () => {
		setTimeout(() => {
			this.setState({ visible: false })
		}, 3000)
	}
	favoriteBook = async(id)=>{
		const bookResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/favorites/'+id,{
				method:'POST',
				credentials:'include',
				headers:{
					'Content-Type':'application/json'
				}
			})	
	}
	/*buyBook = async(id)=>{
		await this.showBuyModal(id)

		const bookResponse = await fetch(process.env.REACT_APP_API_URL + '/api/v1/favorites/'+id,{
				method:'POST',
				credentials:'include',
				headers:{
					'Content-Type':'application/json'
				}
			})	
	}
	showBuyModal=(id)=>{
		console.log('i got it bro')
		this.setState({
			showBuyModal :true
		})
	}*/

	render(){

			// console.log("!!!!!!", this.state.books)
			// console.log("???????????", this.state.books[0].distance)
			console.log("Y U NOT FILTERED???", this.state.filteredBooks)


			return(
			<div> 
			{
				this.state.visible
				?
				<Message size='mini' color='black'
				header="Cant Find Books!"
				content={this.state.message}
				/>
				: 
				null
			}
				
					<div className='searchT'>
						<Form onSubmit={this.handleSubmit}>
							<Input 
								name='search'
								value={this.state.search}
								onChange={this.handleChange}
								required={true}
								className='inputSearch'
							/>
					
						<Button className='searchButton' type='Submit' icon='search' >search</Button>
						</Form>
				
					</div>
					<div className='searchTm'>
						<div ref={el => this.mapContainer = el} className='mapContainer'>
						</div>
					</div>
					{
						
							this.state.showFiltered
							?
									<div className='filteredBooks'>
									<h2>Books Around Me</h2>
										<FilteredBookList books={this.state.filteredBooks} favorite={this.favoriteBook}/>
									</div>
							:
							null
					}
					

					
				
			</div>
			)
		}

}
export default SearchBook