import React from 'react';
import { List, Card, Button, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import './TodoList.css'; // Add custom CSS for layout

const TodoList = ({ todos, onComplete }) => {
  return (
    <div className="todo-list-container" style={{ marginTop: '24px' }}>
      {todos.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '16px', color: '#888' }}>
          No Todos yet!
        </p>
      ) : (
        todos.map((todo) => (
          <Card
            key={todo.id}
            hoverable
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              marginBottom: '16px',
              width: '100%',
              maxWidth: '400px' // Limit card width for better layout
            }}
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