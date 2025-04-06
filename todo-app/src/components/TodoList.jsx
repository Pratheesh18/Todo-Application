import React from 'react';
import {List,Card,Button,Tag,Row,Col} from 'antd';
import {CheckCircleOutlined} from '@ant-design/icons';


const TodoList = ({todos,onComplete}) => {
    return(
        <Row gutter={[16,16]} style={{marginTop:'24px'}}>
            {todos.length === 0 ? (
                <Col span={24}>
                    <p style={{textAlign:'center',fontSize:'16px',color:'#888'}}>
                        No Todos yet!
                    </p>
                </Col>
            ):(
                todos.map((todo) => (
                    <Col xs={24} sm={12} md={8} key={todo.id}>
                        <Card hoverable style={{borderRadius:'8px',boxShadow:'0 2px 8px rgba(0,0,0,0.1)'}}>
                            <List.Item actions={[
                                <Button type='link' icon={<CheckCircleOutlined/>} onClick={() => onComplete(todo.id)}>
                                    Done
                                </Button>
                            ]}
                            >
                                <List.Item.Meta title={<span style={{fontWeight:500}}> {todo.title} </span>}
                                description ={
                                    <>
                                       <p> {todo.description} </p>
                                       <Tag color='blue'>
                                        {new Date(todo.createdAt).toLocaleDateString()}
                                       </Tag>
                                    </>
                                }
                                />
                            </List.Item>
                        </Card>
                    </Col>
                ))
            )}
        </Row>
    )
};

export default TodoList;