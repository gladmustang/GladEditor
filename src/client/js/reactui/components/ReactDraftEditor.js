import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import {tip} from "./Alert"

var editorStyle={
    height: 550,
    overflow: "auto"
}

function uploadImageCallBack(file) {
    return new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', './multipart/imgUpload');
            // xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
            const data = new FormData();
            data.append('image', file);
            xhr.send(data);
            xhr.addEventListener('load', () => {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
            });
            xhr.addEventListener('error', () => {
                const error = JSON.parse(xhr.responseText);
                reject(error);
            });
        }
    );
}

class ReactDraftEditor extends Component {
    constructor(props){
        super(props);
    }

    render() {
        const {editorState, onEditorStateChange} = this.props;
        return (
            <div onPaste={(e)=>{this.props.pasteImage(e)}}
                 onSelect = {(e)=> {
                     var sel =  window.getSelection().toString();
                     if(sel) {
                         var timer = setTimeout(function () {
                             if(window.getSelection().toString()==sel)
                             tip(window.getSelection().toString())
                             clearTimeout(timer);
                         }, 1000)

                     }

                 }}>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={(newEditorState)=>{onEditorStateChange(newEditorState, editorState, this.props.currentDocKey, this.props.treeData)}}
                    toolbar={{
                        image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: false } }
                    }}
                    editorStyle = {editorStyle}
                />

            </div>
        );
    }
}

export default ReactDraftEditor;