import React, {Component} from 'react';
import LoginRegisterForm from './LoginRegisterForm'
import './App.css'

class App extends Component {
  constructor(props){
    super(props)
    this.state={
      loggedIn : false,
      loggedInUserEmail : null,

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
        })
      }
    }
    catch(err){
      if(err){
        console.error(err)
      }
    }
  }
  render(){
      return(
      <div className="App"> 
       
          <div>
          <LoginRegisterForm/>

          </div>
        
      </div>
      )
    }
 
}

export default App;
