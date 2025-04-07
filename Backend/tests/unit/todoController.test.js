const { createTodo, getRecentTodos, completeTodo } = require('../../controllers/todoController');


const TodoMock = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn()
};

describe('Todo Controller Unit Tests', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTodo', () => {
    it('should return 400 if title or description is missing', async () => {
      req.body = { title: '' };
      await createTodo(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Title and description are required' });
    });

    it('should create a todo successfully', async () => {
      req.body = { title: 'Test Todo', description: 'Test Description' };
      const newTodo = { id: 1, title: 'Test Todo', description: 'Test Description' };
      TodoMock.create.mockResolvedValue(newTodo);

      jest.spyOn(require('../../models/todo'), 'create').mockImplementation(() => TodoMock.create());

      await createTodo(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newTodo);
    });

    it('should handle errors during creation', async () => {
      req.body = { title: 'Test Todo', description: 'Test Description' };
      TodoMock.create.mockRejectedValue(new Error('Database error'));

      jest.spyOn(require('../../models/todo'), 'create').mockImplementation(() => TodoMock.create());

      await createTodo(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create todo' });
      expect(console.error).toHaveBeenCalledWith('Error creating todo:', expect.any(Error));
    });
  });

  describe('getRecentTodos', () => {
    it('should return recent todos', async () => {
      const todos = [
        { id: 1, title: 'Todo 1', description: 'Desc 1', createdAt: new Date() }
      ];
      TodoMock.findAll.mockResolvedValue(todos);

      jest.spyOn(require('../../models/todo'), 'findAll').mockImplementation(() => TodoMock.findAll());

      await getRecentTodos(req, res);
      expect(res.json).toHaveBeenCalledWith(todos);
    });

    it('should limit to 5 recent todos', async () => {
      const todos = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        title: `Todo ${i + 1}`,
        description: `Desc ${i + 1}`,
        createdAt: new Date(),
        isCompleted: false
      }));
      TodoMock.findAll.mockResolvedValue(todos.slice(0, 5));

      jest.spyOn(require('../../models/todo'), 'findAll').mockImplementation(() => TodoMock.findAll());

      await getRecentTodos(req, res);
      expect(res.json).toHaveBeenCalledWith(todos.slice(0, 5));
      expect(TodoMock.findAll).toHaveBeenCalledWith({
        where: { isCompleted: false },
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'title', 'description', 'createdAt']
      });
    });

    it('should handle errors when fetching todos', async () => {
      TodoMock.findAll.mockRejectedValue(new Error('Database error'));

      jest.spyOn(require('../../models/todo'), 'findAll').mockImplementation(() => TodoMock.findAll());

      await getRecentTodos(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch todos' });
      expect(console.error).toHaveBeenCalledWith('Error fetching todos:', expect.any(Error));
    });
  });

  describe('completeTodo', () => {
    it('should return 404 if todo is not found', async () => {
      req.params = { id: '1' };
      TodoMock.findByPk.mockResolvedValue(null);

      jest.spyOn(require('../../models/todo'), 'findByPk').mockImplementation(() => TodoMock.findByPk());

      await completeTodo(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Todo not found or already completed' });
    });

    it('should return 404 if todo is already completed', async () => {
      req.params = { id: '1' };
      const todo = {
        id: 1,
        isCompleted: true
      };
      TodoMock.findByPk.mockResolvedValue(todo);

      jest.spyOn(require('../../models/todo'), 'findByPk').mockImplementation(() => TodoMock.findByPk());

      await completeTodo(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Todo not found or already completed' });
    });

    it('should mark a todo as completed', async () => {
      req.params = { id: '1' };
      const todo = {
        id: 1,
        isCompleted: false,
        save: jest.fn().mockResolvedValue(true)
      };
      TodoMock.findByPk.mockResolvedValue(todo);

      jest.spyOn(require('../../models/todo'), 'findByPk').mockImplementation(() => TodoMock.findByPk());

      await completeTodo(req, res);
      expect(todo.isCompleted).toBe(true);
      expect(todo.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Todo marked as completed' });
    });

    it('should handle errors when completing a todo', async () => {
      req.params = { id: '1' };
      TodoMock.findByPk.mockRejectedValue(new Error('Database error'));

      jest.spyOn(require('../../models/todo'), 'findByPk').mockImplementation(() => TodoMock.findByPk());

      await completeTodo(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to complete todo' });
      expect(console.error).toHaveBeenCalledWith('Error completing todo:', expect.any(Error));
    });
  });
});