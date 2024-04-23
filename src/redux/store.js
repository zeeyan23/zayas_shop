import { configureStore } from '@reduxjs/toolkit';
import countReducer from './reducers/reducer';
import tokenReducer from './reducers/tokenreducer';
import userReducer from './reducers/userReducer';
import axios from 'axios';
import { mainURL } from '../../utils/Urls';

const configureStoreWithInitialCount = async () => {
  try {
    const response = await axios.get(`${mainURL}/zayas_shop/savetocart/`);
    const initialCount = response.data.initialCount;

    return configureStore({
      reducer: {
        count: countReducer,
        token: tokenReducer, 
        username: userReducer
      },
      preloadedState: {
        count: {
          value: initialCount,
        },
      },
    });
  } catch (error) {
    // If the request fails, return a store with default initial state
    return configureStore({
      reducer: {
        count: countReducer,
        token: tokenReducer, 
        username: userReducer
      },
    });
  }
};

// Immediately Invoked Function Expression (IIFE)
const initializeStore = async () => {
  const store = await configureStoreWithInitialCount();
  // You can do additional setup or actions with the store if needed
  return store;
};

export default initializeStore();
