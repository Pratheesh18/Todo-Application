const {Sequelize} = require('sequelize');
const TodoModel  = require('../models/todo');

const sequelize = new Sequelize('sqlite::memory:', { logging: false });

module.exports = async () => {
    // Define the Todo model
    const Todo = TodoModel(sequelize);
  
    await sequelize.sync({ force: true });
  
    return { sequelize, Todo };
  };