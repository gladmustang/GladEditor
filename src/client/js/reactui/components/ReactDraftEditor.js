import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

var editorStyle={
    height: 550,
    overflow: "auto"
}

function uploadImageCallBack(file) {
    return new Promise(
        (resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.imgur.com/3/image');
            xhr.setRequestHeader('Authorization', 'Client-ID XXXXX');
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
        const {editorState, onEditorStateChange, onContentStateChange} = this.props;
        return (
            <div style={editorStyle}>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={onEditorStateChange}
                    onChange={(contentState)=>{onContentStateChange(editorState, this.props.currentDocKey, this.props.treeData)}}
                    toolbar={{
                        image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: false } }
                    }}
                />

            </div>
        );
    }
}

export default ReactDraftEditor;