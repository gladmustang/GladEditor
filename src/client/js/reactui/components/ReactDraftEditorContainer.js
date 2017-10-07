import ReactDraftEditor from "./ReactDraftEditor"
import {connect} from "react-redux"
import {findKeyInTree} from './rcTree/dynamicUtils'
import {loadClipboardImage} from '../../thunkActionCreator/docsActionCreator'
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import {tip} from "./Alert"

var mapStateToProps = (state, ownProps)=> {
    return {
        editorState: state.get("draftEditorReducer").get("editorState"),
        currentDocKey: state.get("docsTreeReducer").get("currentDocKey"),
        treeData:state.get("docsTreeReducer").get("treeData")
    }
}

var mapDispatchToProps = (dispatch)=>{
    return {
        pasteImage: (e)=>{
            dispatch(loadClipboardImage(e));
        },

        onEditorStateChange: (newEditorState,editorState, currentDocKey, treeData)=>{
            var oldContent =draftToHtml(convertToRaw(editorState.getCurrentContent()));
            var newContent = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));

            if(oldContent!=newContent) {
                var newTreeData=[...treeData];
                findKeyInTree(newTreeData, currentDocKey, (item, index, arr) => {
                    item.className="dirtyDoc";
                });
                dispatch({
                    type: 'updateTreeData',
                    treeData: newTreeData
                });
            }
            dispatch({
                type: 'onEditorStateChange',
                editorState: newEditorState
            });

        },
        onTranslation: (text)=>{
            fetch("./translator/translate",{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({text: text})
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                if(data.code==0) {
                    let result = data.result;
                    const msgItems = result.map((msg,index)=>
                        <li key={index}>{msg}</li>
                    );
                    var msgs = (
                        <ul>
                            {msgItems}
                        </ul>
                    );
                    tip(msgs);

                } else {
                    console.log(data.error);
                }

            }).catch(function(e) {
                console.log(e);
                console.log("Oops, error");
            });
        }
    }
}

var ReactDraftEditorContainer = connect (
    mapStateToProps,
    mapDispatchToProps
)(ReactDraftEditor);

export default ReactDraftEditorContainer;