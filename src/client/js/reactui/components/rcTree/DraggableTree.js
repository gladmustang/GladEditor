import 'rc-tree/assets/index.css';
import React, {Component} from 'react';
import Tree, { TreeNode } from 'rc-tree';
import Tooltip from 'rc-tooltip';
import cssAnimation from 'css-animation';
import '../../../../css/rcTreeBasic.css'
import '../../../../less/contextmenu.less'
import { gData } from './rcTreeUtils'

var menuListStyle = {
    listStyle:"none",
    marginLeft: 0,
    paddingLeft: 0,
}

function animate(node, show, done) {
    let height = node.offsetHeight;
    return cssAnimation(node, 'collapse', {
        start() {
            if (!show) {
                node.style.height = `${node.offsetHeight}px`;
            } else {
                height = node.offsetHeight;
                node.style.height = 0;
            }
        },
        active() {
            node.style.height = `${show ? height : 0}px`;
        },
        end() {
            node.style.height = '';
            done();
        },
    });
}

const animation = {
    enter(node, done) {
        return animate(node, true, done);
    },
    leave(node, done) {
        return animate(node, false, done);
    },
    appear(node, done) {
        return animate(node, true, done);
    },
};

function contains(root, n) {
    let node = n;
    while (node) {
        if (node === root) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

class DraggableTree extends Component {
    state = {
        gData,
        autoExpandParent: true,
        expandedKeys: [],
        selectedKeys:[]
    };

    componentDidMount() {
        this.getContainer();
        // console.log(ReactDOM.findDOMNode(this), this.cmContainer);
        console.log(contains(ReactDOM.findDOMNode(this), this.cmContainer));
    }
    componentWillUnmount() {
        this._removeContainer();
    }

    onSelect = (selectedKeys) => {
        this.setState({ selectedKeys });
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
        const dropKey = info.node.props.eventKey;
        const dragKey = info.dragNode.props.eventKey;
        // const dragNodesKeys = info.dragNodesKeys;
        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                if (item.key === key) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };
        const data = [...this.state.gData];
        let dragObj;
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1);
            dragObj = item;
        });
        if (info.dropToGap) {
            let ar;
            let i;
            loop(data, dropKey, (item, index, arr) => {
                ar = arr;
                i = index;
            });
            ar.splice(i, 0, dragObj);
        } else {
            loop(data, dropKey, (item) => {
                item.children = item.children || [];
                // where to insert 示例添加到尾部，可以是随意位置
                item.children.push(dragObj);
            });
        }
        this.setState({
            gData: data,
            // selectedKeys:[dragObj.key]
        });
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
        this.setState({ selectedKeys: [info.node.props.eventKey] });
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

    deleteTreeItem = (info) => {
        this._removeContainer();
        const deleteKey = info.node.props.eventKey;
        // const dragNodesKeys = info.dragNodesKeys;
        const loop = (data, key, callback) => {
            data.forEach((item, index, arr) => {
                if (item.key === key) {
                    return callback(item, index, arr);
                }
                if (item.children) {
                    return loop(item.children, key, callback);
                }
            });
        };
        const data = [...this.state.gData];
        let deleteObj;
        loop(data, deleteKey, (item, index, arr) => {
            arr.splice(index, 1);
            deleteObj = item;
        });
        this.setState({
            gData: data
        });
    }
    renderCm(info) {
        if (this.toolTip) {
            ReactDOM.unmountComponentAtNode(this.cmContainer);
            this.toolTip = null;
        }
        this.toolTip = (
            <Tooltip placement="bottomLeft"
                     prefixCls="rc-tree-contextmenu"
                     trigger={['click']}
                     defaultVisible
                     overlay={
                         <ul style={menuListStyle}>
                             <li onClick={()=>{this.deleteTreeItem(info)}}>delete</li>
                             <li>add</li>
                         </ul>
                     }
            >
            <span></span>
            </Tooltip>
        );

        const container = this.getContainer();
        Object.assign(this.cmContainer.style, {
            position: 'absolute',
            left: `${info.event.pageX}px`,
            top: `${info.event.pageY}px`,
        });

        ReactDOM.render(this.toolTip, container);
    }



    render(){
        const loop = data => {
            return data.map((item) => {
                if (item.children && item.children.length) {
                    return <TreeNode key={item.key} title={item.title}>{loop(item.children)}</TreeNode>;
                }
                return <TreeNode key={item.key} title={item.title} />;
            });
        };
        return (
            <div>
                <Tree className ="folderTree"
                    defaultExpandAll={false}
                    openAnimation={animation}
                    onRightClick={this.onRightClick}
                    onMouseLeave={this.onMouseLeave}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                    showLine
                    expandedKeys={this.state.expandedKeys}
                    onExpand={this.onExpand}
                    autoExpandParent={this.state.autoExpandParent}
                    draggable
                    onDragStart={this.onDragStart}
                    onDragEnter={this.onDragEnter}
                    onDrop={this.onDrop}
                >
                    {/*<TreeNode title="parent 1" key="p1">*/}
                        {/*<TreeNode key="p10" title="leaf"/>*/}
                        {/*<TreeNode title="parent 1-1" key="p11">*/}
                            {/*<TreeNode title="parent 2-1" key="p21">*/}
                                {/*<TreeNode title="leaf"/>*/}
                                {/*<TreeNode title="leaf"/>*/}
                            {/*</TreeNode>*/}
                            {/*<TreeNode key="p22" title="leaf"/>*/}
                        {/*</TreeNode>*/}
                    {/*</TreeNode>*/}
                    {loop(this.state.gData)}
                </Tree>
            </div>
        );
    }


}


export default DraggableTree;
