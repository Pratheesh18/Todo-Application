import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TodoList from '../components/TodoList.jsx';

describe('TodoList Component', () => {
  it('should render "No Todos yet!" when the todos array is empty', () => {
    render(<TodoList todos={[]} onComplete={jest.fn()} />);
    expect(screen.getByText('No Todos yet!')).toBeInTheDocument();
  });

  it('should render a list of todos', () => {
    const todos = [
      { id: 1, title: 'Test Todo 1', description: 'Test Desc 1' },
      { id: 2, title: 'Test Todo 2', description: 'Test Desc 2' }
    ];
    render(<TodoList todos={todos} onComplete={jest.fn()} />);

    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Desc 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Test Desc 2')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /done/i })).toHaveLength(2);
  });

  it('should call onComplete when the Done button is clicked', () => {
    const onComplete = jest.fn();
    const todos = [
      { id: 1, title: 'Test Todo', description: 'Test Desc' }
    ];
    render(<TodoList todos={todos} onComplete={onComplete} />);

    const doneButton = screen.getByRole('button', { name: /done/i });
    fireEvent.click(doneButton);

    expect(onComplete).toHaveBeenCalledWith(1);
  });
});