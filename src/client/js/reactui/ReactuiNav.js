import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MainTab from './pages/MainTab'
import ConfirmDialog from './components/ConfirmDialog'

class ReactuiNav extends Component {
    render(){
        return (
            <MuiThemeProvider>
                <div>
                    <AppBar style={{
                        marginBottom: '1px'
                    }}
                            title="Glad Editor"
                            iconElementRight={<ConfirmDialog/>}
                    />
                    <MainTab/>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default ReactuiNav;
