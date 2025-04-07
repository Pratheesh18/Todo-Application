const express = require('express');
const {
  createTodo,
  getRecentTodos,
  completeTodo
} = require('../controllers/todoController.js');

const router = express.Router();

router.post('/', createTodo);
router.get('/', getRecentTodos);
router.put('/:id/complete', completeTodo);

module.exports = router;