const request = require('supertest');
const app = require('../../server');
const setupTestDB = require('../setup');

jest.mock('sequelize', () => {
  const actualSequelize = jest.requireActual('sequelize');
  return {
    ...actualSequelize,
    Sequelize: jest.fn().mockImplementation(() => ({
      sync: jest.fn(),
      close: jest.fn()
    }))
  };
});

describe('Todos API Integration Tests', () => {
  let sequelize, Todo;

  beforeAll(async () => {
    const db = await setupTestDB();
    sequelize = db.sequelize;
    Todo = db.Todo;
  });

  afterAll(async () => {
    await sequelize.close();
  });

  beforeEach(async () => {
    sequelize.sync.mockResolvedValue(); // Default success
    await sequelize.sync({ force: true });
  });

  it('should handle database sync failure', async () => {
    sequelize.sync.mockRejectedValue(new Error('Sync failed'));
    await expect(setupTestDB()).rejects.toThrow('Sync failed');
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Test Todo', description: 'Test Description' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('Test Todo');
      expect(response.body.description).toBe('Test Description');
      expect(response.body.isCompleted).toBe(false);
    });

    it('should return 400 if title or description is missing', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: '' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Title and description are required' });
    });

    it('should return 400 for invalid data types', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 123, description: true });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Title and description are required' });
    });
  });

  describe('GET /api/todos', () => {
    it('should return recent todos', async () => {
      await Todo.bulkCreate([
        { title: 'Todo 1', description: 'Desc 1', isCompleted: false },
        { title: 'Todo 2', description: 'Desc 2', isCompleted: false },
        { title: 'Todo 3', description: 'Desc 3', isCompleted: true }
      ]);

      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Todo 2');
    });

    it('should return empty array if no todos exist', async () => {
      const response = await request(app).get('/api/todos');
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('PUT /api/todos/:id/complete', () => {
    it('should mark a todo as completed', async () => {
      const todo = await Todo.create({ title: 'Test Todo', description: 'Test Desc', isCompleted: false });

      const response = await request(app).put(`/api/todos/${todo.id}/complete`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Todo marked as completed' });

      const updatedTodo = await Todo.findByPk(todo.id);
      expect(updatedTodo.isCompleted).toBe(true);
    });

    it('should return 404 if todo does not exist', async () => {
      const response = await request(app).put('/api/todos/999/complete');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Todo not found or already completed' });
    });

    it('should return 404 for invalid ID format', async () => {
      const response = await request(app).put('/api/todos/invalid-id/complete');
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Todo not found or already completed' });
    });
  });
});