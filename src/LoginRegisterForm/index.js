import React, {Component} from 'react'
import {Form,Button, Message, Icon,} from 'semantic-ui-react'
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
			regexEmail: new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$'),
			regexPassword: new RegExp('(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]){8,}'),
			message : '',
			displayMessage: false
		}
	}
	switchForm =()=>{
		if(this.state.action ==='login'){
			this.setState({
				action:'register',
				displayMessage: false
			})
		}
		else{
			this.setState({
				action:'login',
				displayMessage: false
			})
		}
	}
	handleSelectChange = (e, { value, name }) => this.setState({ [name]:value })

	handleChange=(event)=>{

		this.setState({
			[event.target.name]: event.target.value,	
			displayMessage:false
		})
	}
	formValidation=()=>{
		
		if (this.state.action === 'register'){

			if(this.state.email==='' || !this.state.regexEmail.test(this.state.email)){
				
				this.setState({
					message:"Enter valid Email",
					displayMessage : true
				})
			
			}else if(this.state.password===''|| !this.state.regexPassword.test(this.state.password)){
				
				this.setState({
					message:"Password should contain at least one digit,one lower case, one upper case",
					displayMessage : true
				})
			}else{
				
				this.props.register(this.state)
				if(this.props.userExists === 'yes'){
					this.setState({
						message:"User with that username or Email exists",
						displayMessage: true
					})
				}else{
					this.setState({
						displayMessage:false
					})
				}
			}
		}
		if(this.state.action === 'login'){
			this.props.login(this.state)
			
		}


	}

	render(){
		
			return(
			<div>
				
			<div className='LoginRegisterForm'> 

				<div className='formDiv'>
				<Form onSubmit={this.formValidation}>
				{
					this.state.action ==='register'
					?

					<Form.Field className='input'>
						<label>Email</label>
						<input placeholder='johndoe@gmail.com' type='text'
						required={true}
						name='email'
						value={this.state.email}
						onChange={this.handleChange} 
						/>
					</Form.Field>
					:
					null
				}
					<Form.Field className='input'>
						<label>Username</label>
						<input placeholder='User Name'
						name='username'
						value={this.state.username}
						onChange={this.handleChange}/>
					</Form.Field>
					<Form.Field className='input'>
						<label>password</label>
						<input placeholder='Password' type='password'
						required={true}
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
						required={true}
						name='age'
						value={this.state.age}
						onChange={this.handleChange}/>

						<Form.Select  
            				search
            				label='School'
            				name='school'
            				options={schoolKey}
            				required={true}
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
					<small> if you have an account log in <Icon link name="sign-in" onClick={this.switchForm}/></small>

					:
					<small> dont have an account sign up <Icon link name="signup" onClick={this.switchForm}></Icon></small>
				}
				</div>
				
			</div>
			<div className='message' >
				{
					this.state.displayMessage
					?
					<Message color='black' size='mini'
	    				header='Notice !'
	   					 content={this.state.message}
	  					/>
	  				:
	  				null
				}
				</div>	
			</div>
			)
		}
}
export default LoginRegisterForm