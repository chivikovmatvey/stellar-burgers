import store from './store';
import ingredientsReducer from './slices/ingredientsSlice';
import constructorReducer from './slices/constructorSlice';
import userReducer from './slices/userSlice';
import orderReducer from './slices/orderSlice';
import feedReducer from './slices/feedSlice';

describe('rootReducer', () => {
  it('должен правильно инициализировать все редьюсеры с начальным состоянием', () => {
    const initAction = { type: '@@INIT' };
    const state = store.getState();

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      burgerConstructor: constructorReducer(undefined, initAction),
      user: userReducer(undefined, initAction),
      order: orderReducer(undefined, initAction),
      feed: feedReducer(undefined, initAction)
    });
  });

  it('должен возвращать то же состояние при неизвестном экшене', () => {
    const prevState = store.getState();
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    store.dispatch(unknownAction as any);
    const state = store.getState();

    expect(state).toEqual(prevState);
  });

  it('должен обрабатывать действия и обновлять состояние', () => {
    const state = store.getState();
    expect(state).toBeDefined();
    expect(typeof store.dispatch).toBe('function');
    expect(typeof store.getState).toBe('function');
  });
});
