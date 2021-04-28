import React from "react";
import axios from 'axios';
import { Redirect } from "react-router";


class Login extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            password:"",
            username:"",
            message : "",
        }
    }

    componentDidMount() {
    }
    

    changeHandler(event) {
        let name = event.target.name
        let value = event.target.value
        this.setState({
            ...this.state,
            [name]: value
        });
    }


    handleSubmit(e) {
        e.preventDefault()
        let data = {
            "username":this.state.username,
            "password":this.state.password,
        }

        // const config = {
        //     headers : {
        //         "token" : this.props.token,
        //         'sameSite': 'None; Secure'
        //     }
        // }
        axios.post('http://localhost:8000/login',data)
        .then(
            res => {
                console.log("USERNAMEEEE RETURNED",res.data) // only token is being returned
                if(res.data.token != undefined) {
                    this.props.setToken(res.data.token,res.data.username)
                }
                
            }
        ).catch(
            (error) => {
                if (error.response) {
                    console.log(error.response.data)
                    this.setState({message: error.response.data.error})
                } else {
                    console.log('Show error notification!')
                }
            }
        )
        console.log(this.state)
    }


    render() {
        console.log("tokkk in login render ",this.props.token)
        // if (this.props.loggedIn) {
        if (this.props.username !== "nullUser") { //should not do this but use some log in state
            console.log("OK NOT NULL", this.props.username)
            return <Redirect to={'/'} />
        }
        return (
            <div>
            <form onSubmit={ this.handleSubmit.bind(this) }>
                <h3>Login</h3>

                <div className="form-group">
                    <label>Username</label>
                    <input name="username" type="text" className="form-control" placeholder="Username"
                    onChange = { this.changeHandler.bind(this) } />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input name="password" type="password" className="form-control" placeholder="Password"
                    onChange = { this.changeHandler.bind(this) } />
                </div>
                <button className="btn btn-primary btn-block">Login</button>
            </form>
            <div>Message from backend : {this.state.message} </div>
            </div>
        )
    }
}

export default Login