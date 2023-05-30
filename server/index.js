const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000
const schema = require('./schema/schema');


app.use("/graphql",graphqlHTTP({
    schema: schema,
    graphiql: process.env.NODE_ENV === 'development' ? true : false
}))
app.listen(port, function(){
    console.log('listening on port ' + port);
})