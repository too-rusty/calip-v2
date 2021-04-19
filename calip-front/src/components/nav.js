import React from "react";
import {Link} from "react-router-dom";
import Cookies from 'universal-cookie';
import * as ReactBootstrap from 'react-bootstrap';
import logo from '../images/logo.png'

import './nav.css'
const cookies = new Cookies();


class Nav extends React.Component {
    constructor(props) {
        super(props)
    }

    handleLogout() {
        // localStorage.removeItem("token")
        // e.preventDefault()
        this.props.setToken("null","nullUser")
        // this.props.setUser('',false)
        // ls.set('token', '')
    }
    doNothing(){
    }
    // maybe some state if logged in then no login and signup but profile link
    render() {
        let buttons
        // let tokk = ls.get('token')
        let tokk = this.props.token
        //this.props.user === null

        //TODO CORRECT THIS ????????????????????
        // if (tokk === '' || tokk === undefined) {
        if (this.props.token === "null") {
            buttons = (
                <div className="collapse navbar-collapse">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                    <Link className="nav-link" to={'/login'}>Login</Link>
                    </li>
                    <li className="nav-item">
                    <Link className="nav-link" to={'/signup'}>Sign up</Link>
                    </li>
                </ul>
                </div>
            )
        } else {
            // let uname = this.props.uname // maybe async shit , use cookies directly
            let uname = this.props.uname
            let token = this.props.token
            console.log("UNAME IN NAVBAR", uname)
            console.log("token IN NAVBAR", token)
            buttons = (
                <div className="collapse navbar-collapse">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                    <Link className="nav-link" to={'/'} onClick={ this.handleLogout.bind(this) }>Logout</Link>
                    </li>
                    <li className="nav-item">
                    {/* onClick={ this.doNothing.bind(this) } */}
                    <Link className="nav-link" to={'/profile/'+uname+'/reload'}>MyProfile</Link>
                    {/* a very good method to redirect */}
                    </li>
                </ul>
                </div>
            )
        }

        return (
            /*<div className = "App">
                <nav className="navbar navbar-expand navbar-light fixed-top">
                <div className="container">
                    <Link className="navbar-brand" to={'/'}>Home</Link>
                    <Link className="navbar-brand" to={'/create'}>Create</Link>
                    {buttons}
                </div>
                </nav>
            </div>*/
            <ReactBootstrap.Navbar className="navbar" bg="dark" expand="lg">
            <ReactBootstrap.Navbar.Brand href="#home"><img className="logo" src={logo} alt="calip"/></ReactBootstrap.Navbar.Brand>
            <ReactBootstrap.Navbar.Toggle aria-controls="basic-navbar-nav" />
            <ReactBootstrap.Navbar.Collapse id="basic-navbar-nav">
              <ReactBootstrap.Nav className="mr-auto">
                
                <Link className="navbar-brand" to={'/'}>Home</Link>
                <Link className="navbar-brand" to={'/create'}>Create</Link>
                <Link className="navbar-brand" to={'/categories'}>Categories</Link>
              </ReactBootstrap.Nav>
              <ReactBootstrap.Form inline>
                {buttons}
              </ReactBootstrap.Form>
            </ReactBootstrap.Navbar.Collapse>
          </ReactBootstrap.Navbar>
        )
    }
  }

  export default Nav