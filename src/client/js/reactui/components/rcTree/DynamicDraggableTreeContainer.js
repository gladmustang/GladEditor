import DynamicDraggableTree from "./DynamicDraggableTree"
import {connect} from "react-redux"
import htmlToDraft from 'html-to-draftjs';
import {stateFromMarkdown} from 'draft-js-import-markdown';
import draftToHtml from 'draftjs-to-html';
// import draftToMarkdown from 'draftjs-to-markdown';
import {stateToMarkdown} from 'draft-js-export-markdown';

import { EditorState, convertToRaw, ContentState } from 'draft-js';
import {findKeyInTree} from './dynamicUtils'
import {success, warning, error} from '../Alert'
import tools from "../../../utils/tools"
import {saveDoc} from '../../../thunkActionCreator/docsActionCreator'

var mapStateToProps = (state, ownProps)=> {
    return {
        currentItemName: state.get("docsTreeReducer").get("currentItemName"),
        currentDocKey: state.get("docsTreeReducer").get("currentDocKey"),
        treeData:state.get("docsTreeReducer").get("treeData"),
        selectedKeys: state.get("docsTreeReducer").get("selectedKeys"),
        editorState: state.get("draftEditorReducer").get("editorState"),
    }
}

var mapDispatchToProps = (dispatch)=>{
    return {
        saveCurrentDoc: (props)=>{
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
        },
        setCurrentDoc:(currentDocKey) => {
            dispatch({
                type: 'setCurrentDoc',
                currentDocKey: currentDocKey
            });
        },
        updateTreeData:(treeData)=>{
            dispatch({
                type: 'updateTreeData',
                treeData: treeData
            })
        },
        updateMultiStates: (newStates)=> {
            dispatch({
                type: 'updateMultiStates',
                states: newStates
            })
        },
        showContent:(content, docKey)=> {
            //loading previous state
            const html = content;
            let contentState = null;
            if(content) {
                if(tools.fileExt(docKey)=='.html') {
                    const contentBlock = htmlToDraft(html);
                    if (contentBlock) {
                        contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    }
                } else if (tools.fileExt(docKey)=='.md') {
                    contentState = stateFromMarkdown(html);
                } else {
                    const contentBlock = htmlToDraft(html);
                    if (contentBlock) {
                        contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    }
                }
                dispatch({
                    type: 'onEditorStateChange',
                    editorState: EditorState.createWithContent(contentState)
                });
            } else {
                var editorState = EditorState.createEmpty();
                dispatch({
                    type: 'onEditorStateChange',
                    editorState: editorState
                });
            }

        },
        deleteDocs:(treeData, deleteKeys)=> {
            var newData = [...treeData];
            let deleteObjs=[];
            let docPaths=[];
            for(var i=0; i<deleteKeys.length; i++) {
                let deleteObj;
                let deleteKey=deleteKeys[i];
                findKeyInTree(newData, deleteKey, (item, index, arr) => {
                    if(item.children) return;
                    arr.splice(index, 1);
                    deleteObj = item;
                });
                if(deleteObj){
                    deleteObjs.push(deleteObj);
                    docPaths.push(deleteObj.key);
                }
            }

            fetch("./documents/deleteDocs",{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({docPaths: docPaths})
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                if(data.code==0) {
                    dispatch({
                        type: 'updateTreeData',
                        treeData: newData
                    });
                    // alert("delete success");
                    success("delete success")
                } else {
                    console.log(data.error);
                    // alert("delete error");
                    error("delete error");
                }

            }).catch(function(e) {
                console.log(e);
                console.log("Oops, error");
            });
        },
        deleteFolder:(treeData, deleteKey)=> {
            var newData = [...treeData];
            let deleteObj;
            findKeyInTree(newData, deleteKey, (item, index, arr) => {
                deleteObj = item;
            });
            if(deleteObj.name=='Document Root') {
                // alert("Can not delete document root!")
                warning("Can not delete document root!");
                return;
            }
            fetch("./documents/deleteDir",{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({dirPath: deleteObj.key})
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                if(data.code==0) {
                    findKeyInTree(newData, deleteKey, (item, index, arr) => {
                        arr.splice(index, 1);
                    });
                    dispatch({
                        type: 'updateTreeData',
                        treeData: newData
                    });
                    // alert("delete folder success");
                    success("delete folder success");
                } else {
                    console.log(data.error);
                    // alert("delete folder error");
                    error("delete folder error")
                }

            }).catch(function(e) {
                console.log(e);
                console.log("Oops, error");
            });
        },
        addChildFolder: (treeData, parentKey)=>{
            const newData = [...treeData];
            var currentItem = null;
            findKeyInTree(newData, parentKey, (item, index, arr) => {
                currentItem = item;
                // item.children.push(
                //     {name:"NewFolder", key: item.key + "\\NewFolder"}
                // );
            });
            if(currentItem) {
                fetch("./documents/addDir",{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({dirPath: currentItem.key + "\\NewFolder"})
                }).then(function(response) {
                    return response.json();
                }).then(function(data) {
                    if(data.code==0) {
                        currentItem.children.push(
                            {name:"NewFolder", key: currentItem.key + "\\NewFolder"}
                        );
                        dispatch({
                            type: 'updateTreeData',
                            treeData: newData
                        });
                        // alert("Add folder success");
                        success("Add folder success");
                    } else {
                        console.log(data.error);
                        error("Add folder error");
                    }

                }).catch(function(e) {
                    console.log(e);
                    console.log("Oops, error");
                });
            } else {
                error("Error when adding folder");
            }
        },
        renameDirOrDoc: (treeKey, newName, treeData)=> {
            const newTreeData = [...treeData];

            fetch("./documents/renameDirOrDoc",{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({dirOrDocPath: treeKey, newName: newName})
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                if(data.code==0) {
                    findKeyInTree(newTreeData, treeKey, (item, index, arr) => {
                        item.name=newName;
                        item.key = data.treeItemInfo.key;
                        if(item.children) {
                            item.children = null;//put it to null can let tree refresh children
                        }
                    });
                    dispatch({
                        type: 'updateTreeData',
                        treeData: newTreeData
                    });
                    success("Rename success");
                } else {
                    console.log(data.error);
                    error("Rename error");
                }

            }).catch(function(e) {
                console.log(e);
                console.log("Oops, error");
            });
        },
        dragMove: (dropKey, dragKey, dropToGap, treeData) => {
            const newTreeData = [...treeData];
            let dragObj;
            findKeyInTree(newTreeData, dragKey, (item, index, arr) => {
                arr.splice(index, 1);
                dragObj = item;
            });
            if (dropToGap) {
                let ar;
                let i;
                findKeyInTree(newTreeData, dropKey, (item, index, arr) => {
                    ar = arr;
                    i = index;
                });
                ar.splice(i, 0, dragObj);
            } else {
                findKeyInTree(newTreeData, dropKey, (item) => {
                    item.children = item.children || [];
                    // where to insert 示例添加到尾部，可以是随意位置
                    item.children.push(dragObj);
                });
            }

            fetch("./documents/dragMove",{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({dragSrcPath: dragKey, dragDestPath: dropKey, dropToGap: dropToGap})
            }).then(function(response) {
                return response.json();
            }).then(function(data) {
                if(data.code==0) {
                    dragObj.key = data.treeItemInfo.key;
                    if(dragObj.children) {
                        dragObj.children = null;//put it to null can let tree refresh children
                    }
                    dispatch({
                        type: 'updateTreeData',
                        treeData: newTreeData
                    });
                    success("DragMove success");
                } else {
                    console.log(data.error);
                    error("DragMove error");
                }

            }).catch(function(e) {
                console.log(e);
                console.log("Oops, error");
            });
        }
    }
}

var DynamicDraggableTreeContainer = connect (
    mapStateToProps,
    mapDispatchToProps
)(DynamicDraggableTree);

export default DynamicDraggableTreeContainer;