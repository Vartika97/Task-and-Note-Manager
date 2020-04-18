var express = require('express');
const bodyParser = require('body-parser');
const sequelize =require('sequelize');
const db = new sequelize({
    dialect: 'sqlite',
    storage: __dirname + '/todoli.db',
});
var app = express();
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json({ type: 'application/json' }));

//Table Created 
const Todos = db.define('Todos', {
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
  //Notes to store notes
  const Notes = db.define('Notes', {
     id:{
      type:sequelize.INTEGER,
     primaryKey:true,
     autoIncrement:true
     },
     TaskId:{
         type:sequelize.INTEGER,
         references:{
             model:'Todos',
             key:'id'
         }
        },
    note:{
    type:sequelize.STRING,
       allowNull:false
    },
  }
    
  );
   db.sync()
  .then(() => {
    console.log('db works');
   

  })
  .catch((err) => {
    console.error(err)
  });

// 1.Get all the list
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

// 2.Get task Information of a task by Id
app.get('/todolistandnotes/:id',(req,res)=>
{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log("getit");
     Todos.findAll({where: 
      {
      id:req.params.id
      }
    }).then(function(todo)
    {
      if(todo)
      {
     Notes.findAll({where: 
        {
        TaskId:req.params.id
        }
        }).then(function(notes)
        {
          if(notes)
          {
            res.json({'task':todo,'notes':notes});
          }
          else{
            res.status(400).send('Error in insert new record')
          }
        })
      
      }
      else{
        res.status(400).send('Error in insert new record')
      }
    }
    )
 
});




//3.Get task Information of a Notes by TaskId
app.get('/todolistandnotes/:id/notes',(req,res)=>
{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log("g   etit");
     Notes.findAll({where: 
      {
      TaskId:req.params.id
      }
    }).then(function(notes)
    {
      res.json(notes);
    }
    )
 
});

//4.Store notes by Id
app.post('/todolist/:id/notes',(req,res)=>
{
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log("getit");
    var parameters = req.body;
    console.log(req.body.Notes);
     Notes.create(
        {
            TaskId:req.params.id,
            note:parameters.Notes,
        }
    ).then(function(notes)
    {
      if(notes)
      {
            res.json({msg:"Your Note is successfully stored"});
      }
      else
      {
        res.status(400).send('Error in insert new record')
      }
    });
});


//Store the task into database
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
            res.json({msg:"Your Task is successfully stored"});
      }
      else
      {
        res.status(400).send('Error in insert new record')
      }
    });
});


//To edit the Task attribute (Patch method was giving Cross Origin Error Even After Allowing Cross Origin...)
app.post('/todos/:id',function(req,res){
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);  
  const parameters= req.body;
 Todos.update (
    {
            Title:parameters.Title,
            Description:parameters.Description,
            DueDate:parameters.DueDate,
            Priority:parameters.Priority,
    },
    {where:{
       id:req.params.id
    }
  }
  ).then(function(todo)
  {
    if(todo)
    {
      
         parameters.notes.forEach(element => {
          console.log(element.id);
          Notes.update({
             note:element.note
           },
           {
            where:{
             id:element.id  
           }}).then(function(notes){
             if(!notes)
             res.status(400).send("Can not add after"+element.note)
           })
         });
         res.json({msg:"task edited successfully"})
    }
      else
      {
    res.status(400).send("can not edited please try again");
      }

 })
 });

 //Change the status of todo
 app.get('/todolist/status/:id/:status',(req,res)=>
{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log("getit");
    Todos.update(
      {status:req.params.status},
      {
      where: 
      {
      id:req.params.id
      }
    }).then(function(todo)
    {
      if(todo)
      res.json({msg:"successfully status changed"});
      else
      res.status(400).send('Error')
    }
    )
 
});

//delete completed 
app.get('/clear',(req,res)=>
{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 
  Todos.destroy({
    where:{status:"complete"}
  }).then(function(todo)
  {
    if(todo)
    {
      res.json({msg:"Successfully Deleted"});
    }
    else
    {
      res.status(400).send('Error')
    }
  })
});

//Delete Note by NoteId
app.get('/note/:id',(req,res)=>
{
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 
   Notes.destroy({
    where:{id:req.params.id}
  }).then(function(notes)
  {
    if(notes)
    {
      res.json({msg:"Successfully Deleted"});
    }
    else
    {
      res.status(400).send('Error')
    }
  })
});
app.listen(8080,"localhost",()=>{
    console.log("server is running");
});
