import React from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import {Link} from "react-router-dom";

// const queryString = require('query-string');

class CchainSearch extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props)
        this.state = {
            summary_default: [],
            summary : [], // this is the searched one
            total : 0,
            loggedin : false,
            search_str : null,
            // query_params : (this.props.location.search) TODO this later
        }
    }

    // type CcSummary struct {
    //     Ccid     uint     `json:"ccid"`
    //     Title    string   `json:"title"`
    //     About    string   `json:"about"`
    //     Tags     []string `json:"tags"`
    //     Username string   `json:"username"`
    // }

    componentDidMount() {
        this._isMounted = true;
        // const cookies = new Cookies();
        // let tokk = cookies.get('calip_token')
        const config = {
            headers : {
                'token' : this.props.token
            }
        }

        let url = 'http://localhost:8000/search'
        axios.get(url, config)
        .then(
            res => {
                if (this._isMounted) {
                res.data.summary_default = res.data.summary
                res.data.summary = []
                this.setState({...this.state, ...res.data})
                console.log("set home component state",this.state)
                }
            }
        ).catch(
            error => {
                console.log("error in cchainsearch ", error)
            }
        )
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    changeHandler(event) {
        let name = event.target.name
        let value = event.target.value
        this.setState({
            ...this.state,
            [name]: value
        });
    }
    search() {
        const config = {
            headers : {
                'token' : this.props.token
            }
        }

        let url = 'http://localhost:8000/search/tag/'+this.state.search_str
        console.log('URL', url)
        axios.get(url, config)
        .then(
            res => {
                // if (this._isMounted) {
                this.setState({...this.state, ...res.data})
                console.log("The SEARCHED DATA",res.data)
                // }
            }
        ).catch(
            error => {
                console.log("error in cchainsearch ", error)
            }
        )
    }
    
    render() {

        // if (this.props.user === undefined || this.props.user === '') {
        // let view1
        // if (this.props.token === "null") {
        //     view1 = (
        //         <div>Home, no one logged in</div>
        //     )
        // } else {
        //     view1 = (
        //         <div> hi someuser </div>
        //     )
        // }

        let allcards = this.state.summary_default.map((val, key)=> {
            return (<Card 
            key={key}
            ccid={val.ccid}
            title={val.title}
            about={val.about}
            tags={val.tags}
            username={val.username}
            />);
        }
        )

        let searchCards
        if(this.state.summary===null) {
        }
        else {
            searchCards = this.state.summary.map((val, key)=> {
            return (<Card 
            key={key}
            ccid={val.ccid}
            title={val.title}
            about={val.about}
            tags={val.tags}
            username={val.username}
            />);
            }
            ) 
        }

        return (
            <div>
            
            {/* <div>
            <textarea value= onChange={ (e)=>{this.updateMarkdown(e.target.value,"")} } />
            </div> */}

            <div>
                <label></label>
                <input name="search_str" type="text" placeholder="search by tag"
                onChange = { this.changeHandler.bind(this) } />
                <button onClick={this.search.bind(this)}>search</button>
            </div>

            
            
            <div>{allcards}</div>
            <div>SEARCHED CARDS shown below</div>
            <div>---------------------</div>
            <div>{searchCards}</div>

            </div>
        
        )

    }

}



 // type CcSummary struct {
//     Ccid     uint     `json:"ccid"`
//     Title    string   `json:"title"`
//     About    string   `json:"about"`
//     Tags     []string `json:"tags"`
//     Username string   `json:"username"`
// }

class Card extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        let ccid = this.props.ccid
        let title = this.props.title
        let about = this.props.about
        let tags = this.props.tags.join()
        let username = this.props.username

        let view = (
            <div>
            <div>ccid : {ccid}</div>
            <div><Link to={"/cc/"+ccid.toString()}>About</Link></div>
            <div>title : {title}</div>
            <div>about : {about}</div>
            <div>tags : {tags}</div>
            <div>by : {username}</div>
            <div>---------------------</div>
            </div>
        )

        return (
            <div>{view}</div>
        )

    }

}

export default CchainSearch