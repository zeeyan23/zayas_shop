import { configureStore } from '@reduxjs/toolkit';
import countReducer from './reducers/reducer';
import axios from 'axios';
import { mainURL } from '../../utils/Urls';

const configureStoreWithInitialCount = async () => {
  try {
    const response = await axios.get(`${mainURL}/zayas_shop/savetocart/`);
    const initialCount = response.data.initialCount;

    return configureStore({
      reducer: {
        count: countReducer,
      },
      preloadedState: {
        count: {
          value: initialCount,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching initial count:', error);
    // If the request fails, return a store with default initial state
    return configureStore({
      reducer: {
        count: countReducer,
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
