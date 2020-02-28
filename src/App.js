import React, {Component} from 'react';
import LoginRegisterForm from './LoginRegisterForm'
import './App.css'

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      loggedIn : false,
      loggedInUserEmail : null,
      userExists: true
    }
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
          userExists: false
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
        if(loginResponse.status ===200){
          this.setState({
            loggedIn:true,
            loggedInUserEmail: loginJson.data.email,
            userExists: false
          })
        }
      }
      catch(err){
        console.error(err)
      }

    }
  render(){
    console.log(process.env)
      return(
      <div className="App"> 
       
          <div>
          <LoginRegisterForm register={this.register} userExists={this.state.userExists} login={this.login}/>

          </div>
        
      </div>
      )
    }
 
}

export default App;
