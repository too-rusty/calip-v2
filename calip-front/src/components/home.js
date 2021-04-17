import React from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";

class Home extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        // if (this.props.user === undefined || this.props.user === '') {
        let view1
        if (this.props.token === "null") {
            view1 = (
                <div>Home, no one logged in</div>
            )
        } else {
            view1 = (
                <div> hi someuser </div>
            )
        }


        return (
            <div>
            
            <div>{view1}</div>
            <div><Link to="/cc">Explore</Link></div>

            </div>
        
        )

    }

}



export default Home