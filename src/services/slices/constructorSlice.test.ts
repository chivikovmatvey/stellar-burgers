import reducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from './constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
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
  };

  const mockIngredient: TIngredient = {
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
  };

  describe('addIngredient', () => {
    it('должен добавить булку в конструктор', () => {
      const state = reducer(initialState, addIngredient(mockBun));

      expect(state.bun).toBeDefined();
      expect(state.bun?.name).toBe('Тестовая булка');
      expect(state.bun?.type).toBe('bun');
      expect(state.bun).toHaveProperty('id');
    });

    it('должен заменить существующую булку при добавлении новой', () => {
      const stateWithBun = {
        ...initialState,
        bun: { ...mockBun, id: 'old-id' } as TConstructorIngredient
      };

      const state = reducer(stateWithBun, addIngredient(mockBun));

      expect(state.bun).toBeDefined();
      expect(state.bun?.id).not.toBe('old-id');
    });

    it('должен добавить начинку в конструктор', () => {
      const state = reducer(initialState, addIngredient(mockIngredient));

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe('Тестовая начинка');
      expect(state.ingredients[0]).toHaveProperty('id');
    });

    it('должен добавить несколько начинок в конструктор', () => {
      let state = reducer(initialState, addIngredient(mockIngredient));
      state = reducer(state, addIngredient(mockIngredient));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
    });
  });

  describe('removeIngredient', () => {
    it('должен удалить ингредиент по id', () => {
      const constructorIngredient: TConstructorIngredient = {
        ...mockIngredient,
        id: 'test-id'
      };

      const stateWithIngredient = {
        ...initialState,
        ingredients: [constructorIngredient]
      };

      const state = reducer(stateWithIngredient, removeIngredient('test-id'));

      expect(state.ingredients).toHaveLength(0);
    });

    it('не должен удалять другие ингредиенты', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-1'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-2'
      };
      const ingredient3: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-3'
      };

      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2, ingredient3]
      };

      const state = reducer(stateWithIngredients, removeIngredient('id-2'));

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients.find((i) => i.id === 'id-1')).toBeDefined();
      expect(state.ingredients.find((i) => i.id === 'id-3')).toBeDefined();
      expect(state.ingredients.find((i) => i.id === 'id-2')).toBeUndefined();
    });
  });

  describe('moveIngredient', () => {
    it('должен переместить ингредиент вверх', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-1',
        name: 'Первый'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-2',
        name: 'Второй'
      };
      const ingredient3: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-3',
        name: 'Третий'
      };

      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2, ingredient3]
      };

      const state = reducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 2, toIndex: 0 })
      );

      expect(state.ingredients[0].name).toBe('Третий');
      expect(state.ingredients[1].name).toBe('Первый');
      expect(state.ingredients[2].name).toBe('Второй');
    });

    it('должен переместить ингредиент вниз', () => {
      const ingredient1: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-1',
        name: 'Первый'
      };
      const ingredient2: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-2',
        name: 'Второй'
      };
      const ingredient3: TConstructorIngredient = {
        ...mockIngredient,
        id: 'id-3',
        name: 'Третий'
      };

      const stateWithIngredients = {
        ...initialState,
        ingredients: [ingredient1, ingredient2, ingredient3]
      };

      const state = reducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(state.ingredients[0].name).toBe('Второй');
      expect(state.ingredients[1].name).toBe('Третий');
      expect(state.ingredients[2].name).toBe('Первый');
    });
  });

  describe('clearConstructor', () => {
    it('должен очистить конструктор', () => {
      const stateWithData = {
        bun: { ...mockBun, id: 'bun-id' } as TConstructorIngredient,
        ingredients: [
          { ...mockIngredient, id: 'id-1' } as TConstructorIngredient,
          { ...mockIngredient, id: 'id-2' } as TConstructorIngredient
        ]
      };

      const state = reducer(stateWithData, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
