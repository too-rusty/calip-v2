
import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'  
import Signup from './components/signup'
import Login from './components/login'
import Nav from './components/nav'
import Home from './components/home'
import Create from './components/create'
import Cchain from './components/cchain'
import Profile from './components/profile'
import CchainSearch from './components/cchainsearch'
import EditView from './components/editchain'

import axios from 'axios'
import './index.css'
import Cookies from 'universal-cookie';

// const App = () => (

//     <Router>
//       <div className="navbarContainer">
//       <NavLink to="/" exact activeStyle={{color:'green', borderBottom: 'solid 3px #fff'}}>Home </NavLink>
//       <NavLink to="/store" exact activeStyle={{color:'green', borderBottom: 'solid 3px #fff'}}> Store</NavLink>
//       <NavLink to="/signup" exact activeStyle={{color:'green', borderBottom: 'solid 3px #fff'}}> Signup</NavLink>
//       <div>
//         {false ? <NavLink to="/status" exact activeStyle={{color:'green', borderBottom: 'solid 3px #fff'}}> Status</NavLink>
//                 : <NavLink to="/status" exact activeStyle={{color:'green', borderBottom: 'solid 3px #fff'}}> Status2</NavLink> }
//       </div>

//       </div>
//       <Route path = "/" exact component = {Home} />
//       <Route path = "/store" exact component = {Home} />
//       <Route path = "/status" exact component = {Home} />
//       <Route path = "/signup" exact component = {Home} />
//     </Router>

//   // <div>
//   //   <div> YOYOYO </div>
//   //   <Form1 />
//   // </div>

// )



// I had to use credentials: 'include' on the client side and CORS_ALLOW_CREDENTIALS = True 
// in my django app. Also setting my cookie with 127.0.0.1 
// in localhost response.set_cookie('my_cookie', value=token, httponly=True, domain='127.0.0.1')



const cookies = new Cookies();

class App extends React.Component {
  constructor(props) {
    super(props)
    // if (cookies.get('calip_token') === "null") {
    //   cookies.set('calip_token', null, { path: '/' })
    // }
    
    // let loggedin = ls.get('token') === '' || ls.get('token') === undefined || ls.get('token') === null ? false : true;
    console.log('fetching in appp component')
    let tokk = cookies.get('calip_token')
    let uname = cookies.get('calip_uname')
    this.state = {
      // user : ls.get('token'),
      // loggedIn : loggedin,
      token : tokk,
      uname : uname
    }
    console.log("maine app state",this.state)
    // const cookies = new Cookies();
// cookies.set('myCato', 'Pacman2', { path: '/login' });
// console.log('COKKE',cookies.get('myCatok')); // Pacman

    
  }

  setToken(tok,una) {
    this.setState({...this.state,token:tok,uname:una})
    cookies.set('calip_token', tok, { path: '/' })
    cookies.set('calip_uname', una, { path: '/' })
  }

  setUser(username,loggedin) {
    console.log("CCC",username)
    // ls.set('token', null)
    this.setState({...this.state, user:username, loggedIn : loggedin})
    // set all at once not idividually
  }

  componentDidMount() {
    // NEED A CALL HERE TOO
    // because the page is refreshed and token is set , need to check if the
    // token is still valid or not
    // cool that i wrote it, eventually reached at it ... phew


    let tokk =  this.state.token
    console.log('otkk', tokk)
    const config = {
      headers : {
          "token" : tokk,
          // 'sameSite': 'None; Secure' // to try later
      }
    }
    console.log(config)
    // The second argument is the HEADER.... HELLLLL
    axios.get('http://localhost:8000/prof/test', config)
    .then(
        res => {
          console.log("res",res)

          //BUG -> when valid token sent , token not returned again
          // this expires the token since token is now undefined ( not returned )
          this.setToken(tokk, res.data.username)
          // now this is correct
        }
    ).catch(
      (err) => {
        if (err.response) {
          console.log("error in app js get req", err.response)
          this.setToken("null","nullUser")
          // since error , rest the state so that the navbar is showing correct info
          // ls.set('token','')
        } else {
          console.log('show error notification')
        }
      }
    )
  }

  render() {
    return (
    <BrowserRouter>
      <div className="App">
        <Nav setToken = { this.setToken.bind(this) } token = { this.state.token } uname = { this.state.uname } />

        <div className="auth-wrapper">
          <div className="auth-inner">
            <Switch>
              <Route exact path="/" component={() => <Home token = {this.state.token} />} />
              <Route exact path="/login" component={() => <Login setToken = {this.setToken.bind(this)} token = {this.state.token} username = {this.state.uname} />} />
              <Route exact path="/signup" component={() => <Signup token = {this.state.token} /> } />
              <Route exact path="/create" component={() => <Create token = {this.state.token} setToken = {this.setToken.bind(this)} />} />
              <Route exact path="/cc/:ccid/edit" component={EditView} />
              <Route exact path="/cc/:ccid" component={Cchain} />
              <Route exact path="/cc" component={CchainSearch} />
              <Redirect from="/reloadcc" to="/cc" />
              {/* <Route exact path="/profile" component={() => <Profile token = {this.state.token} />} /> */}
              <Route exact path="/profile/:uname" component={Profile} />
              <Redirect from="/profile/:uname/reload" to="/profile/:uname" />
            </Switch>
          </div>
        </div>
      </div>
        
    </BrowserRouter>
    )
  }

}

export default App;



/*
 * Since nothing is working
 * The best thing is to use the cookie
 * store it and use it
 * store it in the home page link and provide 2 functions to all the child components
 * the get function and the set function
 * only cookie and login info is needed for now so that many calls are not performed
 * not even login info is needed, we can just make a backend api to validate login
 * 
 * 
 * 
 * 
 * 
 * */