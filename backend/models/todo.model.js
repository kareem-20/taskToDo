const mongoose = require("mongoose");


const todoSchema = mongoose.Schema({
    owner: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    desc: {
        type: String,
        require: true,
    },
    time: {
        type: Date,
    }
});

const ToDo = mongoose.model('todo', todoSchema);


module.exports = ToDo;