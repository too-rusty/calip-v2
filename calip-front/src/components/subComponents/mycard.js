import React from "react";

let marked = require("marked");

class MyCard extends React.Component{
    //actually contain the buttons
    constructor(props){
      super(props)
    }
    render(){
        let content = this.props.content
        if(!content)content='EMPTY'
        let idx = this.props.idx
        return (
            <div>
                <div
                dangerouslySetInnerHTML={{
                    __html: marked(content.substr(0,5)+'...'),
                }}
                ></div>
                <div><button onClick={this.props.deleteCard}>delete</button></div>
                <div><button onClick={()=>this.props.stardEdit(idx)}>edit</button></div>
                {/* <div><button onClick={()=>this.props.save(idx)}>save</button></div> */}
            </div>
        )
    }
}

export default MyCard

