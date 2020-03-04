import _ from 'lodash'
import React, {Component} from 'react'
import {Button, Container, Form, Search} from 'semantic-ui-react'
import axios from 'axios'

import '../index.css'

const initialState = {isLoading:false, results: [], value:'', formData : null, image:''}

class AddBookModal extends Component{
	state = initialState

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

	handleChange=(event)=>{
		this.setState({
			[event.target.name]: event.target.value,
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
				isLoading: false
			})
		}, 300)
	}

	handleResultSelect = (e, { result }) => this.setState({ value: result.title })

	handleSubmit = async(event)=>{

		event.preventDefault()
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
		this.props.listBook(this.state)
	}	

	handleImageUpload = (e)=>{
		const file = e.target.files[0]
		const fd = new FormData()
		fd.append('upload_preset', 'mufasa')
		
		fd.append('file', file)
		this.setState({
			formData : fd
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
			value={this.state.title}
			onChange={this.handleChange}/>
			</Form.Field>

			<Form.Field className='input'>
			<label>ISBN</label>
			<input placeholder='ISBN' type='text'
			maxLength={13}
			required={true}
			name='ISBN'
			value={this.state.ISBN}
			onChange={this.handleChange}/>
			</Form.Field>

			<Form.Field className='input'>
			<label>Price</label>
			<input placeholder='Price'
			required={true}
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

			<Button type='Submit'>List Book</Button>
			</Container>
			</Form>
			</div>
			</div>
			)
	}
}

export default AddBookModal