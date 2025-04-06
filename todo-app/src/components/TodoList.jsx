import React from 'react';
import { List, Card, Button, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import './TodoList.css';

const TodoList = ({ todos, onComplete }) => {
  return (
    <div className="todo-list-container">
      {todos.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#888', marginTop: '24px' }}>
          No Todos yet!
        </p>
      ) : (
        todos.map((todo) => (
          <Card
            key={todo.id}
            hoverable
            className="todo-card"
          >
            <List.Item
              actions={[
                <Button
                  type="link"
                  icon={<CheckCircleOutlined />}
                  onClick={() => onComplete(todo.id)}
                >
                  Done
                </Button>
              ]}
            >
              <List.Item.Meta
                title={<span style={{ fontWeight: 500 }}>{todo.title}</span>}
                description={
                  <>
                    <p>{todo.description}</p>
                    <Tag color="blue">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </Tag>
                  </>
                }
              />
            </List.Item>
          </Card>
        ))
      )}
    </div>
  );
};

export default TodoList;