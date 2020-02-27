import React, {Component} from 'react'
import {Form,Button, Search} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './index.css'
import schoolKey from './schools'


class LoginRegisterForm extends Component{
	constructor(props){
		super(props)

		this.state={
			email:'',
			password:'',
			username:'',
			age:'',
			school:'',
			action:'login',
			regexEmail: new RegExp('/[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm'),
			message : '',
			displayMessage: false
		}
	}
	switchForm =()=>{
		if(this.state.action ==='login'){
			this.setState({
				action:'register'
			})
		}
		else{
			this.setState({
				action:'login'
			})
		}
	}
	 handleSelectChange = (e, { value, name }) => this.setState({ [name]:value })
	handleChange=(event)=>{


		console.log('event.target.value >>>', event.target.value);
		console.log('event.target.name >>>', event.target.name);

		this.setState({
			[event.target.name]: event.target.value
		})
	}
	formValidation=()=>{
		if (this.state.action == 'register'){
			if(this.state.email==''|| !this.state.regexEmail.test(this.state.email)){

			}
		}
	}

	render(){
		console.log("this is state >>>>" , this.state);
			return(
			<div className='LoginRegisterForm'> 

				<div className='formDiv'>
				<Form onSubmit={this.formValidation}>
				{
					this.state.action ==='register'
					?
					<Form.Field className='input'>
						<label>Username</label>
						<input placeholder='User Name'
						name='username'
						value={this.state.username}
						onChange={this.handleChange}/>
					</Form.Field>
					:
					null
				}
					<Form.Field className='input'>
						<label>Email</label>
						<input placeholder='johndoe@gmail.com' type='email'
						name='email'
						value={this.state.email}
						onChange={this.handleChange} 
						/>
					</Form.Field>
					<Form.Field className='input'>
						<label>password</label>
						<input placeholder='Password' type='password'
						name='password'
						value={this.state.password}
						onChange={this.handleChange}/>
					</Form.Field>

				{
					this.state.action ==='register'
					?
					<Form.Field className='input'>
						<label>Age</label>
						<input placeholder='Enter Age' type='number'
						name='age'
						value={this.state.age}
						onChange={this.handleChange}/>

						<Form.Select  
            				fluid
            				label='School'
            				name='school'
            				options={schoolKey}
            				placeholder='School'
            				value={this.state.school}
							onChange={this.handleSelectChange}
          				/>
				
					</Form.Field>
					:
					null
				}
					
					<Button type='Submit'>
					{
						this.state.action==="register"? "Register":"Login"
					}
					</Button>
				</Form>
				{
					this.state.action ==='register'
					?
					<small> if you have an account Log in <span className="link" onClick={this.switchForm}>here</span>.</small>

					:
					<small> dont have an account Sign up <span className="link" onClick={this.switchForm}>here</span>!</small>
				}
				</div>
				
			</div>
			)
		}
}
export default LoginRegisterForm