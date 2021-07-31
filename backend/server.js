const express = require('express')
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const createError = require('http-errors');
const port = process.env.PORT || 3000;

require('dotenv').config();
require('./helpers/mongoose.init');


const authRoutes = require('./routes/auth.routes');
const ToDoRoutes = require('./routes/todo.routes');

const { vertifyAccessToken } = require('./helpers/jwt')

app.use(cors())
app.use(express.json())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.use('/auth', authRoutes)

app.use('/api/todos', vertifyAccessToken, ToDoRoutes);



app.use((req, res, next) => {
    next(createError(404, 'Not found'));
});

//Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))