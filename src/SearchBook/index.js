import React, {Component} from 'react'
import {Button, Container, Form, Search, Grid, Input,Checkbox, Icon} from 'semantic-ui-react'
import mapBox from 'mapbox-gl'


import '../index.css'
mapBox.accessToken=process.env.REACT_APP_API_TOKEN

class SearchBook extends Component{
	constructor(props){
		super(props)
		this.state={
			books:[],
			lng: '',
			lat:'',
			zoom: 6,
			show: true,
			filteredBooks:[],
			search :'',
			searchLat : '',
			searchLng : '',
			bookLat : '',
			bookLong : ''
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
			searchLat: mapBoxJson.features[0].center[1]
		})
	}
	handlemap=()=>{
		console.log('im hit');
		const map = new mapBox.Map({
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
	distance= async()=>{
		const getDistance = await fetch('https://api.mapbox.com/directions/v5/mapbox/driving/'+this.state.searchLng+','+this.state.searchLat+';-88.003580,44.517120?geometries=geojson&access_token='+process.env.REACT_APP_API_TOKEN)
		const distanceJson = await getDistance.json()
		let distanceMiles = Math.round(distanceJson.routes[0].distance/1609)
		/*let driveTime = Math.round(distanceJson.routes[0].duration/60)
		
		console.log('returns directions	>>>',driveTime )*/
		console.log('returns mile>>>',distanceMiles )
		
	}
	handleSubmit= async()=>{
		await this.getSearchCordinates(this.state.search)
		this.distance()
	}

	render(){
			
			return(
			<div> 
				<Container>
					<Grid.Column>
						<Form onSubmit={this.handleSubmit}>
							<Input icon='search' 
								name='search'
								value={this.state.search}
								onChange={this.handleChange}
							/>
							<Button type='Submit' >search</Button>
						</Form>
					</Grid.Column>
					<div ref={el => this.mapContainer = el} className='mapContainer'>
					</div>
					
				</Container>
			</div>
			)
		}

}

export default SearchBook