import React,{Component} from 'react';
import { connect } from 'react-redux'
import {Tabs, Tab} from 'material-ui/Tabs';
import ReactDraftEditorContainer from '../components/ReactDraftEditorContainer'
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import Paper from 'material-ui/Paper';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import DynamicDraggableTreeContainer from  '../components/rcTree/DynamicDraggableTreeContainer'
import RaisedButton from 'material-ui/RaisedButton';
import EditorToolBarContainer from '../components/EditorToolBarContainer'
import IconButton from 'material-ui/IconButton';

// const divStyle={
//     width: "45%",
//     height: 200,
//     display: "inline-block"
// }
const leftStyle = {
    width: '20%',
    minHeight: 600,
    // textAlign: 'center',
    float: "left",
    marginLeft: '2%',
    marginRight:'2%',
};

const rightStyle = {
    width: '74%',
    // textAlign: 'center',
    float: "left",
};

const Editor = ReactDraftEditorContainer;


class ReactDraftEditorPage extends Component {
    // state = {
    //     editorState: EditorState.createEmpty(),
    // }



    render() {
        const { editorState, gitPush } = this.props;
        var html =draftToHtml(convertToRaw(editorState.getCurrentContent()));
        // console.log(html);
        var title= (
            <div>
                Documents
                <span style={{position: "absolute", right: 0, top: 0}}>
                    <IconButton iconClassName="fa fa-github" iconStyle={{color: 'white'}} onClick={gitPush}/>
                </span>
            </div>
        )
        return (
            <div style={{
                marginTop: "10px"
            }}>
                <Card style={leftStyle}>
                    <CardHeader style={{backgroundColor: 'rgb(0, 188, 212)'}}
                        title={title} titleStyle={{color: 'white'}}
                        // subtitle="Subtitle"
                    />
                    <CardText>
                        <DynamicDraggableTreeContainer showContent = {this.showContent}/>
                    </CardText>
                </Card>

                    <Paper  style={rightStyle} zDepth={1} children={
                        <Tabs>
                            <Tab label="Edit" >
                                <EditorToolBarContainer/>
                                <Editor/>
                            </Tab>
                            <Tab label="View Only">
                                <div style={{overflow: 'auto', height: 600}} id="htmlDisplay" dangerouslySetInnerHTML={{__html: html}}>
                                </div>
                            </Tab>
                        </Tabs>

                    } />

            </div>

        );
    }
}


export default ReactDraftEditorPage;
