describe('API tests with cypress', () => {
    let userName
    let password
    let userId

    before(() => {
        userName = `user_${Math.random().toString(36).substring(2, 10)}`
        password = `Pass_${Math.random().toString(36).substring(2, 10)}!`
    })

    //Создание пользователя успешно
    it('Create user', () => {
        cy.request({
            method: 'POST',
            url: 'https://bookstore.demoqa.com/Account/v1/User',
            body: {
                userName: userName,
                password: password
            }
        }).then(response => {
            expect(response.status).to.eq(201)
            expect(response.body).to.have.property('username', userName)
            expect(response.body).to.have.all.keys('userID', 'username', 'books')
            userId = response.body.userID
        })

    })
    //Создание пользователя c ошибкой, логин уже используется
    it('Create user with error, login already exist', () => {
        cy.request({
            method: 'POST',
            url: 'https://bookstore.demoqa.com/Account/v1/User',
            body: {
                userName: userName,
                password: password
            },
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.eq(406)
            expect(response.body).to.have.property('code', '1204')
            expect(response.body).to.have.property('message', 'User exists!')
        })
    })
    //Создание пользователя c ошибкой, пароль не подходит
    it('Create user with error, wrong password', () => {
        cy.request({
            method: 'POST',
            url: 'https://bookstore.demoqa.com/Account/v1/User',
            body: {
                userName: userName,
                password: '123'
            },
            failOnStatusCode: false
        }).then(response => {
            expect(response.status).to.eq(400)
            expect(response.body).to.have.property('code', '1300')
            expect(response.body).to.have.property('message', "Passwords must have at least one non alphanumeric character, one digit ('0'-'9'), one uppercase ('A'-'Z'), one lowercase ('a'-'z'), one special character and Password must be eight characters or longer.")
        })
    })
    //Генерация токена c ошибкой
    it('Generate Token with error', () => {
        cy.request({
            method: 'POST',
            url: 'https://bookstore.demoqa.com/Account/v1/GenerateToken',
            body: {
                userName: userName,
                password: '123'
            },
            failOnStatusCode: false
        }).then(response => {
            expect(response.body).to.have.all.keys('token', 'expires', 'status', 'result')
            expect(response.body).to.have.property('result', 'User authorization failed.')
        })
    })
    //Генерация токена успешно
    it('Generate Token', () => {
        cy.request({
            method: 'POST',
            url: 'https://bookstore.demoqa.com/Account/v1/GenerateToken',
            body: {
                userName: userName,
                password: password
            },
            failOnStatusCode: false
        }).then(response => {
            expect(response.body).to.have.all.keys('token', 'expires', 'status', 'result')
            expect(response.body).to.have.property('result', 'User authorized successfully.')
            expect(response.body).to.have.property('status', 'Success')
        })
    })
    /*
    after(() => {
        cy.request({
            method: 'DELETE',
            url: `https://bookstore.demoqa.com/Account/v1/User/${userId}`,
        }).then(response => {
            expect(response.status).to.eq(204)
        })
    })
    */
})