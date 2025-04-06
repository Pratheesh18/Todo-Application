import React, { useEffect, useState } from 'react';
import { Layout, Typography, Form, Input, Button, message, Modal } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import TodoList from './components/TodoList';
import axios from 'axios';

const { Header, Content } = Layout;
const { Title } = Typography;

const App = () => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: ''
    }
  });

  const [todos, setTodos] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal state

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (err) {
      message.error('Failed to fetch todos');
      console.error(err);
    }
  };

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:5000/api/todos', data);
      reset();
      fetchTodos();
      message.success('Todo added successfully');
      setIsModalVisible(false); // Close modal on success
    } catch (err) {
      message.error('Failed to add todo');
      console.error(err);
    }
  };

  const handleCompleteTodo = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}/complete`);
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
    reset(); // Reset form when closing
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#1890ff', textAlign: 'center', padding: '16px 0' }}>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          To-Do List
        </Title>
      </Header>
      <Content style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {/* Add Todo Button */}
        <Button
          type="primary"
          size="large"
          onClick={showModal}
          style={{ marginBottom: '24px' }}
        >
          Add Todo
        </Button>

        {/* Todo List */}
        <TodoList todos={todos} onComplete={handleCompleteTodo} />

        {/* Modal with Form */}
        <Modal
          title="Add New Todo"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null} // Custom footer via form submit button
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