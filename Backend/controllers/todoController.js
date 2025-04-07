const Todo = require('../models/todo.js');


const createTodo = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  try {
    const  todo  = await Todo.create({ title, description });
    res.status(201).json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// Get 5 most recent incomplete todos
const getRecentTodos = async (req, res) => {
  try {
    const todos = await Todo.findAll({
      where: { isCompleted: false },
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'description', 'createdAt']
    });
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// Mark a todo as completed
const completeTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findByPk(id);
    if (!todo || todo.isCompleted) {
      return res.status(404).json({ error: 'Todo not found or already completed' });
    }

    todo.isCompleted = true;
    await todo.save();
    res.json({ message: 'Todo marked as completed' });
  } catch (error) {
    console.error('Error completing todo:', error);
    res.status(500).json({ error: 'Failed to complete todo' });
  }
};

module.exports = {
  createTodo,
  getRecentTodos,
  completeTodo
};