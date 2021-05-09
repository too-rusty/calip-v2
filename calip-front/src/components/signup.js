import React from "react";
import axios from "axios";
import { Redirect } from "react-router";
import Signupimg from "../images/Signup.svg";
import { Link } from "react-router-dom";
import "./signup.css";
import { withRouter } from "react-router-dom";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
      message: "",
    };
  }

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
      email: this.state.email,
      name: this.state.name,
    };
    let config = {
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      },
    };

    axios
      .post(`http://${process.env.REACT_APP_SERVER_URL}/signup`, data)
      .then((res) => {
        this.setState({message : "OKDONE"})
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
          this.setState({ message: error.response.data.error });
          alert(this.state.message + ". Please Try Again");
        } else {
          console.log("Show error notification!");
        }
      });
    // THIS should not be here, un comment and recheck what is happening
    // better to simply show a non alert message based on message param
    // better still remove this completely, because user is automatically redirected to home page
    // infact alert before redirecting

    // console.log(this.state);
    // alert(
    //   "Thank You for Signing Up " +
    //     this.state.username +
    //     ". Please login to continue"
    // );
    // this.props.history.push("/home");
  }

  render() {
    // if logged in then link to the home page
    if (this.props.token !== "null") {
      return <Redirect to={"/"} />;
    }
    if (this.state.message === "OKDONE") {
      alert(
        "Thank You for Signing Up " +
          this.state.username +
          ". Please login to continue"
      );
      this.props.history.push("/login") // ? not sure what is this , remove if not correct
      return <Redirect to={"/login"} />
    }
    return (
      <div>
        <div className="login">
          <div className="box-1">
            <img className="loginimage" src={Signupimg} alt="login image" />
          </div>
          <div className="box-2">
            <form onSubmit={this.handleSubmit.bind(this)}>
              <h3>Sign up</h3>

              <div className="form-group">
                <label>Name</label>
                <input
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  onChange={this.changeHandler.bind(this)}
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  onChange={this.changeHandler.bind(this)}
                />
              </div>

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
              {/* <Link className="switchtext" to={"../login"}> */}
              <button className="login-button">Sign Up</button>
              {/* </Link> */}
            </form>
            <div className="switch">
              Already have an account?{" "}
              <Link className="switchtext" to={"../login"}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Signup);
