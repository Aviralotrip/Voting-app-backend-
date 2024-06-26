const express = require('express')
const app = express();
const dbConnect = require('./lib/dbConnect');
require('dotenv').config();
dbConnect();
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

// Import the router files
const userRoute = require('./routes/userRoute');
const candidateRoute = require('./routes/candidateRoute');

// Use the routers
app.use('/user', userRoute);
app.use('/candidate', candidateRoute);


app.listen(PORT, ()=>{
    console.log('listening on port ' + PORT);
})