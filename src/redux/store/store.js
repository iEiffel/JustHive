/**
 * Created by nick on 20/07/16.
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// Import the root reducer (which imports all subreducers)
import rootReducer from 'ReduxReducers';

// Initializing with middleware
const createStoreWithMiddleware = applyMiddleware(thunk);

const finalCreateStore = compose(createStoreWithMiddleware)(createStore);

// Create the store with an initial (empty) state
// In a complex application, we might rehydrate this state from AsyncStorage or etc

export const store = finalCreateStore(rootReducer);
