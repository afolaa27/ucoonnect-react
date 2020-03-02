import _ from 'lodash'
import React, {Component} from 'react'
import {Button, Container, Form, Search} from 'semantic-ui-react'

import '../index.css'

const initialState = {isLoading:false, results: [], value:''}

class AddBookModal extends Component{
	// constructor(props){
	// 	super(props)
	// 		this.state={
	// 			title:'',
	// 			ISBN: '',
	// 			price:'',
	// 			description: '',
	// 			address : '',
	// 			MapAddress : [],
	// 			loading : false
			    
	// 		}
	// 	}

	state = initialState

	getAddress=async()=>{
		console.log("access_token", process.env.REACT_APP_API_TOKEN);
		console.log("this is the add",this.state.value)
		const mapBox = await fetch(
				'https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.state.value+'.json?country=us&access_token='+process.env.REACT_APP_API_TOKEN)
			const mapBoxJson = await mapBox.json()
			console.log("mapbox json >> ", mapBoxJson)	
			console.log("lenth ", mapBoxJson.features);

			const arrOfResults = []
			for(let i = 0; i<mapBoxJson.features.length; i++){

					arrOfResults.push({
						title:mapBoxJson.features[i].place_name, 
						key:i
					})
			}


				this.setState({
					results : arrOfResults
				})


			console.log("results ", this.state.results);


	}

	handleChange=(event)=>{
		this.setState({
			[event.target.name]: event.target.value,
		})

	}


	handleSearchChange = (e, { value }) => {

    	this.setState({ isLoading: true, value })

	    setTimeout(() => {
	      if (this.state.value.length < 1){
	      	console.log("is this getting running??");
	      	return this.setState(initialState)
	      } 

	      
    	  this.getAddress()
	      this.setState({
	        isLoading: false
	      })
	 	}, 300)
  	}

	render(){
			console.log("this is the state in book modal >> ",this.state)
			return(
			<div className='LoginRegisterForm'> 

				<div className='formDiv'>
				<Form>
				<Container>
					<Form.Field className='input'>
						<label>Title</label>
						<input placeholder='Title'
						name='title'
						value={this.state.title}
						onChange={this.handleChange}/>
					</Form.Field>
					<Form.Field className='input'>
						<label>ISBN</label>
						<input placeholder='ISBN' type='text'
						required={true}
						name='ISBN'
						value={this.state.ISBN}
						onChange={this.handleChange}/>
					</Form.Field>
					<Form.Field className='input'>
						<label>Price</label>
						<input placeholder='Price'
						name='price'
						value={this.state.price}
						onChange={this.handleChange}/>
					</Form.Field>
					<Form.Field className='input'>
						<label>Description</label>
						<input placeholder='Description' type='text'
						required={true}
						name='description'
						value={this.state.description}
						onChange={this.handleChange}/>

						{/*<Form.Input  
            				search
            				label='Pickup Address'
            				name='address'
            				// options={this.state.MapAddress}
            				required={true}
            				placeholder='Address'
            				value={this.state.address}
							onChange={this.handleSelectChange}
          				/>*/}
					</Form.Field>
					<Form.Field className='input'>
					<input type='file'
					/>
					</Form.Field>
					<Form.Field className='input'>
						<label>Pick up Address</label>
				          <Search
				          	label= 'Pick up address'
				          	name='value'
				            loading={this.state.loading}
				            // onSearchChange={this.handleSearchChange}
							onSearchChange={_.debounce(this.handleSearchChange, 500, {
              					leading: true,
            				})}
				            results={this.state.results}
				            value={this.state.value}
				          />
					</Form.Field>
					{/*<Image cloudName="demo" publicId="sample" width="300" crop="scale" />*/}
					<Button type='Submit'>List Book</Button>
				</Container>
				</Form>
				</div>
			</div>
			)
		}
}

export default AddBookModal