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
            // var {currentDocKey, editorState, treeData} = props;
            // const newTreeData = [...treeData];
            // var currentItem = null;
            // findKeyInTree(newTreeData, currentDocKey, (item, index, arr) => {
            //     currentItem = item;
            // });
            // if(currentItem) {
            //     var newFileName = currentItem.name;
            //     var docPath = currentItem.key;
            //     var content = null;
            //     if(tools.fileExt(docPath)=='.html') {
            //         content =draftToHtml(convertToRaw(editorState.getCurrentContent()));
            //     } else if (tools.fileExt(docPath)=='.md'){
            //         // content =draftToMarkdown(convertToRaw(editorState.getCurrentContent()));
            //         content = stateToMarkdown(editorState.getCurrentContent());
            //     } else {
            //         content =draftToHtml(convertToRaw(editorState.getCurrentContent()));
            //     }
            //
            //     fetch("./documents/saveDoc",{
            //         headers: {
            //             'Accept': 'application/json',
            //             'Content-Type': 'application/json'
            //         },
            //         method: "POST",
            //         body: JSON.stringify({docPath: docPath, fileName: newFileName, content: content })
            //     }).then(function(response) {
            //         return response.json();
            //     }).then(function(data) {
            //         if(data.code==0) {
            //             //_this.props.updateTreeData(treeData);
            //             var fileInfo= data.fileInfo;
            //             currentItem.name = fileInfo.name;
            //             currentItem.key=fileInfo.key;
            //             currentItem.className="";
            //             dispatch({
            //                 type:'updateTreeData',
            //                 treeData: newTreeData
            //             })
            //             // alert("save success");
            //             success("Save Success!")
            //         } else {
            //             console.log(data.error);
            //         }
            //
            //     }).catch(function(e) {
            //         console.log(e);
            //         console.log("Oops, error");
            //     });
            // } else {
            //     // alert("Error on saving!");
            //     error("Error on saving!");
            // }

        }

    }
}

var EditorToolBarContainer = connect (
    mapStateToProps,
    mapDispatchToProps
)(EditorToolBar);

export default EditorToolBarContainer;