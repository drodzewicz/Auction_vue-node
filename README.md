# Bidit - Auction service
[**Live Preview**](https://auction-bidit.herokuapp.com)

**BidIt** is a web application built using Express and MongoDB on Backend, and Vue.js on Frotnend.
This is a online shopping site with consumer to consumer sales. On this website users can either sell or auction their products and other users can participate in set auctions.
Site has also built in live chat where users can contact each other in case a user has any questions to the seller or maybe to discuss sold item shipping.


![](https://github.com/DaRoTP/Auction_vue-node/blob/master/images/auction-ss.png?raw=true)

![](https://github.com/DaRoTP/Auction_vue-node/blob/master/images/chat-ss.png?raw=true)

### Application functionality:
* User authentication using cookies.
* Place item either for sale or auction.
* Auction managment.
* Live auction bidding.
* Live chat with other users.


### Run application

```sh
# install dependencies
npm install

# DEVELOPMENT
# run server
npm run dev
# run client
npm run serve

# PRODUCTION
# build client
npm run build
# run app
npm start
```

## Enviroment variables
*application requires an **.env** file which contains:*
### Server
> **DBURI**: *database URI* - **is required**
<br> **PORT**: *server port* - **default is 3000**
<br> **APP_SECRET**: *secret that will be used to encrypt passwords*
<br> **VUE_APP_API_URL**: 
  * **DEVELOPMENT**: *required*
  * **PRODUCTION**: *default is '/'*
 

## Used Technologies
### Backend
* [Node.js](https://nodejs.org) - pen-source, cross-platform JavaScript run-time environment for executing JavaScript code server-side.
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
* [Vue.js](https://vuejs.org/v2/guide/) - framework for building user interfaces.
* [SASS](https://sass-lang.com/) - used for styling HTML.
* [moment](https://momentjs.com/) - simple date formatter
* [axios](https://github.com/axios/axios) - Promise based HTTP client for the browser and node.js
* [vuex](https://vuex.vuejs.org/api/) - Vuex is a state management pattern + library for Vue.js applications.
* [vue-router](https://router.vuejs.org/) - Vue Router is the official router for Vue.js.
* [socket.io-client](https://www.npmjs.com/package/socket.io-client) - A standalone build of socket.io-client is exposed automatically by the socket.io server as /socket.io/socket.io.js.







