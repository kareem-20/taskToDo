const createHttpError = require("http-errors");
const ToDo = require("../models/todo.model");
const mongoose = require('mongoose');

module.exports = {
    addToDo: async (req, res, next) => {
        try {
            if (!req.body.title || !req.body.desc || !req.body.userId) {
                return createHttpError('body not exists')
            }

            const todo = await ToDo({
                owner: req.body.userId,
                title: req.body.title,
                desc: req.body.desc,
                time: Date.now(),
            });

            const result = await todo.save();
            res.json(result);
        } catch (error) {
            if (error.name === 'ValidationError') {
                next(createHttpError(422, error.message));
                return;
            }
            next(error)
        }
    }
    ,
    getToDos: async (req, res, next) => {
        try {
            // let limit = req.query.limit;
            let userId = req.params.userId
            const todos = await ToDo.find({ owner: userId });

            res.json(todos)

        } catch (error) {
            next(createHttpError(404, 'category Not Found'))
        }
    },
    updateToDo: async (req, res, next) => {
        try {
            let id = req.params.todoId;
            let data = {
                title: req.body.title,
                desc: req.body.desc,
                time: Date.now(),
            }
            const todoUpdated = await ToDo.findByIdAndUpdate(id, data, { new: true });
            const result = await todoUpdated.save();
            res.json(result);

        } catch (error) {
            next(createHttpError(404, 'Todo Not Found'))
        }
    },
    deleteTodo: async (req, res, next) => {
        let id = req.params.todoId;

        try {
            const result = await ToDo.findByIdAndDelete(id);

            res.json(result);

        } catch (error) {
            if (error instanceof mongoose.CastError) {
                next(createError(400, 'Invalid todo id'));
                return;
            }
            next(createHttpError(404, 'todo Not Found'))
        }
    }

}