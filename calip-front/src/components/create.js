import React from "react";
import { Redirect } from "react-router";
import axios from 'axios'
import EditCard from './subComponents/editcard';
import MyCard from './subComponents/mycard';

import './create.css'

let marked = require("marked");

class Create extends React.Component {
// save this template at regular intervals to save to db
// fetch the ccid when this happens for the first time

    constructor(props) {
        super(props)
        console.log()
        this.state = {
            ccid : null,
            title : null,
            about : null,
            username : null,
            draft : null,
            likes : 0,
            editable : null,
            loggedin : null,
            bookmarked : null,
            tag_str:null,


            tags : [],
            cards : [], // these are actually cards
            currentCardIdx : null,
            content : null // later remove this, only doing for now
        }
    }



    addCard(){
        let cards = this.state.cards
        cards.push( { content : '' } )
        let n = cards.length
        this.setState( { cards : cards , currentCardIdx : n-1 } )
    }
    
    addVidCard(){
        let cards = this.state.cards
        cards.push( { link : '' , content : '' } )
        let n = cards.length
        this.setState( { cards : cards , currentCardIdx : n-1 } )
    }

    deleteCard(index) {
        const cards = this.state.cards;
        const newCards = [
            ...cards.slice(0, index),
            ...cards.slice(index + 1)
        ];
        this.setState({
            cards: newCards,
            currentCardIdx : null
        });
    }

    stardEdit(key){
        // set the current card to edit
        this.setState({currentCardIdx:key})
    }

    editCard(content){
        // edit the current non video card, note we are editing the current card index
        let cidx = this.state.currentCardIdx
        let cards = this.state.cards
        cards[cidx].content= content
        this.setState( { cards : cards } )
    }

    editVidCard(link, content){
        // edit the video card, note that we are editing the current index
        let cidx = this.state.currentCardIdx
        let cards = this.state.cards
        if(link!==null)cards[cidx].link= link
        if(content!==null)cards[cidx].content= content
        this.setState( { cards : cards } )
    }

    formData(isDraft) {
        // draft is bool variable
        let tags
        if(this.state.tag_str===null) {
            tags = []
        } else {
            tags = this.state.tag_str.split(",",5).map(val=>val.trim()).filter(val=>val!=="") // derive from tag_str TODO
        }

        let title = this.state.title===null?"EMPTY TITLE":this.state.title.trim();
        let about = this.state.about===null?"EMPTY about":this.state.about.trim();
        const data = {
            ccid : this.state.ccid,
            title : title,
            about : about,
            username : this.state.username,
            draft : isDraft,
            likes : this.state.likes,
            editable : this.state.editable,
            loggedin : this.state.loggedin,
            bookmarked : this.state.bookmarked,
            tags : tags,
            content : this.state.cards
        }
        return data
    }

    saveChain() {
        //saves as draft

        let data = JSON.stringify(this.formData(true))
        let token = this.props.token
        console.log("data before sending",data)
        console.log("token before sending",token)
        const config = {
            headers : {
                "token" : token,
                // 'sameSite': 'None; Secure'
            }
        }
        // MAY RETURN INVALID TOKEN , so handle that too
        axios.post('http://localhost:8000/cc/create',data,config)
        .then(
            res => {
                console.log("called CREATE API", res.data)
                if(res.data.ccid != undefined) {
                    this.setState({ccid:res.data.ccid})
                }
            }
        ).catch(
            (error) => {
                if (error.response) {
                    console.log(error.response.data)
                } else {
                    console.log('Show error notification!')
                }
            }
        )

    }
    publishChain() {
        // e.preventDefault()
        //publishes the chain
        // after publishing redirect to the main page maybe

        let data = JSON.stringify(this.formData(false))
        let token = this.props.token
        console.log("data before sending",data)
        console.log("token before sending",token)
        const config = {
            headers : {
                "token" : token
                // 'sameSite': 'None; Secure'
            }
        }

        axios.post('http://localhost:8000/cc/create',data,config)
        .then(
            res => {
                console.log("called CREATE API", res.data)
                if(res.data.ccid != undefined) {
                    this.setState({ccid:res.data.ccid})
                }
            }
        ).catch(
            error => {
                if (error.response) {
                    // token is expired
                    this.props.setToken("null","nullUser")
                    console.log(error.response.data)
                } else {
                    console.log('Show error notification!')
                }
            }
        )
    }
    changeHandler(event) {
        let name = event.target.name
        let value = event.target.value
        this.setState({
            ...this.state,
            [name]: value
        });
    }

    render() {
        // if logout then redirect
        if (this.props.token === "null") {
            return <Redirect to={'/login'} />
        }

        let cards = this.state.cards.map((val,key)=> {
            return (<MyCard 
            key={key}
            idx={key}
            content={val.content} 
            link={val.link}
            stardEdit={this.stardEdit.bind(this)}
            deleteCard={ ()=>{
                //need to change this state too else render not called
                //since cons initialised once
                    this.deleteCard(key)
                }
            }
             />
            );
        });

        let cidx = this.state.currentCardIdx

        return (
        
            <div className="create-card" >
                <div className="buttons">
                <button onClick={this.addCard.bind(this)}>add card</button>
                <div><button onClick={this.addVidCard.bind(this)}>add vid card</button></div>
                <div><button onClick={this.saveChain.bind(this)}>save draft</button></div>
                <div><button onClick={this.publishChain.bind(this)}>publish</button></div>
                </div>
                
                <div className="information">
                <div>
                <label>Title</label>
                <input name="title" type="text" placeholder="Title"
                onChange = { this.changeHandler.bind(this) } />
            </div>
            <div>
                <label>About</label>
                <input name="about" type="text" placeholder="About"
                onChange = { this.changeHandler.bind(this) } />
            </div>
            <div>
                <label>Tags( enter comma separated values (atmost 5) ) </label>
                <input name="tag_str" type="text" placeholder="tags"
                onChange = { this.changeHandler.bind(this) } />
            </div>
            <div>The first card will be the about card</div>
            <div>All cards</div>
             <div> {cards} </div>
             {cidx !== null ?
                 <div>
                    {/* <div><PreviewCard card={this.state.cards[cidx]}/></div> */}
                    <div><EditCard card={this.state.cards[cidx]} 
                          editCard={this.editCard.bind(this)}
                          editVidCard={this.editVidCard.bind(this)}/>
                    </div>
                 </div>
                : <div> NO PREVIEW </div>
             }
            </div> </div>
        );
            }
        
}

export default Create
