import React from "react";
import axios from "axios";
import loginimage from "../images/Login.svg";
import { Redirect } from "react-router";
import { Link } from "react-router-dom";

import "./login.css";
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      username: "",
      message: "",
    };
  }

  componentDidMount() {}

  changeHandler(event) {
    let name = event.target.name;
    let value = event.target.value;
    this.setState({
      ...this.state,
      [name]: value,
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let data = {
      username: this.state.username,
      password: this.state.password,
    };

    // const config = {
    //     headers : {
    //         "token" : this.props.token,
    //         'sameSite': 'None; Secure'
    //     }
    // }
    axios
      .post(`http://${process.env.REACT_APP_SERVER_URL}/login`, data)
      .then((res) => {
        console.log("USERNAMEEEE RETURNED", res.data); // only token is being returned
        if (res.data.token != undefined) {
          this.props.setToken(res.data.token, res.data.username);
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          this.setState({ message: error.response.data.error });
        } else {
          console.log("Show error notification!");
        }
      });
    console.log(this.state);
  }

  render() {
    console.log("tokkk in login render ", this.props.token);
    // if (this.props.loggedIn) {
    if (this.props.username !== "nullUser") {
      //should not do this but use some log in state
      console.log("OK NOT NULL", this.props.username);
      return <Redirect to={"/"} />;
    }
    return (
      <div>
        <div className="login">
          <div className="box-1">
            <img className="loginimage" src={loginimage} alt="login image" />
          </div>
          <div className="box-2">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <h3>Login</h3>

              <div className="form-group">
                <label>Username</label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  onChange={this.changeHandler.bind(this)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={this.changeHandler.bind(this)}
                />
              </div>
              <button className="login-button">Login</button>
            </form>
            {/* <div>Message from backend : {this.state.message} </div> */}
            <div className="switch">
              Dont have an account ?{" "}
              <Link className="switchtext" to={"../signup"}>
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
