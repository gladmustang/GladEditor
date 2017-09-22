import 'rc-tree/assets/index.css';
import React, {Component} from 'react';
// var Radium = require('radium');
// import Style from 'style-it';
import Tree, { TreeNode } from 'rc-tree';
import Tooltip from 'rc-tooltip';
import '../../../../css/rcTreeBasic.css'
import '../../../../less/contextmenu.less'
// import { gData } from './rcTreeUtils'
import {animation, contains} from "./animateUtils"
import {generateTreeNodes, setLeaf, getNewTreeDataWithExactMatch, findKeyInTree} from "./dynamicUtils"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import config from '../../../../../config/common'


// var menuListStyle =   {
//     listStyle:"none",
//     marginLeft: 0,
//     paddingLeft: 0,
//     paddingTop: 8
// }
//


class DynamicDraggableTree extends Component {
    state = {
        // treeData: [],
        autoExpandParent: true,
        expandedKeys: [],
        multiple: false,
        // selectedKeys:[],
        renameOpen: false,
        inputValue: ''
    };

    componentDidMount() {
        this.getContainer();
        console.log(contains(ReactDOM.findDOMNode(this), this.cmContainer));
        // setTimeout(() => {
        //     this.setState({
        //         treeData: [
        //             { name: 'Document Root', key: '\\documents' },
        //             // { name: 'pNode 02', key: '0-1' },
        //             // { name: 'pNode 03', key: '0-2', isLeaf: true },
        //         ]
        //     });
        // }, 100);
    }
    componentWillUnmount() {
        this._removeContainer();
    }
    loadFolderData = (treeNode, callback, errCallback)=>{
        fetch("./documents/getChildNodes",{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({path: treeNode.props.eventKey})
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            callback(data);

        }).catch(function(e) {
            errCallback(e);
        });
    }
    onLoadData = (treeNode) => {
        const treeData = [...this.props.treeData];
        var _this = this;
        return new Promise((resolve,reject) => {
            this.loadFolderData(treeNode, (data)=>{
                if(data.code==0) {
                    // console.log(data);
                    getNewTreeDataWithExactMatch(treeData, treeNode.props.eventKey, data.childNodes, 100);
                    // _this.setState({ treeData });
                    _this.props.updateTreeData(treeData);
                    resolve();

                } else {
                    console.log(data.error);
                    reject();
                }
            }, (e)=>{
                console.log(e);
                console.log("Oops, error");
                reject();
            })
        });
        // return new Promise((resolve,reject) => {
        //     fetch("./documents/getChildNodes",{
        //         headers: {
        //             'Accept': 'application/json',
        //             'Content-Type': 'application/json'
        //         },
        //         method: "POST",
        //         body: JSON.stringify({path: treeNode.props.eventKey})
        //     }).then(function(response) {
        //         return response.json();
        //     }).then(function(data) {
        //         if(data.code==0) {
        //             // console.log(data);
        //             getNewTreeDataWithExactMatch(treeData, treeNode.props.eventKey, data.childNodes, 100);
        //             // _this.setState({ treeData });
        //             _this.props.updateTreeData(treeData);
        //             resolve();
        //
        //         } else {
        //             console.log(data.error);
        //             reject();
        //         }
        //
        //     }).catch(function(e) {
        //         console.log(e);
        //         console.log("Oops, error");
        //         reject();
        //     });
        // });
    }

    onSelect = (selectedKeys, info) => {
        // this.setState({ selectedKeys });
        this.props.updateMultiStates({selectedKeys});
        const showContent = this.props.showContent;
        if(info.node.props.isLeaf) {
            var expandedKeys = this.state.expandedKeys;
            expandedKeys.push(info.node.props.eventKey);
            this.setState({
                expandedKeys: expandedKeys
            });
            if(selectedKeys.length>0) {
                findKeyInTree(this.props.treeData, this.props.currentDocKey, (item, index, arr) => {
                    if(item.className=="dirtyDoc") {
                        this.props.saveCurrentDoc(this.props);
                    }
                });
                this.props.setCurrentDoc(selectedKeys[0]);
                fetch("./documents/getDocument", {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({docPath: selectedKeys[0]})
                }).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    if (data.code == 0) {
                        //show data in editor
                        showContent(data.content, selectedKeys[0]);
                    } else {
                        console.log(data.error);
                        showContent("");
                    }

                }).catch(function (e) {
                    console.log(e);
                    console.log("Oops, error");
                });
            }

        }

    }

    onDragStart = (info)=> {
        console.log('start', info);
    }

    onDragEnter= (info)=> {
        console.log('enter', info);
        this.setState({
            expandedKeys: info.expandedKeys,
        });
    }
    onDrop = (info) => {
        console.log('drop', info);
        if(info.dropToGap) {
            const dropKey = info.node.props.eventKey;
            const dragKey = info.dragNode.props.eventKey;
            // const dragNodesKeys = info.dragNodesKeys;
            this.props.dragMove(dropKey, dragKey, info.dropToGap, this.props.treeData);
            // this.props.updateTreeData(data);
        } else {
            if(info.node.props.isLeaf) {
                return;
            }
            this.onLoadData(info.node).then(()=> {
                const dropKey = info.node.props.eventKey;
                const dragKey = info.dragNode.props.eventKey;
                // const dragNodesKeys = info.dragNodesKeys;
                this.props.dragMove(dropKey, dragKey, info.dropToGap, this.props.treeData);
                // this.props.updateTreeData(data);
            });
        }
    }

    onExpand = (expandedKeys) => {
        console.log('onExpand');
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }
    onRightClick = (info) => {
        console.log('right click', info);
        // this.props.updateMultiStates({ selectedKeys: [info.node.props.eventKey] })
        this.renderCm(info);
    }
    getContainer = () => {
        if (!this.cmContainer) {
            this.cmContainer = document.createElement('div');
            document.body.appendChild(this.cmContainer);
        }
        return this.cmContainer;
    }

    _removeContainer = () => {
        if(this.cmContainer) {
            ReactDOM.unmountComponentAtNode(this.cmContainer);
            this.toolTip = null;
            document.body.removeChild(this.cmContainer);
            this.cmContainer=null;
        }
    }

    addChildItem = (info) => {
        this._removeContainer();
        const parentKey = info.node.props.eventKey;

        const data = [...this.props.treeData];
        var docKey=null;
        findKeyInTree(data, parentKey, (item, index, arr) => {
            var suffix = Math.round(Math.random()*10000);
            docKey =  item.key + "\\NewDoc"+suffix+config.defaultExt;
            item.children.push(
                {name:"NewDoc"+suffix, key: docKey, isLeaf: true, className: 'dirtyDoc'}
            );
        });

        this.props.updateMultiStates({
            treeData: data,
            selectedKeys: [docKey]
        });
        this.props.setCurrentDoc(docKey);
        this.props.showContent("");
        // this.props.updateTreeData(data);

    }

    addChildFolder = (info) => {
        this._removeContainer();
        const parentKey = info.node.props.eventKey;
        // this.setState({
        //     treeData: data
        // });
        this.props.addChildFolder(this.props.treeData, parentKey);
        // this.props.updateTreeData(data);

    }
    renameTreeItem = (info)=> {
        this.setState({
            renameOpen: true,
            renameItem: info
        })

    }
    handleRenameDialogClose = ()=> {
        this.setState(
            {
                renameOpen: false
            }
        );
    }

    handleRenameDialogSubmit = (info)=> {
        const renameKey = info.node.props.eventKey;
        var newName = this.state.inputValue;
        this.setState({
            renameOpen: false
        });
        // this.props.updateTreeData(data);
        this.props.renameDirOrDoc(renameKey, newName, this.props.treeData);
    }


    handleInputChange = (e)=> {
        this.setState(
            {
                inputValue: e.target.value
            }
        );
    }

    deleteTreeItems = (info) => {
        this._removeContainer();
        // const deleteKey = info.node.props.eventKey;
        // this.props.deleteDoc(this.props.treeData, deleteKey);
        const selectedKeys = this.props.selectedKeys;
        this.props.deleteDocs(this.props.treeData,selectedKeys);

    }

    deleteFolderItem = (info) =>{
        this._removeContainer();
        const deleteKey = info.node.props.eventKey;
        this.props.deleteFolder(this.props.treeData, deleteKey);
    }

    refreshFolderItem = (info) => {
        this._removeContainer();
        const treeData = [...this.props.treeData];
        var _this = this;
        this.loadFolderData(info.node, (data)=>{
            if(data.code==0) {
                const curKey = info.node.props.eventKey;
                const child = data.childNodes;
                const loop = (data) => {
                    data.forEach((item) => {
                        if (curKey == item.key) {
                            if( item.children) {
                                item.children = child;
                            }
                        } else {
                            if (item.children) {
                                loop(item.children);
                            }
                        }
                    });
                };
                loop(treeData);
                _this.props.updateTreeData(treeData);
            } else {
                console.log(data.error);
            }
        }, (e)=>{
            console.log(e);
            console.log("Oops, error");
        })
    }

    toggleMultiple = ()=>{
        this._removeContainer();
        var multiple = !this.state.multiple;
        this.setState({
            multiple: multiple
        })
    }
    renderCm(info) {
        if (this.toolTip) {
            ReactDOM.unmountComponentAtNode(this.cmContainer);
            this.toolTip = null;
        }
        if(info.node.props.isLeaf) {
            this.toolTip = (
                <Tooltip placement="bottomLeft"
                         prefixCls="rc-tree-contextmenu"
                         trigger={['click']}
                         defaultVisible
                         overlay={
                             <MuiThemeProvider>
                                 <Menu>
                                     <MenuItem primaryText="Rename" onClick={()=>{this.renameTreeItem(info)}}/>
                                     <MenuItem primaryText="Delete" onClick={()=>{this.deleteTreeItems(info)}}/>
                                     <MenuItem primaryText={this.state.multiple?"Cancel Multiple Selection Mode": "Multiple Selection Mode"} onClick={this.toggleMultiple}/>
                                 </Menu>
                             </MuiThemeProvider>
                         }
                >
                    <span></span>
                </Tooltip>
            );
        } else {
            this.toolTip = (
                <Tooltip placement="bottomLeft"
                         prefixCls="rc-tree-contextmenu"
                         trigger={['click']}
                         defaultVisible
                        overlay={
                            <MuiThemeProvider>
                              <Menu>
                                <MenuItem primaryText="Add a new document" onClick={()=>{this.addChildItem(info)}}/>
                                <MenuItem primaryText="Add a new folder" onClick={()=>{this.addChildFolder(info)}}/>
                                <MenuItem primaryText="Rename" onClick={()=>{this.renameTreeItem(info)}}/>
                                <MenuItem primaryText="Delete" onClick={()=>{this.deleteFolderItem(info)}}/>
                                <MenuItem primaryText="Refresh" onClick={()=>{this.refreshFolderItem(info)}}/>
                              </Menu>
                            </MuiThemeProvider>
                        }
                >
                    <span></span>
                </Tooltip>
            );
        }



        const container = this.getContainer();
        Object.assign(this.cmContainer.style, {
            position: 'absolute',
            left: `${info.event.pageX}px`,
            top: `${info.event.pageY}px`,
        });

        ReactDOM.render(this.toolTip, container);
    }



    render(){
        const loop = (data) => {
            return data.map((item) => {
                if(!item.className) {
                    item.className = "";
                }
                if (item.children) {
                    return <TreeNode title={item.name} key={item.key} className={item.className}>{loop(item.children)}</TreeNode>;
                }
                return (
                    <TreeNode title={item.name} key={item.key} isLeaf={item.isLeaf} className={item.className}
                    />
                );
            });
        };
        const treeNodes = loop(this.props.treeData);
        return (
            <div>
                <Tree className ="folderTree"
                    defaultExpandAll={false}
                    openAnimation={animation}
                    onRightClick={this.onRightClick}
                    onMouseLeave={this.onMouseLeave}
                    onSelect={this.onSelect}
                    selectedKeys={this.props.selectedKeys}
                    showLine
                    expandedKeys={this.state.expandedKeys}
                    onExpand={this.onExpand}
                    autoExpandParent={this.state.autoExpandParent}
                    draggable
                    onDragStart={this.onDragStart}
                    onDragEnter={this.onDragEnter}
                    onDrop={this.onDrop}
                    loadData={this.onLoadData}
                    multiple={this.state.multiple}
                >
                    {treeNodes}
                </Tree>
                <Dialog
                    title="Rename the file/folder"
                    actions={
                        [
                            <FlatButton
                                label="Cancel"
                                primary={true}
                                onClick={this.handleRenameDialogClose}
                            />,
                            <FlatButton
                                label="Submit"
                                primary={true}
                                onClick={(e)=> {this.handleRenameDialogSubmit(this.state.renameItem)}}
                            />,
                        ]
                    }
                    modal={true}
                    open={this.state.renameOpen}
                >
                    <TextField
                        floatingLabelText="Input New Name"
                        onChange={this.handleInputChange}
                        value={this.state.inputValue}
                    />
                </Dialog>
            </div>
        );
    }


}


export default (DynamicDraggableTree);
