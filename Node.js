var express = require('express');
const bodyParser = require('body-parser');
const sequelize =require('sequelize');
const db = new sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/todoli.db',
});
var app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
const Todos = db.define('Todo', {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Title:{
      type: sequelize.STRING(40),
      allowNull: false,
    },
    Description: {
        type: sequelize.STRING(1000),
        allowNull: true,
      },
    DueDate: {
      type: sequelize.DATE,   
      allowNull:false
    },
    Priority:{
        type:sequelize.STRING(10),
        allowNull:false
    },
    status:{
      type:sequelize.STRING(20),
      allowNull:false
    },
  });
  const Notes = db.define('Note', {
     id:{
      type:sequelize.INTEGER,
     primaryKey:true,
     autoIncrement:true
     },
     TaskId:{
         type:sequelize.INTEGER,
         references:{
             model:'Todo',
             key:'íd'
         },
    Notes:{
    type:sequelize.STRING,
       allowNull:false
    }    
     }
    
  });
   db.sync()
  .then(() => {
    console.log('db works');
    const task=Todos.findAll().then(function(user)
    {
      console.log(user[0].id);
    })
    

  })
  .catch((err) => {
    console.error(err)
  });

app.get('/todolist',(req,res)=>
{
 
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log("getit");
    Todos.findAll().then(function(todo)
    {
      res.json(todo);
    }
    )
 
});


app.post('/todolist',(req,res)=>
{
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log("getit");
    var parameters = req.body;
    console.log(req.body);
    Todos.create(
        {
            Title:parameters.Title,
            Description:parameters.Description,
            DueDate:parameters.DueDate,
            Priority:parameters.Priority,
            status:parameters.status
        }
    ).then(function(Todos)
    {
      if(Todos)
      {
            //  if(parameters.Notes!=null)
            //  {
            //      Notes.create(
            //          {
            //              TaskId:users.id,
            //              Notes:parameters.Notes
            //          }
                //  ).then(function(Notes)
                //  {
                //    if(Notes)
                //    {
                //        res.send("done");
                //    }  
                //    else
                //    {
                //        res.send("err");
                //    }
                //  })
            // }
            res.send("okay");
      }
      else
      {
        res.status(400).send('Error in insert new record')
      }
    });
});

app.listen(8080,"localhost",()=>{
    console.log("server is running");
});
