const express = require('express');
const router = express.Router();
const toDoCtrl = require('../controllers/todo.controller')

router.post('/add', toDoCtrl.addToDo);

router.get('/:userId', toDoCtrl.getToDos);

router.patch('/update/:todoId', toDoCtrl.updateToDo);

router.delete('/delete/:todoId', toDoCtrl.deleteTodo)

module.exports = router;