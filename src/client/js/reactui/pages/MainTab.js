import React from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import ReactDraftEditorPageContainer from './ReactDraftEditorPageContainer'
import RichEditorPage from './RichEditorPage'

const styles = {
    headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
    },
};

function handleActive(tab) {
    alert(`A tab with this route property ${tab.props['data-route']} was activated.`);
}

const MainTab = () => (
    <Tabs>
        {/*<Tab label="Home" >*/}
            {/*<div>*/}
                {/*This is editor home*/}
            {/*</div>*/}
        {/*</Tab>*/}
        <Tab label="Home" >
            <ReactDraftEditorPageContainer/>
        </Tab>
        <Tab
            label="In development"
            // onActive={handleActive}
        >
            <RichEditorPage/>
        </Tab>
    </Tabs>
);

export default MainTab;
