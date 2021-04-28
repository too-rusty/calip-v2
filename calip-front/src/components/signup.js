import React from "react";
import axios from 'axios';
import { Redirect } from "react-router";

class Signup extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            name:"",
            email:"",
            password:"",
            confirmPassword:"",
            username:"",
            message:""
        }
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
            "email":this.state.email,
            "name":this.state.name,
        }
        let config = {
            validateStatus : function(status) {
                return status >= 200 && status < 500;
            }
        }
        axios.post('http://localhost:8000/signup',data)
        .then(
            res => {
                console.log(res, "ok", res.status)
            }
        ).catch(
            (error) => {
                if (error.response) {
                    console.log(error.response.data)
                    this.setState({message:error.response.data.error})
                } else {
                    console.log('Show error notification!')
                }
            }
        )

        console.log(this.state)
    }

    render() {
        // if logged in then link to the home page
        if (this.props.token !== "null") {
            return <Redirect to={'/'} />
        }
        return (
            <div>
            <form onSubmit={ this.handleSubmit.bind(this) }>
                <h3>Sign up</h3>

                <div className="form-group">
                    <label>Name</label>
                    <input name="name" type="text" className="form-control" placeholder="Name"
                    onChange = { this.changeHandler.bind(this) } />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input name="email" type="email" className="form-control" placeholder="Email"
                    onChange = { this.changeHandler.bind(this) } />
                </div>

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

                {/* <div className="form-group">
                    <label>Confirm Password</label>
                    <input name="confirmPassword "type="password" className="form-control" placeholder="Confirm Password"
                    onChange = { this.changeHandler.bind(this) } />
                </div> */}

                <button className="btn btn-primary btn-block">Sign up</button>

            </form>
            <div>Message from backend : {this.state.message}</div>
            </div>
        )
    }
}

export default Signup