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

    cy.get('[data-cy="constructor"]').as('constructor');
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

      cy.get('@constructor').within(() => {
        cy.get('[data-cy="constructor-bun-top"]').should('contain', 'Краторная булка N-200i (верх)');
        cy.get('[data-cy="constructor-bun-bottom"]').should('contain', 'Краторная булка N-200i (низ)');
      });
    });

    it('должно добавить начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .parents('li')
        .find('button')
        .click();

      cy.get('@constructor').within(() => {
        cy.get('[data-cy="constructor-ingredients"]').should('contain', 'Биокотлета из марсианской Магнолии');
      });
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

      cy.get('@constructor').within(() => {
        cy.get('[data-cy="constructor-bun-top"]').should('contain', 'Краторная булка N-200i (верх)');
        cy.get('[data-cy="constructor-bun-bottom"]').should('contain', 'Краторная булка N-200i (низ)');
        cy.get('[data-cy="constructor-ingredients"]').should('contain', 'Биокотлета из марсианской Магнолии');
        cy.get('[data-cy="constructor-ingredients"]').should('contain', 'Соус Spicy-X');
      });
    });
  });

  describe('Модальные окна', () => {
    it('должно открыть модальное окно ингредиента при клике', () => {
      cy.contains('Краторная булка N-200i').click();

      cy.get('[data-cy="modal"]').as('modal').should('be.visible');

      cy.get('@modal').within(() => {
        cy.contains('Детали ингредиента').should('be.visible');
        cy.get('[data-cy="modal-content"]').should('contain', 'Краторная булка N-200i');
      });
    });

    it('должно закрыть модальное окно при клике на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy="modal"]').as('modal').should('be.visible');

      cy.get('[data-cy="modal-close-button"]').click();

      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('должно закрыть модальное окно при клике на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.get('[data-cy="modal"]').should('be.visible');

      cy.get('[data-cy="modal-overlay"]').click({ force: true });

      cy.get('[data-cy="modal"]').should('not.exist');
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

      cy.get('[data-cy="order-button"]').click();

      cy.wait('@createOrder');

      cy.get('[data-cy="modal"]').as('orderModal').should('be.visible');

      cy.get('@orderModal').within(() => {
        cy.get('[data-cy="order-number"]').should('contain', '12345');
      });
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

      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="modal-close-button"]').click();

      cy.get('[data-cy="modal"]').should('not.exist');

      cy.get('@constructor').within(() => {
        cy.get('[data-cy="constructor-bun-top-empty"]').should('contain', 'Выберите булки');
        cy.get('[data-cy="constructor-ingredients-empty"]').should('contain', 'Выберите начинку');
      });
    });
  });
});
