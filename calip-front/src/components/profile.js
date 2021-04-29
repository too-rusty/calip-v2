import React from "react";
import axios from 'axios';
import Cookies from 'universal-cookie';
import {Link} from "react-router-dom";


class Profile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            // token : this.props.match.params.token,
            uname : this.props.match.params.uname,
            name : null,
            username: null,
            email : null,
            about : null,
            drafts : [],
            cards : [],
            bookmarks : [],
            editable : false,
            loggedin : false
        }
    }
    componentDidMount(){
        // dont know hot to pass it so using cookie for now
        console.log("component mount with this.state.uname", this.state.uname)
        const cookies = new Cookies();
        let tokk = cookies.get('calip_token')
        const config = {
            headers : {
                'token' : tokk
            }
        }
        console.log("config",config)
        let url = 'http://localhost:8000/profile/' + this.state.uname
        axios.get(url, config)
        .then(
            res => {
                console.log("called fetch API and got DATA -> ", res.data)
                if(res.data.username != undefined) {
                    this.setState({...res.data})
                    // console.log(this.state)
                }   
            }
        ).catch(
            error => {
                if (error.response) {
                    if(error.response.data.error === "record not found") {
                        console.log("no record found")
                        this.setState({username : "NOTFOUND"})
                    }
                } else {
                    console.log('Show error notification!')
                }
            }
        )
    }


    render () {

        let view
        if (this.state.username === null) {
            view = <div>Loading ...</div>
            return view
        } else if (this.state.username === "NOTFOUND") {
            view = <div>No such user</div>
            return view
        }


        

        let allcards = this.state.cards === null ? [] : this.state.cards.map((val, key)=> {
            return (<Card 
            key={key}
            ccid={val.ccid}
            title={val.title}
            />);
        }
        )

        let alldrafts = []

        if(this.state.editable === true) {
            alldrafts = this.state.drafts === null ? [] : this.state.drafts.map((val, key)=> {
                return (<Card 
                key={key}
                ccid={val.ccid}
                title={val.title}
                isDraft={true}
                />);
            }
            )
        }

        let bookmarks = []
        if(this.state.loggedin === true) {
            bookmarks = this.state.bookmarks === null ? [] : this.state.bookmarks.map((val, key) => {
                return (<Card
                    key={key}
                    ccid={val.ccid}
                    title={val.title}
                />);
            }
            )
        }

        view = (
        <div>
            <div>hi</div>
            <div>-----Cards-----</div>
            <div>{allcards}</div>
            <div>-----Drafts-----</div>
            <div>{alldrafts}</div>
            <div>-----Bookmarks-----</div>
            <div>{bookmarks}</div>
        </div>
        )

        return(
            <div>{view}</div>
        )
    }
}


class Card extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        let ccid = this.props.ccid
        let title = this.props.title
        let isDraft = this.props.isDraft === true
        let link = "/cc/"+ccid.toString()
        if(isDraft) link += ("/edit")
        let view = (
            <div>
            <div>ccid : {ccid}</div>
            <div><Link to={link}>About</Link></div>
            <div>title : {title}</div>
            <div>---------------------</div>
            </div>
        )

        return (
            <div>{view}</div>
        )

    }

}


export default Profile