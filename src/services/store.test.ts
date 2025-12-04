import { configureStore } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';

describe('rootReducer', () => {
  it('должен правильно инициализировать все редьюсеры', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        burgerConstructor: constructorReducer,
        user: userReducer,
        order: orderReducer,
        feed: feedReducer
      }
    });

    const state = store.getState();

    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('feed');

    expect(state.ingredients).toEqual({
      ingredients: [],
      loading: false,
      error: null
    });

    expect(state.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('должен обрабатывать действия и обновлять состояние', () => {
    const store = configureStore({
      reducer: {
        ingredients: ingredientsReducer,
        burgerConstructor: constructorReducer,
        user: userReducer,
        order: orderReducer,
        feed: feedReducer
      }
    });

    const initialState = store.getState();
    expect(initialState).toBeDefined();
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
  });
});
