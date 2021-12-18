import React from 'react';
import {Switch, Route} from 'react-router-dom';
import './App.css';
import 'mapillary-js/dist/mapillary.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import env from 'react-dotenv';
import PlayDecodeWrapper from './Play';
import CreateChallenge from './CreateChallenge';

function App() {
    return (
        <main>
            <Switch baseName={env.REACT_APP_BASE_NAME}>
                <Route path="/drop/:configString" component={PlayDecodeWrapper} exact/>
                <Route path="/" component={CreateChallenge}/>
            </Switch>
        </main>
    );
}

export default App;
