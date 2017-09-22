import ReactDraftEditor from "./ReactDraftEditor"
import {connect} from "react-redux"
import {findKeyInTree} from './rcTree/dynamicUtils'

var mapStateToProps = (state, ownProps)=> {
    return {
        editorState: state.get("draftEditorReducer").get("editorState"),
        currentDocKey: state.get("docsTreeReducer").get("currentDocKey"),
        treeData:state.get("docsTreeReducer").get("treeData")
    }
}

var mapDispatchToProps = (dispatch)=>{
    return {
        onEditorStateChange: (editorState)=>{
            dispatch({
                type: 'onEditorStateChange',
                editorState: editorState
            });
        },
        onContentStateChange: (editorState, currentDocKey, treeData)=>{
            var newTreeData=[...treeData];
            findKeyInTree(newTreeData, currentDocKey, (item, index, arr) => {
                item.className="dirtyDoc";
            });
            dispatch({
                type: 'updateTreeData',
                treeData: newTreeData
            });
        }
    }
}

var ReactDraftEditorContainer = connect (
    mapStateToProps,
    mapDispatchToProps
)(ReactDraftEditor);

export default ReactDraftEditorContainer;