import React , {useEffect,useState} from 'react';
import {Layout,Typography,Form,Input,Button,message} from 'antd';
import {useForm,Controller} from 'react-hook-form';
import TodoList from './components/TodoList';
import axios from 'axios';


const {Header,Content} = Layout;
const {Title} = Typography;

const App = () => {
  const {control,handleSubmit,reset,formState:{errors}} = useForm({
    defaultValues:{
      title:'',
      description:''
    }
  });

  const [todos,setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  },[]);

  const fetchTodos = async (data) => {
    try{
      await axios.post('/api/todos',data);
      reset();
      message.success('Todo added successfully');
    }catch(err){
      message.error('Failed to add todos');
    }
  }

  const onSubmit = async (data) => {
    try{
      await axios.post('/api/todos',data);
      reset();
      fetchTodos();
      message.success('Todo added successfully');
    }catch(err){
      message.error('Failed to add todo');
    }
  };

  const handleCompleteTodo = async (id) => {
    try{
      await axios.put(`/api/todos/${id}/complete`);
      fetchTodos();
      message.success('Todo marked as completed');
    }catch(err){
      message.error('Failed to complete todo');
    }
  };

  return(
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ background: '#1890ff', textAlign: 'center', padding: '16px 0' }}>
        <Title level={2} style={{ color: '#fff', margin: 0 }}>
          To-Do List
        </Title>
      </Header>
      <Content style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        <Form
          onFinish={handleSubmit(onSubmit)}
          layout="vertical"
          style={{ background: '#fff', padding: '16px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
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
                <Input.TextArea {...field} rows={3} placeholder="Enter task description" />
              )}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Add todo
            </Button>
          </Form.Item>
        </Form>
        <TodoList todos={todos} onComplete={handleCompleteTodo} />
      </Content>
    </Layout>
  )

}