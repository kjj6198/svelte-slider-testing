import { data } from '../data'
describe('App', () => {
  beforeEach(() => {
    // 攔截 GitHub API，套用測試用的假資料
    cy.intercept('https://api.github.com/search/*', {
      ...data
    }).as('githubAPI')
    cy.visit('/')
  })

  it('The slider component should exist', () => {
    cy.findByRole('slider')
      .should('exist')
      .should('have.attr', 'aria-valuenow', '5')
  })

  it('should change value when being clicked', () => {
    const defaultPerPage = 5
    cy.findByText(/列表數/).should('contains.text', defaultPerPage)
    cy.findByRole('slider').trigger('mousedown', 'right')
    cy.findByText(/列表數/).should('contains.text', '30')
  })

  it('should change value when being dragged', () => {
    cy.findByRole('slider')
      .trigger('mousedown', 'left')
      .wait(50)
      .trigger('mousemove', 'right')
      .wait(50)
      .trigger('mouseleave')
    cy.findByRole('slider')
      .should('have.attr', 'aria-valuenow', '30')

    cy.findByText(/列表數/).should('contains.text', '30')
  })

  it('should display API result correctly', () => {
    // 使用 intercept 時可使用標籤讓 cypress 等待此 API 完成後再繼續執行
    cy.wait('@githubAPI')
    data.items.forEach((item) => {
      cy.findByText(item.full_name).should('exist')
    })
  })
})

describe('App#error', () => {
  it('should display error message when API error', () => {
    cy.intercept('GET', 'https://api.github.com/search/*', {
      statusCode: 429,
      body: {
        error: 'You called too many times'
      }
    }).as('error')
    cy.visit('/')
    cy.wait('@error')
    cy.findByText('err: Too Many Requests').should('exist')
  })
})