import React, {Component} from 'react'
import {Form, Button} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './index.css'

class LoginRegisterForm extends Component{
	constructor(props){
		super(props)
		this.state={
			username:'',
			password:'',
			action:'login',
			message : '',
			displayMessage: false,
			loading: false,
		}
	}

	switchForm = (action) => {
		this.setState({ action, displayMessage: false, message: '' })
	}

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value, displayMessage: false })
	}

	handleLogin = async () => {
		const { username, password } = this.state
		if (!username.trim() || !password.trim()) {
			this.setState({ message: 'Please enter your username and password.', displayMessage: true })
			return
		}
		this.setState({ loading: true, displayMessage: false })
		const status = await this.props.login({ username, password })
		this.setState({ loading: false })
		if (status !== 200) {
			this.setState({ message: 'Incorrect username or password.', displayMessage: true })
		}
	}

	handleGoogleSignIn = () => {
		window.location.href = `${process.env.REACT_APP_API_URL}/api/v1/auth/google`
	}

	render() {
		const { action, displayMessage, message, loading } = this.state

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

					{action === 'login' ? (
						<>
							<button className='google-btn' onClick={this.handleGoogleSignIn} type='button'>
								<svg width='18' height='18' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'>
									<path d='M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z' fill='#4285F4'/>
									<path d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z' fill='#34A853'/>
									<path d='M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z' fill='#FBBC05'/>
									<path d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z' fill='#EA4335'/>
								</svg>
								Continue with Google
							</button>

							<div className='auth-divider'>
								<span>or sign in with username</span>
							</div>

							<Form onSubmit={this.handleLogin}>
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
										name='password'
										value={this.state.password}
										onChange={this.handleChange}
									/>
								</Form.Field>
								<Button className='auth-submit-btn' type='submit' loading={loading} disabled={loading}>
									Log In
								</Button>
							</Form>
						</>
					) : (
						<div className='register-sso'>
							<p className='register-sso-label'>Create your UConnect account</p>
							<button className='google-btn google-btn-lg' onClick={this.handleGoogleSignIn} type='button'>
								<svg width='20' height='20' viewBox='0 0 18 18' xmlns='http://www.w3.org/2000/svg'>
									<path d='M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z' fill='#4285F4'/>
									<path d='M9 18c2.43 0 4.467-.806 5.956-2.18l-2.909-2.259c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z' fill='#34A853'/>
									<path d='M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z' fill='#FBBC05'/>
									<path d='M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z' fill='#EA4335'/>
								</svg>
								Sign up with Google
							</button>
							<p className='register-sso-note'>
								Your Google account is all you need — no new password to create.
							</p>
						</div>
					)}

					{displayMessage && (
						<div className='auth-error'>{message}</div>
					)}
				</div>
			</div>
		)
	}
}

export default LoginRegisterForm
