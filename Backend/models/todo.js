const {DataTypes}  = require('sequelize');
const sequelize = require('../database/db');


const Todo = sequelize.define('Todo',{
    id:{
        type : DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    title:{
        type:DataTypes.STRING(255),
        allowNull:false
    },
    description : {
        type:DataTypes.TEXT,
        allowNull:false
    },
    isCompleted:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
        field:'is_completed'
    },
    createdAt:{
        type:DataTypes.DATE,
        defaultValue:DataTypes.NOW,
        field:'created_at'
    }
},{
    tableName:'todo',
    timestamps:false
});


(async () => {
    await Todo.sync({ force: false }); 
  })();
  
  module.exports = Todo;