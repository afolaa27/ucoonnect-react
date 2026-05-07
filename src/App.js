import React, {Component} from 'react';
import LoginRegisterForm from './LoginRegisterForm'
import BookContainer from './BookContainer'
import './App.css'

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      loggedIn : false,
      loggedInUserEmail : null,
      userAddress : '',
      invalid: false,
      isNewUser: false,
      justLoggedIn: false,
    }
  }

  componentDidMount() {
    this.checkSession()
  }

  checkSession = async () => {
    try {
      const res = await fetch(process.env.REACT_APP_API_URL + '/api/v1/users/loggedin', { credentials: 'include' })
      const json = await res.json()
      if (json.data && json.data.id) {
        this.setState({
          loggedIn: true,
          loggedInUserEmail: json.data.email,
          userAddress: json.data.address || json.data.school || '',
          isNewUser: json.data.is_new || false,
          justLoggedIn: json.data.just_logged_in || false,
        })
      }
    } catch (e) {}
  }

  register = async(registerInfo)=>{
    const url = process.env.REACT_APP_API_URL + '/api/v1/users/register'
    
    try{
      const registerResponse = await fetch(url,{
        credentials:'include',
        method:'POST',
        body: JSON.stringify(registerInfo),
        headers:{
          'Content-Type':'application/json'
        }
      })
      const registerJson = await registerResponse.json()
      if(registerResponse.status===201){
        this.setState({
          loggedIn:true,
          loggedInUserEmail:registerJson.data.email,
          userAddress : registerJson.data.address || registerJson.data.school || '',
          userExist: 'no'
        })
      } if(registerResponse.status===401){
          this.setState({
            userExist:'yes'
          })
        }
      
    }
    catch(err){
      if(err){
        console.error(err)
      }
    }
  }
  login = async(loginInfo)=>{
      const url = process.env.REACT_APP_API_URL + '/api/v1/users/login'
      try{
        const loginResponse = await fetch(url,{
          credentials: 'include',
          method:'POST',
          body: JSON.stringify(loginInfo),
          headers:{
            'Content-Type' : 'application/json'
          }
        })
        const loginJson = await loginResponse.json()
        if(loginResponse.status===200){
          this.setState({
            loggedIn:true,
            loggedInUserEmail: loginJson.data.email,
            userAddress : loginJson.data.address || loginJson.data.school || '',
            justLoggedIn: true,
          })
        }
        return loginResponse.status
      }
      catch(err){
        console.error(err)
        return null
      }
    }
   logout = async ()=>{
    
    const url = process.env.REACT_APP_API_URL+'/api/v1/users/logout'
    try{
      const logoutResponse = await fetch(url,{
          credentials : 'include'
        })
        if(logoutResponse.status === 200){
          this.setState({
            loggedIn : false,
            loggedInUserEmail: null,
          })
        }
      }
        catch(err){
          console.error(err)
      }
   }
  render(){
    
      return(
      <div className="App"> 
       {
        this.state.loggedIn
        ?
        <div>
          <BookContainer logout={this.logout} userAddress={this.state.userAddress} isNewUser={this.state.isNewUser} justLoggedIn={this.state.justLoggedIn} onAddressUpdated={(addr) => this.setState({ userAddress: addr })} />
        </div>
        :
          <LoginRegisterForm login={this.login} />
       }
        
      </div>
      )
    }
 
}

export default App;
