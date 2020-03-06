import _ from 'lodash'
import React, {Component} from 'react'
import {Button, Container, Form, Search} from 'semantic-ui-react'
import axios from 'axios'

import '../index.css'

const initialState = {isLoading:false, results: [], value:'', formData : null, image:''}

class EditBookForm extends Component{
	state = initialState

	componentDidMount=()=>{
		this.loadState()
	}
	loadState=()=>{
		this.setState({
			value : this.props.bookToEdit.address
		})
	}
	getAddress=async()=>{
		
		const mapBox = await fetch(
				'https://api.mapbox.com/geocoding/v5/mapbox.places/'+this.state.value+'.json?country=us&limit=10&access_token='+process.env.REACT_APP_API_TOKEN)
			const mapBoxJson = await mapBox.json()
			

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
			
	}

	handleSearchChange = (e, { value }) => {
    	this.setState({ isLoading: true, value })
	    setTimeout(() => {
	      if (this.state.value.length < 1){
	      	return this.setState(initialState)
	      } 
	      
    	  this.getAddress()
	      this.setState({
	        isLoading: false,
	        ...this.props.bookToEdit
	      })
	 	}, 300)
  	}


  	handleResultSelect = (e, { result }) => this.setState({ value: result.title })

  	handleSubmit = async(event)=>{
  		
  		event.preventDefault()
  		console.log("here i am",this.state.formData)

  		axios.post('https://api.cloudinary.com/v1_1/mufasa/image/upload', this.state.formData)
  		.then(res=>{
  			console.log("the image url",res.data.url)
  			this.setState({
  				image : res.data.url
  			})
  		})
  		.then(()=> this.submit())


  	}
  	submit=()=>{
 		this.props.updateBook(this.state)
 	}	

  	handleImageUpload = async (e)=>{

  		const file = e.target.files[0]
  		const fd = new FormData()
  		fd.append('upload_preset', 'mufasa')
  		
  		await fd.append('file', file)
  		console.log(fd)
  		this.setState({
  			formData : await fd
  		})
  	}

	render(){
			return(
			<div className='LoginRegisterForm'> 
				<div className='formDiv'>
				<Form onSubmit={this.handleSubmit}>
				<Container>
					<Form.Field className='input'>
						<label>Title</label>
						<input placeholder='Title'
						name='title'
						value={this.props.bookToEdit.title}
						onChange={this.props.handleEditChange}/>
					</Form.Field>

					<Form.Field className='input'>
						<label>ISBN</label>
						<input placeholder='ISBN' type='text'
						maxLength={13}
						required={true}
						name='ISBN'
						value={this.props.bookToEdit.ISBN}
						onChange={this.props.handleEditChange}/>
					</Form.Field>

					<Form.Field className='input'>
						<label>Price</label>
						<input placeholder='Price'
						required={true}
						name='price'
						value={this.props.bookToEdit.price}
						onChange={this.props.handleEditChange}/>
					</Form.Field>

					<Form.Field className='input'>
						<label>Description</label>
						<input placeholder='Description' type='text'
						required={true}
						name='description'
						value={this.props.bookToEdit.description}
						onChange={this.props.handleEditChange}/>
					</Form.Field>

					<Form.Field className='input'>
						<input type='file'
							label="Photo"
							name='photo'
							onChange={this.handleImageUpload}
						/>
					</Form.Field>

					<Form.Field className='input'>
						<label>Pick up Address</label>
				          <Search
				          	label= 'Pick up address'
				          	name='value'
				            loading={this.state.isLoading}
				            
				            onResultSelect={this.handleResultSelect}
							onSearchChange={_.debounce(this.handleSearchChange, 500, {
              					leading: true,
            				})}
				            results={this.state.results}
				            value={this.state.value}
				          />
					</Form.Field>

					<Button type='Submit'>Update Book</Button>
				</Container>
				</Form>
				</div>
			</div>
			)
		}
}

export default EditBookForm