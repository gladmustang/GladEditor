import EditorToolBar from "./EditorToolBar"
import {connect} from "react-redux"
import draftToHtml from 'draftjs-to-html';
// import draftToMarkdown from 'draftjs-to-markdown';
import {stateToMarkdown} from 'draft-js-export-markdown';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import {findKeyInTree} from './rcTree/dynamicUtils'
import {success, warning, error} from './Alert'
import tools from '../../utils/tools'
import {saveDoc, loadClipboardImage} from '../../thunkActionCreator/docsActionCreator'

var mapStateToProps = (state, ownProps)=> {
    return {
        // currentItemName: state.docsTreeReducer.currentItemName,
        currentItemName: state.get("docsTreeReducer").get("currentItemName"),
        editorState: state.get("draftEditorReducer").get("editorState"),
        currentDocKey: state.get("docsTreeReducer").get("currentDocKey"),
        treeData:state.get("docsTreeReducer").get("treeData")
    }
}

var mapDispatchToProps = (dispatch)=>{
    return {
        dispatch: dispatch,
        handleChange: (event)=>{
            dispatch({
                type: 'changeCurrentItemName',
                currentItemName: event.target.value
            });
        },
        saveDoc: (props)=> {
            dispatch(saveDoc(props));
        }

    }
}

var EditorToolBarContainer = connect (
    mapStateToProps,
    // mapDispatchToProps
)(EditorToolBar);

export default EditorToolBarContainer;