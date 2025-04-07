import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { message } from 'antd';

describe('App Component', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.reset();
    jest.clearAllMocks();
  });

  it('should render the form and todo list', async () => {
    render(<App />);
    expect(screen.getByText('To-Do List')).toBeInTheDocument();
    expect(screen.getByText('Add Todo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should fetch todos on mount', async () => {
    const todos = [
      { id: 1, title: 'Test Todo', description: 'Test Desc', createdAt: new Date().toISOString() }
    ];
    mock.onGet('http://localhost:5000/api/todos').reply(200, todos);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
      expect(screen.getByText('Test Desc')).toBeInTheDocument();
    });
  });

  it('should show error message when fetching todos fails', async () => {
    mock.onGet('http://localhost:5000/api/todos').reply(500);

    render(<App />);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to fetch todos');
    });
  });

  it('should add a todo successfully', async () => {
    const newTodo = { id: 1, title: 'New Todo', description: 'New Desc', createdAt: new Date().toISOString() };
    mock.onPost('http://localhost:5000/api/todos').reply(201, newTodo);
    mock.onGet('http://localhost:5000/api/todos').reply(200, [newTodo]);

    render(<App />);

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByRole('button', { name: /ok/i }); // Modal "OK" button

    await userEvent.type(titleInput, 'New Todo');
    await userEvent.type(descriptionInput, 'New Desc');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith('Todo added successfully');
      expect(screen.getByText('New Todo')).toBeInTheDocument();
      expect(screen.getByText('New Desc')).toBeInTheDocument();
    });
  });

  it('should show error message when adding a todo fails', async () => {
    mock.onPost('http://localhost:5000/api/todos').reply(500);
    mock.onGet('http://localhost:5000/api/todos').reply(200, []);

    render(<App />);

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByRole('button', { name: /ok/i }); // Modal "OK" button

    await userEvent.type(titleInput, 'New Todo');
    await userEvent.type(descriptionInput, 'New Desc');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to add todo');
    });
  });

  it('should complete a todo successfully', async () => {
    const todos = [
      { id: 1, title: 'Test Todo', description: 'Test Desc', createdAt: new Date().toISOString() }
    ];
    mock.onGet('http://localhost:5000/api/todos').reply(200, todos);
    mock.onPut('http://localhost:5000/api/todos/1/complete').reply(200);
    mock.onGet('http://localhost:5000/api/todos').reply(200, []);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
    });

    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    await waitFor(() => {
      expect(message.success).toHaveBeenCalledWith('Todo marked as completed');
      expect(screen.queryByText('Test Todo')).not.toBeInTheDocument();
    });
  });

  it('should show error message when completing a todo fails', async () => {
    const todos = [
      { id: 1, title: 'Test Todo', description: 'Test Desc', createdAt: new Date().toISOString() }
    ];
    mock.onGet('http://localhost:5000/api/todos').reply(200, todos);
    mock.onPut('http://localhost:5000/api/todos/1/complete').reply(500);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Todo')).toBeInTheDocument();
    });

    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith('Failed to complete todo');
    });
  });

  it('should show validation errors when form is submitted without required fields', async () => {
    render(<App />);
    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    });

    const submitButton = screen.getByRole('button', { name: /ok/i }); // Modal "OK" button
    fireEvent.click(submitButton);

    await waitFor(() => {
      const titleError = screen.getByText('Please enter a title');
      const descriptionError = screen.getByText('Please enter a description');
      expect(titleError).toBeInTheDocument();
      expect(descriptionError).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should reset the form after successful submission', async () => {
    const newTodo = { id: 1, title: 'New Todo', description: 'New Desc', createdAt: new Date().toISOString() };
    mock.onPost('http://localhost:5000/api/todos').reply(201, newTodo);
    mock.onGet('http://localhost:5000/api/todos').reply(200, [newTodo]);

    render(<App />);

    const addButton = screen.getByRole('button', { name: /add/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    const submitButton = screen.getByRole('button', { name: /ok/i }); // Modal "OK" button

    await userEvent.type(titleInput, 'New Todo');
    await userEvent.type(descriptionInput, 'New Desc');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    }, { timeout: 2000 });
  });
});