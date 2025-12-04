import reducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Тестовая булка',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'test.png',
      image_large: 'test-large.png',
      image_mobile: 'test-mobile.png'
    },
    {
      _id: '2',
      name: 'Тестовая начинка',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'test.png',
      image_large: 'test-large.png',
      image_mobile: 'test-mobile.png'
    }
  ];

  describe('fetchIngredients.pending', () => {
    it('должен установить loading в true при запросе', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = reducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('должен очистить предыдущую ошибку при новом запросе', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error'
      };

      const action = { type: fetchIngredients.pending.type };
      const state = reducer(stateWithError, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(null);
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен сохранить ингредиенты и установить loading в false', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(2);
    });

    it('должен заменить предыдущие ингредиенты новыми', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: [mockIngredients[0]]
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const state = reducer(stateWithIngredients, action);

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients).toEqual(mockIngredients);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен сохранить ошибку и установить loading в false', () => {
      const errorMessage = 'Failed to fetch';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };

      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it('должен использовать дефолтное сообщение об ошибке, если сообщение не предоставлено', () => {
      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };

      const state = reducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Failed to fetch ingredients');
    });

    it('не должен изменять существующие ингредиенты при ошибке', () => {
      const stateWithIngredients = {
        ...initialState,
        ingredients: mockIngredients
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: 'Error' }
      };

      const state = reducer(stateWithIngredients, action);

      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBe('Error');
    });
  });
});
