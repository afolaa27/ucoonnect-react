import _ from 'lodash'
import React, {Component} from 'react'
import {Button, Container, Form, Search} from 'semantic-ui-react'
import axios from 'axios'

import '../LoginRegisterForm/index.css'

const SUBJECTS = [
	'Mathematics', 'Computer Science', 'Engineering', 'Physics', 'Chemistry',
	'Biology', 'Business', 'Economics', 'Psychology', 'Sociology',
	'History', 'Literature', 'Philosophy', 'Art & Design', 'Music',
	'Medicine & Health', 'Law', 'Political Science', 'Education', 'Other'
]

const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Poor']

const initialState = {isLoading:false, results: [], value:'', formData: null, image:'', subject:'', condition:''}


//prepare to redeploy
class AddBookModal extends Component{
	state = initialState

	getAddress = async (query) => {
		if (!query || query.length < 4) {
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

	handleChange=(event)=>{
		this.setState({
			[event.target.name]: event.target.value,
		})

	}

	handleSearchChange = (e, { value }) => {
		this.setState({ value, isLoading: value.length >= 4 })
		this.getAddress(value)
	}

	handleResultSelect = (e, { result }) => this.setState({ value: result.title })

	handleSubmit = async(event)=>{

		event.preventDefault()
		console.log('data>>', this.state.formData)
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
			<div className='form-page'>
			<div className='form-card'>
				<p className='form-card-title'>📚 List a Book for Sale</p>
				<Form onSubmit={this.handleSubmit}>
					<Form.Field>
						<label>Title</label>
						<input placeholder='e.g. Introduction to Algorithms'
						name='title'
						value={this.state.title}
						onChange={this.handleChange}/>
					</Form.Field>

					<Form.Field>
						<label>ISBN</label>
						<input placeholder='13-digit ISBN'
						type='text'
						maxLength={13}
						required={true}
						name='ISBN'
						value={this.state.ISBN}
						onChange={this.handleChange}/>
					</Form.Field>

					<Form.Field>
						<label>Price ($)</label>
						<input placeholder='e.g. 45'
						required={true}
						name='price'
						value={this.state.price}
						onChange={this.handleChange}/>
					</Form.Field>

					<Form.Field>
						<label>Description</label>
						<input placeholder='Condition, edition, any notes...'
						type='text'
						required={true}
						name='description'
						value={this.state.description}
						onChange={this.handleChange}/>
					</Form.Field>

					<Form.Field>
						<label>Condition</label>
						<select
							name='condition'
							value={this.state.condition}
							onChange={this.handleChange}
							style={{width:'100%', padding:'9px 12px', borderRadius:'4px', border:'1px solid rgba(34,36,38,.15)', fontSize:'1em'}}
						>
							<option value=''>Select condition...</option>
							{CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
						</select>
					</Form.Field>

					<Form.Field>
						<label>Subject Category</label>
						<select
							name='subject'
							value={this.state.subject}
							onChange={this.handleChange}
							style={{width:'100%', padding:'9px 12px', borderRadius:'4px', border:'1px solid rgba(34,36,38,.15)', fontSize:'1em'}}
						>
							<option value=''>Select a subject...</option>
							{SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
						</select>
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
						onSearchChange={_.debounce(this.handleSearchChange, 800, { leading: false })}
						results={this.state.results}
						value={this.state.value}
						placeholder='Start typing an address...'
						/>
					</Form.Field>

					<Button primary type='Submit' style={{width:'100%', marginTop:'8px'}}>List Book</Button>
				</Form>
			</div>
			</div>
			)
	}
}

export default AddBookModal