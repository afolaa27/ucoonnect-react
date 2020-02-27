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
			action:'login'


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
	handleChange=(event)=>{
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	render(){
			return(
			<div className='LoginRegisterForm'> 
				<div className='formDiv'>
				<Form >
				{
					this.state.action ==='register'
					?
					<Form.Field className='input'>
						<label>Username</label>
						<input placeholder='User Name'/>
					</Form.Field>
					:
					null
				}
					<Form.Field className='input'>
						<label>Email</label>
						<input placeholder='johndoe@gmail.com' type='email'/>
					</Form.Field>
					<Form.Field className='input'>
						<label>password</label>
						<input placeholder='Password' type='password'/>
					</Form.Field>

				{
					this.state.action ==='register'
					?
					<Form.Field className='input'>
						<label>Age</label>
						<input placeholder='Enter Age' type='number'/>

						<Form.Select  
            				fluid
            				label='School'
            				options={schoolKey}
            				placeholder='School'
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