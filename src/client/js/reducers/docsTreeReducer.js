import { Map,List } from 'immutable';
import {findKeyInTree} from '../reactui/components/rcTree/dynamicUtils'
const defaultState = Map({
    currentItemName:"",
    currentDocKey:"",
    treeData: [
        { name: 'Document Root', key: '\\' } //Document Root is also used in delete Folder action,
    ],
    selectedKeys:[]
});
// var defaultState = {
//     currentItemName:"",
//     treeData: [
//         { name: 'Document Root', key: '\\documents' }
//     ],
//     selectedKeys:[]
// }
const docsTreeReducer = (state= defaultState, action) => {
    const data = [...state.get("treeData")];
    switch (action.type) {
        case 'setCurrentDoc':
            const currentDocKey = action.currentDocKey;
            var currentItem = null;
            findKeyInTree(data, currentDocKey, (item, index, arr) => {
                currentItem = item;
            });
            if(currentItem) {
                return state.set('currentItemName', currentItem.name).set('currentDocKey', currentDocKey);
            } else {
                return state.set('currentDocKey', currentDocKey);
            }


        case 'changeCurrentItemName':
            // var newState = {...state};
            // newState.currentItemName = action.currentItemName;
            // return newState;
            const selectedKey = state.get("currentDocKey");
            findKeyInTree(data, selectedKey, (item, index, arr) => {
                item.name=action.currentItemName;
                item.className = "dirtyDoc";
            });

            var newState = state.set('currentItemName', action.currentItemName);
            return newState.set("treeData", data);


        case 'updateTreeData':
            // var newState = {...state};
            // newState.treeData = action.treeData;
            // return newState;
            return state.set('treeData', action.treeData);
        case 'updateMultiStates':
            var newState = state;
            for(var key in action.states) {
                var value = action.states[key];
                newState = state.set(key, value);
            }
            return newState;


        default:
            return state;
    }

};
export default docsTreeReducer;

