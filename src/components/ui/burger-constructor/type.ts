import { TOrder, TConstructorIngredient, TIngredient } from '@utils-types';

export type BurgerConstructorUIProps = {
  constructorItems: {
    bun: TConstructorIngredient | TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  price: number;
  orderModalData: TOrder | null;
  onOrderClick: () => void;
  closeOrderModal: () => void;
};
