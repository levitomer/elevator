import { createStore, compose } from 'redux';
import { install } from 'redux-loop';
import { reducers, initialState } from 'ducks/elevator/reducers';

// Enable devTools Chrome extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore() {
    const store = createStore(
        reducers,
        initialState,
        composeEnhancers(install())
    );

    return store;
}
