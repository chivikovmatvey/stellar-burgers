describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json'
    }).as('createOrder');

    cy.window().then((win) => {
      win.document.cookie = 'accessToken=mock-access-token';
      win.localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  describe('Добавление ингредиентов', () => {
    it('должно добавить булку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });

    it('должно добавить начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      cy.get('.constructor_elements__wu9yT')
        .should('exist');
    });

    it('должно добавить несколько ингредиентов в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Соус Spicy-X')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Краторная булка N-200i (верх)').should('exist');
      cy.contains('Краторная булка N-200i (низ)').should('exist');
    });
  });

  describe('Модальные окна', () => {
    it('должно открыть модальное окно ингредиента при клике', () => {
      cy.contains('Краторная булка N-200i').click();

      cy.get('[class^="modal_modal"]').should('exist');
      cy.contains('Детали ингредиента').should('exist');

      cy.contains('Краторная булка N-200i').should('exist');
    });

    it('должно закрыть модальное окно при клике на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[class^="modal_modal"]').should('exist');

      cy.get('[class^="modal_button"]').click();

      cy.get('[class^="modal_modal"]').should('not.exist');
    });

    it('должно закрыть модальное окно при клике на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[class^="modal_modal"]').should('exist');

      cy.get('[class^="modal-overlay_overlay"]').click({ force: true });

      cy.get('[class^="modal_modal"]').should('not.exist');
    });
  });

  describe('Создание заказа', () => {
    it('должно создать заказ и отобразить модальное окно с номером заказа', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Соус Spicy-X')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Оформить заказ').click();

      cy.wait('@createOrder');

      cy.get('[class^="modal_modal"]').should('exist');
      cy.contains('12345').should('exist');
    });

    it('должно очистить конструктор после успешного оформления заказа', () => {
      cy.contains('Краторная булка N-200i')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      cy.contains('Оформить заказ').click();
      cy.wait('@createOrder');

      cy.get('[class^="modal_button"]').click();

      cy.get('[class^="modal_modal"]').should('not.exist');

      cy.contains('Выберите булки').should('exist');
      cy.contains('Выберите начинку').should('exist');
    });
  });
});
