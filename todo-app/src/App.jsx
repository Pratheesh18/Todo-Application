import React, { useEffect, useState } from 'react';
import { Layout, Typography, Form, Input, Button, message, Modal } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import TodoList from './components/TodoList.jsx';
import axios from 'axios';
import './App.css'; // Add custom CSS for button positioning

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: ''
    }
  });

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const [todos, setTodos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/todos`);
      setTodos(response.data);
    } catch (err) {
      message.error('Failed to fetch todos');
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post(`${API_URL}/todos`, data);
      reset();
      fetchTodos();
      message.success('Todo added successfully');
      setIsModalVisible(false);
    } catch (err) {
      message.error('Failed to add todo');
      console.error(err);
    }
  };

  const handleCompleteTodo = async (id) => {
    try {
      await axios.put(`${API_URL}/todos/${id}/complete`);
      fetchTodos();
      message.success('Todo marked as completed');
    } catch (err) {
      message.error('Failed to complete todo');
      console.error(err);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    reset();
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#1890ff', textAlign: 'center', padding: '16px 0' }}>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          To-Do List
        </Title>
      </Header>
      <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <div className="add-todo-button-container">
          <Button
            type="primary"
            size="large"
            onClick={showModal}
          >
            Add Todo
          </Button>
        </div>
        <TodoList todos={todos} onComplete={handleCompleteTodo} />
        <Modal
          title="Add New Todo"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            onFinish={handleSubmit(onSubmit)}
            layout="vertical"
          >
            <Form.Item
              label="Todo Title"
              validateStatus={errors.title ? 'error' : ''}
              help={errors.title?.message}
            >
              <Controller
                name="title"
                control={control}
                rules={{ required: 'Please enter a title' }}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter todo title" />
                )}
              />
            </Form.Item>
            <Form.Item
              label="Todo Description"
              validateStatus={errors.description ? 'error' : ''}
              help={errors.description?.message}
            >
              <Controller
                name="description"
                control={control}
                rules={{ required: 'Please enter a description' }}
                render={({ field }) => (
                  <Input.TextArea {...field} rows={3} placeholder="Enter todo description" />
                )}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
};

export default App;