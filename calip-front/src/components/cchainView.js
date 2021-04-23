import React from "react";
import ReactPlayer from 'react-player';
import './cchainView.css'
import {Scrollbars} from 'react-custom-scrollbars'



let marked = require("marked");

var outputStyle = {
width: "400px",
height: "50vh",
backgroundColor: "#DCDCDC",
marginLeft: "auto",
marginRight: "auto",
padding: "10px",
};

class CChainView extends React.Component {
    constructor(props) {
        super(props)
        this.state={
        cc : this.props.chain.content, // the actual card chain content
        cidx : null
        }
        console.log("cchainview content", this.cc)
    }
    setCard(idx){
        this.setState({cidx:idx})
    }
    renderView({  }) {
       
        
        const customStyle = {
            backgroundColor: `#893168`
        };
        return customStyle;
    }
    render () {
        if(this.state.cc === null || this.state.cc === undefined) {
            return (
                <div>No cards to view, thats why users should use atleast one card</div>
            )
        }
        // console.log("finallu",this.state)

        let cards = this.state.cc.map((val,key)=> {
        return (<ShortViewCard 
        key={key}
        idx={key}
        content={val.content} 
        link={val.link}
        setCard={this.setCard.bind(this)} />)
        });
        // ok so the above is the short version of all the cards
        let cidx = this.state.cidx
        return (
            <div class="view-section">
            
            <div className="full-view">
            {cidx !== null ?
                <div>
                {/* <div><PreviewCard card={this.state.cards[cidx]}/></div> */}
                <div>
                <DetailViewCard card={this.state.cc[cidx]}/>
                </div>
                </div>
            : <div> NO PREVIEW, click a card to view </div>
            }
            <div>{cards.length===0?"WOOPS! no card":""}</div>
            </div>
            <div className="chain-view">
                <Scrollbars style={{width:300,height:600,color:"yellow !important" }}
                 >
                    
            <div>{cards}</div>
            </Scrollbars>
            </div>
           
            
            </div>
        )
    }

}

class DetailViewCard extends React.Component {
    constructor(props){
        super(props)
        console.log("logging card",this.props)
    }
    render() {
        let markdown = this.props.card.content
        
        let isVidCard = this.props.card.link==='' ? false : true
        let link = this.props.card.link
        return (
            <div className="card-details">
            {isVidCard?
            <div className="vdo-card"><ReactPlayer url={link} controls={true} /></div>
            :<div></div>}
            <div className="text-card" style={{padding: 20}}>
            {/* fbf5f3  */}
            <Scrollbars style={{width:640,height:540,backgroundColor:"#e8e6a3"}}>
            <div 
            style={{padding: 20}}
            dangerouslySetInnerHTML={{
                __html: marked(markdown),
            }}
            >
               
            </div>
            </Scrollbars>
           
            </div>
            
            
            </div>
        )
    }
}


class ShortViewCard extends React.Component{
    //actually contain the buttons
    constructor(props){
      super(props)
    }

    render(){
        let content = this.props.content
        if(!content)content='EMPTY'
        let idx = this.props.idx
        let isVidCard=this.props.link===undefined?false:true
        return (
            
            <div className="cardcolumn">
             
                <div className="short-card" onClick = {()=> this.props.setCard(idx)}>
                #{idx+1}
              
            </div>
            
           
            

            </div>
            
            
        )
    }
}

/*

  <div
                dangerouslySetInnerHTML={{
                    __html: marked(content.substr(0,5)+'...'),
                }}
                ></div>
                <div>{isVidCard?<div>YES</div>:<div>NO</div>}</div>
                <div><button onClick = {()=> this.props.setCard(idx)} > Card {idx+1} </button></div>
                {/* <div><button onClick={()=>this.props.save(idx)}>save</button></div> }
the overview is this

there is a main component which contains all the cards in a short view

then there is a single card called the long view

now the component passes the function 




*/


export default CChainView