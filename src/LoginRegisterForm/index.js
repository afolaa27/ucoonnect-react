import React, {Component} from 'react'
import {Form, Button} from 'semantic-ui-react'
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
			regexEmail: new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'),
			regexPassword: new RegExp('(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]){8,}'),
			message : '',
			displayMessage: false
		}
	}

	switchForm = (action) => {
		this.setState({ action, displayMessage: false })
	}

	handleSelectChange = (e, { value, name }) => this.setState({ [name]: value })

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
			displayMessage: false
		})
	}

	formValidation = () => {
		if (this.state.action === 'register') {
			if (this.state.email === '' || !this.state.regexEmail.test(this.state.email)) {
				this.setState({ message: 'Please enter a valid email address.', displayMessage: true })
			} else if (this.state.password === '' || !this.state.regexPassword.test(this.state.password)) {
				this.setState({ message: 'Password must have at least one uppercase letter, one number, and one lowercase letter.', displayMessage: true })
			} else {
				this.props.register(this.state)
				if (this.props.userExists === 'yes') {
					this.setState({ message: 'An account with that username or email already exists.', displayMessage: true })
				} else {
					this.setState({ displayMessage: false })
				}
			}
		}
		if (this.state.action === 'login') {
			if (this.props.loggedIn === true) {
				this.setState({ message: 'Incorrect username or password.', displayMessage: true })
			} else {
				this.props.login(this.state)
			}
		}
	}

	render() {
		const { action, displayMessage, message } = this.state
		return (
			<div className='auth-page'>
				<div className='auth-hero'>
					<h1 className='auth-hero-title'>UConnect</h1>
					<p className='auth-hero-sub'>The textbook marketplace for college students</p>
				</div>

				<div className='auth-card'>
					<div className='auth-tab-row'>
						<button
							className={`auth-tab ${action === 'login' ? 'active' : ''}`}
							onClick={() => this.switchForm('login')}
							type='button'
						>
							Log In
						</button>
						<button
							className={`auth-tab ${action === 'register' ? 'active' : ''}`}
							onClick={() => this.switchForm('register')}
							type='button'
						>
							Sign Up
						</button>
					</div>

					<Form onSubmit={this.formValidation}>
						{action === 'register' && (
							<Form.Field>
								<label>Email</label>
								<input
									placeholder='you@university.edu'
									type='text'
									required
									name='email'
									value={this.state.email}
									onChange={this.handleChange}
								/>
							</Form.Field>
						)}

						<Form.Field>
							<label>Username</label>
							<input
								placeholder='Username'
								name='username'
								value={this.state.username}
								onChange={this.handleChange}
							/>
						</Form.Field>

						<Form.Field>
							<label>Password</label>
							<input
								placeholder='Password'
								type='password'
								required
								name='password'
								value={this.state.password}
								onChange={this.handleChange}
							/>
						</Form.Field>

						{action === 'register' && (
							<>
								<Form.Field>
									<label>Age</label>
									<input
										placeholder='Age'
										type='number'
										required
										name='age'
										value={this.state.age}
										onChange={this.handleChange}
									/>
								</Form.Field>
								<Form.Select
									search
									label='School'
									name='school'
									options={schoolKey}
									required
									placeholder='Select your school'
									value={this.state.school}
									onChange={this.handleSelectChange}
								/>
							</>
						)}

						<Button className='auth-submit-btn' type='submit'>
							{action === 'register' ? 'Create Account' : 'Log In'}
						</Button>
					</Form>

					{displayMessage && (
						<div className='auth-error'>{message}</div>
					)}
				</div>
			</div>
		)
	}
}

export default LoginRegisterForm
