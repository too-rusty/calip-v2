import React from "react";

import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";
import './home.css'
import * as ReactBootstrap from 'react-bootstrap'
import HomeImg from '../images/image1.jpg'
import HomeImg1 from '../images/svg1.svg'
import HomeImg2 from '../images/svg2.svg'
import HomeImg3  from '../images/svg3.svg'
class Home extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        // if (this.props.user === undefined || this.props.user === '') {
        let view1
        if (this.props.token === "null") {
            view1 = (
                <div className="intro-heading">Welcome to Calip!</div>
            )
        } else {
            view1 = (
                <div className="intro-heading"> hi User, Welcome to Calip! </div>
            )
        }


        return (
            <div className="home">
                <div className="hero1">
                <ReactBootstrap.Container className="container"> 
                <ReactBootstrap.Row>
                    <ReactBootstrap.Col><div className="section text">
                    <div>{view1}</div>
                    It is a long established fact that a reader will be distracted by the 
                    readable content of a page when looking at its layout.
                    <br></br>
                      <Link to="/cc">  <div className="btn">Explore</div></Link>
                    </div></ReactBootstrap.Col>
                    <ReactBootstrap.Col><div className="section image">
                    <img className="homeImg" src={HomeImg} alt="dummy image"/>
                    </div>
                    </ReactBootstrap.Col>
                </ReactBootstrap.Row>
  
                </ReactBootstrap.Container>
                    
                    

                </div>
                <div className="about">
                    <h3 className="title">Whats New?</h3>
                    <div className="boxes">
                    <div className="box">
                    <img className="box-images" src={HomeImg1} alt="dummy image"/>
                        <div className="box-text">
                            random text , will be replaced with proper text later.
                            random text , will be replaced with proper text later
                        </div>
                    </div>
                    <div className="box">
                    <img className="box-images" src={HomeImg2} alt="dummy image"/>
                        <div className="box-text">
                            random text , will be replaced with proper text later.
                            random text , will be replaced with proper text later
                        </div>
                    </div>
                    <div className="box">
                    <img className="box-images" src={HomeImg3} alt="dummy image"/>
                        <div className="box-text">
                            random text , will be replaced with proper text later.
                            random text , will be replaced with proper text later
                        </div>
                    </div>
                    </div>
                    

                </div>
                <div className="cards">
                <h3 className="title">Whats Popular?</h3>
                    <div className="boxes">
                    <div className="box">
                <div className="card">
                <div className="card-text">
                        <div className="heading">Head 1</div>
                        <div className="author">Author 1</div>
                        <div className="description">random texts describing the card</div>

                        </div>
                    
                        <button>Read More</button>
                    </div>
                    </div>
                    <div className="box">
                    <div className="card">
                    <div className="card-text">
                        <div className="heading">Head 2</div>
                        <div className="author">Author 2</div>
                        <div className="description">random texts describing the card</div>

                        </div>
                    
                        <button>Read More</button>
                    </div>
                    </div>
                    <div className="box">
                    <div className="card">
                        <div className="card-text">
                        <div className="heading">Head 3</div>
                        <div className="author">Author 3</div>
                        <div className="description">random texts describing the card</div>

                        </div>
                    
                        <button className="card-button">Read More</button>
                    </div>
                    </div>
                    </div>
                

                   
                    
                   
                </div>
            
          
           

            </div>
        
        )

    }

}



export default Home