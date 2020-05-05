import React from 'react';
import ReactDOM from 'react-dom';

// Router
import { BrowserRouter, Route } from 'react-router-dom';

// Redux
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from 'reducers';
import thunk from 'redux-thunk';

import { App, Home, Login, Register, Wall } from 'containers';

//const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    reducers,
    applyMiddleware(thunk)
    //composeEnhancers(applyMiddleware(thunk))
);

const rootElement = document.getElementById('root');

ReactDOM.render(
    (
        <Provider store={store}>
            <BrowserRouter>
                <Route path="/" component={App} />
                <Route exact path="/" component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/register" component={Register} />
                <Route path="/wall/:username" component={Wall} />
            </BrowserRouter>
        </Provider>
    ), rootElement
);
