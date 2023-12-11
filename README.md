# Mywallet-backend

This application consists in a financial dashboard, where the user registers a account and then can registers the incomes and expenses. It is also possible to edit and delete any entries. The user's login is persisted.

## deployed application link: https://mywallet-frontend-two.vercel.app/

Running the application locally:

run the following commands in the root directory:

-- npm run install
-- createa a .env file in root directory as in .env.example file
-- npm run dev

then use a service such as postman or thunderclient for requests. Examples on how to do so are listed below.

-- Technologies --

-> JavaScript
-> NodeJS
-> uuid
-> Joi
-> ExpressJs
-> MongoDB

-- Auth Routes --

POST:

/cadastro - registers a new account for a user.

body:

{
    "name": "name",
    "email": "email@email.com",
    "password": "passsword"
}

/login - access the users account.

body:

{
    "email": "email@email.com",
    "password": "password"
}

/logout - logs out from users account.

-- Transaction Routes --

Note: All Routes are Authenticated by a token system

GET:

/transactions - retrieves user's transactions from DataBase.

POST:

/nova-transacao/:type - Registers a new transaction for the user, can be of income or expense types.

body:

{
    "value": Number(value),
    "description": "description"
}

DELETE:

/delete-entry/:id - deletes respective entry by id, if it exists and is owned by the logged user

PUT:

/edit-entry/:type/:id - edits entries info if it exists and is owned by the user.