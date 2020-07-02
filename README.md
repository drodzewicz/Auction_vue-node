# Bidit - Auction service

**BidIt** is a web application built using Express and MongoDB on Backend, and Vue.js on Fronend. 
<br> Final project for *Web Technologies* course.
<br> This application can be operated using frontend app created in Vue ( uses passport-local strategy for authentication in clinet ) or any other client like Postman using seperate external API (external API uses passport-JWT strategy fro authentication).
### Application fetures:
* Creating an auction ``two types: time limited or buy now``
* Full CRUD on auctions ``editing and deleting and auction can only be done before start of auction or if it's of type buy now before someone buys it ``
* Backend and frontend pagination
* Chat using socket.io ``application has a chat tab where you can search a user by username and message them``
* Chat notification ``if you are not foused on the chat, you will get a notification that you got a new message``
* Live bidding ``when auction starts, logged in users have acces to bidding on an item. Bids are displayed live (using socket.io) to each logged in user that takes part in bidding``

### Install dependencies

```sh
npm install
```

### Running app

```sh
npm run dev
```
> application requires a **.env** file which has to contain:
<br> DBURI: *Database URI*
<br> PORT: *clinet port*
<br> SERVER_PORT: *babckend server port*
<br> APP_SECRET: *secret that will be used to encrypt passwords and tokens*
<br> NODE_ENV: *[ production | development ]*

## Used Technologies
### Backend
* [Node.js](https://nodejs.org) - pen-source, cross-platform JavaScript run-time environment for executing JavaScript code server-side
* [Express.js](https://expressjs.com) - for building web applications, APIs and connecting middleware.
* [MongoDB](https://www.mongodb.com) - NoSQL database for data storage.
* [Mongoose](http://mongoosejs.com/)  - ODM library for MongoDB and Node.js.
* [PassportJS](http://www.passportjs.org/) - authentication middleware for Node.js.
* [Passport-Local](https://github.com/jaredhanson/passport-local#passport-local) - used local strategy for authentication.
* [Passport-JWT](http://www.passportjs.org/packages/passport-jwt/) - A Passport strategy for authenticating with a JSON Web Token.
* [bcryptjs](https://www.npmjs.com/package/bcrypt) - A library to help you hash passwords.
* [connect-mongo](https://www.npmjs.com/package/connect-mongo) - MongoDB session store for Connect and Express.
* [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) - An implementation of JSON Web Tokens.
* [passport.socketio](https://www.npmjs.com/package/passport.socketio) - Access passport.js user information from a socket.io connection.
* [socket.io](https://www.npmjs.com/package/socket.io) - Socket.IO enables real-time bidirectional event-based communication.

### Frontend
* [Vue.js](https://vuejs.org/v2/guide/) - framework fro building user interfaces.
* [SASS](https://sass-lang.com/) - used for styling HTML.
* [moment](https://momentjs.com/) - simple date formatter
* [axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js
* [vuex](https://vuex.vuejs.org/api/) - Vuex is a state management pattern + library for Vue.js applications.
* [vue-router](https://router.vuejs.org/) - Vue Router is the official router for Vue.js.
* [socket.io-client](https://www.npmjs.com/package/socket.io-client) - A standalone build of socket.io-client is exposed automatically by the socket.io server as /socket.io/socket.io.js.







