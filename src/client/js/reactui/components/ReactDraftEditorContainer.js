import ReactDraftEditor from "./ReactDraftEditor"
import {connect} from "react-redux"
import {findKeyInTree} from './rcTree/dynamicUtils'
import {loadClipboardImage} from '../../thunkActionCreator/docsActionCreator'
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';

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

            if(true) {
                var newTreeData=[...treeData];
                findKeyInTree(newTreeData, currentDocKey, (item, index, arr) => {
                    item.className="dirtyDoc";
                });
                dispatch({
                    type: 'updateTreeData',
                    treeData: newTreeData
                });
                dispatch({
                    type: 'onEditorStateChange',
                    editorState: newEditorState
                });
            }

        }
    }
}

var ReactDraftEditorContainer = connect (
    mapStateToProps,
    mapDispatchToProps
)(ReactDraftEditor);

export default ReactDraftEditorContainer;