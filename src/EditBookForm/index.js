import _ from 'lodash'
import React, {Component} from 'react'
import {Button, Form, Search} from 'semantic-ui-react'
import axios from 'axios'

import '../LoginRegisterForm/index.css'

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

	getAddress = async (query) => {
		if (!query || query.length < 2) {
			this.setState({ results: [], isLoading: false })
			return
		}
		try {
			const res = await fetch(
				`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&countrycodes=us`,
				{ headers: { 'Accept-Language': 'en' } }
			)
			const data = await res.json()
			const arrOfResults = data.map((item, i) => ({ title: item.display_name, key: i }))
			this.setState({ results: arrOfResults, isLoading: false })
		} catch (e) {
			this.setState({ isLoading: false })
		}
	}

	handleSearchChange = (e, { value }) => {
		this.setState({ value, isLoading: value.length > 1 })
		this.getAddress(value)
	}

	handleResultSelect = (e, { result }) => this.setState({ value: result.title })

	handleSubmit = async(event)=>{
		event.preventDefault()
		console.log("here i am", this.state.formData)

		axios.post('https://api.cloudinary.com/v1_1/mufasa/image/upload', this.state.formData)
		.then(res=>{
			console.log("the image url", res.data.url)
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
			<div className='form-page'>
			<div className='form-card'>
				<p className='form-card-title'>✏️ Edit Book Listing</p>
				<Form onSubmit={this.handleSubmit}>
					<Form.Field>
						<label>Title</label>
						<input placeholder='Title'
						name='title'
						value={this.props.bookToEdit.title}
						onChange={this.props.handleEditChange}/>
					</Form.Field>

					<Form.Field>
						<label>ISBN</label>
						<input placeholder='ISBN' type='text'
						maxLength={13}
						required={true}
						name='ISBN'
						value={this.props.bookToEdit.ISBN}
						onChange={this.props.handleEditChange}/>
					</Form.Field>

					<Form.Field>
						<label>Price ($)</label>
						<input placeholder='Price'
						required={true}
						name='price'
						value={this.props.bookToEdit.price}
						onChange={this.props.handleEditChange}/>
					</Form.Field>

					<Form.Field>
						<label>Description</label>
						<input placeholder='Description' type='text'
						required={true}
						name='description'
						value={this.props.bookToEdit.description}
						onChange={this.props.handleEditChange}/>
					</Form.Field>

					<Form.Field>
						<label>Cover Photo</label>
						<input type='file'
							name='photo'
							onChange={this.handleImageUpload}
						/>
					</Form.Field>

					<Form.Field>
						<label>Pickup Address</label>
						<Search
							name='value'
							loading={this.state.isLoading}
							onResultSelect={this.handleResultSelect}
							onSearchChange={_.debounce(this.handleSearchChange, 400, { leading: false })}
							results={this.state.results}
							value={this.state.value}
							placeholder='Start typing an address...'
						/>
					</Form.Field>

					<Button primary type='Submit' style={{width:'100%', marginTop:'8px'}}>Update Book</Button>
				</Form>
			</div>
			</div>
		)
	}
}

export default EditBookForm
