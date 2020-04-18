//html date default value
// Get All the Task when Load
function gettodo()
{
$.get("http://127.0.0.1:8080/todolist/",function(data,status,xhr) {
   data.forEach(element => {
       
       if(element.status=="Incomplete")
       {
          
    $("#ulTasks").append(
    "<tr class='row' style='display:'inline-table; id='nondeleted''><td class='col-1' style='cursor:pointer'  onclick='edit(event)' data-id='"+element.id+"' >"+element.Title+"</td><td class='col-2' style='display:none;'>"+(element.DueDate).slice(0, 10)+"</td><td class='col-3' style='display:none;'>"+element.Priority+"</td><td class='col-9'><td><a  role='button' style='margin-left:10%; cursor: pointer;'  onclick='addNotes(event)'data-id='"+element.id+"'><i class='material-icons' data-id='"+element.id+"'>add</i></a></td><td><a  role='button' style='margin-left:10%; cursor: pointer;' onclick='status(event)'><i class='material-icons' data-id='"+element.id+"'><li style='display:none;'>"+element.status+"</li>&#xE872;</i></a></td></tr>"
    );
       }
       else
       {   
        $("#ulTasks").append(
            "<tr class='row' id='delete' style='display:'inline-table;'><td class='col-1 'style='text-decoration: line-through;' data-id='"+element.id+"' >"+element.Title+"</td><td class='col-2' style='display:none;'>"+(element.DueDate).slice(0, 10)+"</td><td class='col-3' style='display:none;'>"+element.Priority+"</td><td class='col-9'><td><a  role='button' style='margin-left:10%; cursor: pointer;' data-id='"+element.id+"'><i class='material-icons' data-id='"+element.id+"'>add</i></a></td><td><a  role='button' style='margin-left:10%; cursor:pointer;' onclick='status(event)'><i class='material-icons' data-id='"+element.id+"'><li style='display:none;'>"+element.status+"</li>&#xE872;</i></a></td></tr>"
          
         ) }  
   });

}).fail(function(jqxhr, settings, ex)
{
alert("error"+ex);
});
}

//Update the task in DB
$(document).ready(function(){
    $("#edittask").click(function(){
     alert("ente")
    const id = document.getElementById("dataid").value;    
    const titlevalue=document.getElementById("titlename").value;
    const desvalue=document.getElementById("textarea").value;
    const datvalue=document.getElementById("editeddate").value;
    const priorityvalue =document.getElementById("Priority").value;
    let notes=[];
    var i=0;
     var val=document.querySelectorAll('#unique');
     val.forEach(element=>{
       notes[i]={
         id: element.getAttribute('data-id'),
         note:element.value
       }
       console.log(notes[i].id+"  "+notes[i].note);
       i++
     })

     alert("ready");
   $.post("http://127.0.0.1:8080/todos/"+id,{Title:titlevalue,Description:desvalue,DueDate:datvalue,Priority:priorityvalue,notes:notes},function(data,status,xhr) {
    
   alert(data.msg)

}).fail(function(jqxhr, settings, ex)
{
console.log("error");
alert("error"+ex);
});

   
});
});

//Implementation of Post Method To add task in the database
$(document).ready(function(){
    $("#addtask").click(function(){
   
   const titlevalue=document.getElementById("title").value;
   const desvalue=document.getElementById("Description").value;
   const datvalue=document.getElementById("due-date").value;
   const priorityvalue =document.getElementById("priority").value;
    

    $.post("http://127.0.0.1:8080/todolist",{Title:titlevalue,Description:desvalue,DueDate:datvalue,Priority:priorityvalue,status:"Incomplete"},function(data,status,xhr) {
                             console.log("output");            
			
        }).fail(function(jqxhr, settings, ex)
        {
            console.log("error");
           alert("error"+ex);
        });
});
});

function deletedata()
{
     $.get("http://127.0.0.1:8080/clear",function(data,status,xhr) {
        console.log("output");            

}).fail(function(jqxhr, settings, ex)
 {
    console.log("error");
   alert("error"+ex);
});
}

//Change the Status of the Task
function status(e)
{
   const id= $(e.target).attr('data-id');
   let status =$(e.target).children('li').text();
   if(status=="Incomplete")
   status="complete";
   else
   status="Incomplete";
   $.get("http://127.0.0.1:8080/todolist/status/"+id+"/"+status,function(data,status,xhr) {
    console.log(data.msg);
}).fail(function(jqxhr, settings, ex)
{
alert("error"+ex);
});   
}

// Functions For PopUp Forms
function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
function openForm()
{
    document.getElementById("myForm").style.display = "block";
}
function display()
{
    document.getElementById("sidebar-container").style.display = "none";

}


//Function to add new note Form 
function addNotes(e)
{
   let id=$(e.target).attr('data-id');
    var btn = document.getElementById("editnotes");
    btn.setAttribute("data-id",id);
    document.getElementById("popupnote").style.marginLeft="30%"
   document.getElementById("popupnote").style.display="block";
}
//end of pop up forms


// fuction to Store the Notes in the Database
function StoreNote(e)
{
    let  note =document.getElementById("addtextarea");
    $.post("http://127.0.0.1:8080/todolist/"+$(e.target).attr('data-id')+"/notes",{Notes:note.value.trim()},function(data,status,xhr) {
                             console.log("output");
                             window.alert(data.msg);           
			
        }).fail(function(jqxhr, settings, ex)
        {
            console.log("error");
           alert("error"+ex);
        });
   

}

//Function to Show PopUp form to Edit the Task Attributes
function edit(e) 
{
    $.get("http://127.0.0.1:8080/todolistandnotes/"+$(e.target).attr('data-id'),function(data,status,xhr) {
    document.getElementById("titlename").innerHTML=data.task[0].Title;
    document.getElementById("titlename").value=data.task[0].Title;
    document.getElementById("dataid").value=data.task[0].id;
    document.querySelector('#textarea').value=data.task[0].Description;  
    document.getElementById("editeddate").value=data.task[0].DueDate.slice(0, 10);
    document.getElementById(data.task[0].Priority).selected = "true";
    var array=data.notes;
    var i=1;
    $(".notes").empty();
    array.forEach(element => {
    $(".notes").append("<div id='area'><h4 style='margin-top:15px'>Note "+i+":</h4><textarea class='form-control form-rounded' id='unique' style='margin-bottom:20px' data-id='"+element.id+" rows='3'>"+element.note+"</textarea><div class='controls' style='text-align:center'><button type='button' class=btn btn-danger data-id='"+element.id+"'  onclick='deleteNote(event)'>&times;</button></div><div>");
     i++;
});
    
}).fail(function(jqxhr, settings, ex)

{
alert("error"+ex);
});
console.log($(e.target));

    document.getElementById("mySidebar").style.width="60%";    
    document.getElementById("mySidebar").style.display = "block";
  }
  //to hide popUp
  function w3_close() {
    document.getElementById("mySidebar").style.display = "none";
  }

  //Table sort
  //By Status 
  function sortTablebyStatus(order){
    console.log("enter");
  var rows = $('#ulTasks').children('tbody').children('tr');
  console.log(rows.length);
  rows.sort(function(a, b) {
  var A = $(a).attr('id');
  var B = $(b).attr('id');
  if(A < B) {
    return order;
  }
  if(A > B) {
    return -order;
  } 
  return 0;
  });

  $.each(rows, function(index, row) {
    $('#ulTasks').children('tbody').append(row);
  });

}

//By Priority
  function sortTablebyPriority(order){
  var rows = $('#ulTasks').children('tbody').children('tr');
  var array={'High':2,'Medium':1,'Low':0};
  console.log(rows.length);
  rows.sort(function(a, b) {
   var A = $(a).children('td').eq(2).text();
   // console.log(array[A],A)
   var B = $(b).children('td').eq(2).text();
   //console.log(array[B],B)
  if(array[A] < array[B]) {
    return order;
  }
  if(array[A] > array[B]) {
    return -order;
  } 
  return 0;
  });
  $.each(rows, function(index, row) {
    $('#ulTasks').children('tbody').append(row);
  });

}

//by Date
function sortTablebyDate(order){
    console.log("enter");
  var rows = $('#ulTasks').children('tbody').children('tr');
  console.log(rows.length);
  rows.sort(function(a, b) {
  var A = $(a).children('td').eq(1).text();
  console.log(A)
  var B = $(b).children('td').eq(1).text();
console.log(B)
  if(A < B) {
    return order;
  }
  if(A > B) {
    return -order;
  } 
  return 0;
  });

  $.each(rows, function(index, row) {
      console.log(row);
    $('#ulTasks').children('tbody').append(row);
  });
}

// Delete Note by its ID

function deleteNote(e)
{
  $.get("http://127.0.0.1:8080/note/"+$(e.target).attr('data-id'),function(data,status,xhr) {
      console.log(data.msg);
}).fail(function(jqxhr, settings, ex)
{
alert("error"+ex);
});

}

// Sort function to call above sort method according to asc/desc order
 function addsort(e,name)
 {
   $('.sort').empty();
    $('.sort').append("<lable><button class='btn btn-secondary' onclick='"+name+"(1)'>up</button> <button class='btn btn-secondary'style='margin-right:3px' onclick='"+name+"(-1)'>down</button>"+$(e.target).text()+"</lable>");

 }

 