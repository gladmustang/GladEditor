import {findKeyInTree} from '../reactui/components/rcTree/dynamicUtils'
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import {stateToMarkdown} from 'draft-js-export-markdown';
import draftToMarkdown from 'draftjs-to-markdown';
import { mdToDraftjs } from 'draftjs-md-converter';
import  toMarkdown  from 'to-markdown';
import { EditorState, convertToRaw, convertFromRaw, ContentState } from 'draft-js';
import tools from '../utils/tools'
import {success, warning, error} from '../reactui/components/Alert'
import { AtomicBlockUtils } from 'draft-js';




const saveDoc = props => (dispatch, getState) => {
    var {currentDocKey, editorState, treeData} = props;
    const newTreeData = [...treeData];
    var currentItem = null;
    findKeyInTree(newTreeData, currentDocKey, (item, index, arr) => {
        currentItem = item;
    });
    if(currentItem) {
        var newFileName = currentItem.name;
        var docPath = currentItem.key;
        var content = null;
        if(tools.fileExt(docPath)=='.html') {
            content =draftToHtml(convertToRaw(editorState.getCurrentContent()));
        } else if (tools.fileExt(docPath)=='.md'){
            // content =draftToMarkdown(convertToRaw(editorState.getCurrentContent()));
            // content = stateToMarkdown(editorState.getCurrentContent());
            content =toMarkdown(draftToHtml(convertToRaw(editorState.getCurrentContent())));

        } else {
            content =draftToHtml(convertToRaw(editorState.getCurrentContent()));
        }

        fetch("./documents/saveDoc",{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({docPath: docPath, fileName: newFileName, content: content })
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            if(data.code==0) {
                //_this.props.updateTreeData(treeData);
                var fileInfo= data.fileInfo;
                currentItem.name = fileInfo.name;
                currentItem.key=fileInfo.key;
                currentItem.className="";
                dispatch({
                    type:'updateTreeData',
                    treeData: newTreeData
                })
                // alert("save success");
                success("Save Success!")
            } else {
                console.log(data.error);
            }

        }).catch(function(e) {
            console.log(e);
            console.log("Oops, error");
        });
    } else {
        // alert("Error on saving!");
        error("Error on saving!");
    }

};

const showContent = (content, docKey) => (dispatch, getState) => {
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
            // contentState = stateFromMarkdown(html);
            const rawData = mdToDraftjs(html);
            contentState = convertFromRaw(rawData);
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

}

const loadClipboardImage = (event)  => (dispatch, getState) => {
    var editorState = getState().get("draftEditorReducer").get("editorState");
    var currentDocKey = getState().get("docsTreeReducer").get("currentDocKey");
    var content = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    dispatch(showContent(content,currentDocKey));
    // setTimeout(dispatch(showContent(content,currentDocKey)), 500);
    var clipboardData = event.clipboardData,
        i = 0,
        items, item, types;

    if( clipboardData ){
        items = clipboardData.items;

        if( !items ){
            return;
        }

        item = items[0];
        types = clipboardData.types || [];

        for( ; i < types.length; i++ ){
            if( types[i] === 'Files' ){
                item = items[i];
                break;
            }
        }

        if( item && item.kind === 'file' && item.type.match(/^image\//i) ){
            var blob = item.getAsFile(),
                reader = new FileReader();

            reader.onload = function( e ){
                var src=e.target.result;
                const entityData = { src};
                entityData.alt = 'No image found';
                const entityKey = editorState
                    .getCurrentContent()
                    .createEntity('IMAGE', 'MUTABLE', entityData)
                    .getLastCreatedEntityKey();
                const newEditorState = AtomicBlockUtils.insertAtomicBlock(
                    editorState,
                    entityKey,
                    ' ',
                );
                dispatch({
                    type: "onEditorStateChange",
                    editorState: newEditorState
                })
            };

            reader.readAsDataURL( blob );
        }
    }
}


export {saveDoc, loadClipboardImage, showContent} ;
