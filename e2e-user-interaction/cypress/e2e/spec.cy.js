describe('Todos', () => {
    if('visits initial project page', () => {
        cy.visit("/");
        cy.contains("todos");
    });
});