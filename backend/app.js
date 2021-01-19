const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGOURI } = require('./keys');
const app = express();

mongoose.connect(MONGOURI, {
    useUnifiedTopology:true,
    useFindAndModify:true,
    useNewUrlParser:true
})

mongoose.connection.on('connected', ()=> {
    console.log('Connection successful');
})

mongoose.connection.on('error', ()=> {
    console.log('Connection unsuccessful')
})

app.use(cors())

app.use(express.json());

app.use(require('./routes/auth'))
app.use(require('./routes/post'))

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> {
    console.log(`Server is running on the port ${PORT}`)
})