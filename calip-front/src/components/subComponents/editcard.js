import React from "react";
import ReactPlayer from 'react-player';



var inputStyle = {
width: "400px",
height: "50vh",
marginLeft: "auto",
marginRight: "auto",
padding: "10px",
};
var outputStyle = {
width: "400px",
height: "50vh",
backgroundColor: "#DCDCDC",
marginLeft: "auto",
marginRight: "auto",
padding: "10px",
};

let marked = require("marked");

class EditCard extends React.Component {
    constructor(props){
        super(props)
    }
    updateMarkdown(link,content) {
        // this.setState({ content });
        let isVidCard = this.props.card.link === undefined || this.props.link === "" ? false : true
        if (!isVidCard)this.props.editCard(content)
        else this.props.editVidCard(link,content)
    }

    componentWillMount(){
    }
    render(){
        // this.props.card is always non null
        let markdown = this.props.card.content
        let isVidCard = this.props.card.link===undefined || this.props.card.link===""? false : true
        let link = this.props.card.link
        return (
        <div>

            {isVidCard ? 
            <div>
            <textarea value={link} onChange={ (e)=>{this.updateMarkdown(e.target.value,"")} } />
            </div>
            :<div></div>
            }

            <div className="input" style={inputStyle}>
                <textarea
                className="input"
                style={inputStyle}
                value={markdown}
                onChange={(e) => {
                    this.updateMarkdown(null,e.target.value);
                }}
                >
                </textarea>
            </div>

                {/*OUTPUT PREVIEW*/}

            <div
            style={outputStyle}
            dangerouslySetInnerHTML={{
                __html: marked(markdown),
            }}
            ></div>
            {isVidCard?
            <div><ReactPlayer url={link} controls={true} /></div>
            :<div></div>}
        </div>
        )
    }
    // render() {
    //     return (<div>edit card here</div>)
    // }
}

export default EditCard