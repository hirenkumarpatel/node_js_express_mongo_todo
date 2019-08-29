$(document).ready(() => {
  const todoList = $("#todo-list");
  const todoForm = $("#todo-form");
  const todoInput = $("#todo-input");

  //get todo list
  const getTodos = () => {
    fetch("/todos", { method: "get" })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        displayTodos(data);
      });
  };

  //triggegr getTodos method
  getTodos();


  //reset todo input
  const resetTodoInput = () => {
    todoInput.val("");
  };

  //buid IDs
  const buildIDs = todo => {

    return {
      editID: "edit_" + todo._id,
      deleteID: "delete_" + todo._id,
      listItemID: "listItem_" + todo._id,
      todoID: "todo_" + todo._id
    };
  };

  const buildTemplate = (todo, IDs) => {// retriving single json object in todo and array of ids created for all button and list item
    return `
    <li class="list-group-item" id="${IDs.listItemID}">
    <div class="row">
    <div class="col-md-8" id="${IDs.todoID}">${todo.todo}</div>
    <div class="col-md-4 text-right">
    <button type="button" class="btn btn-secondary" id="${IDs.editID}">Edit</button>
    <button type="button" class="btn btn-danger" id="${IDs.deleteID}">Delete</button>
    </div>
    </div>
    </li>
    `;
  };

  const displayTodos = data => {// getting json array of all data
    data.forEach(todo => { //seprate json object
      let ids = buildIDs(todo);
      todoList.append(buildTemplate(todo, ids));// sending single json object
      editTodo(todo,ids.todoID,ids.editID);
      deleteTodo(todo,ids.listItemID,ids.deleteID);
    });
  };

  //insert new data
  todoForm.submit(e => {
    
    e.preventDefault();// prevents form's default behaviour of submission 

    fetch("/", {
      method: "post",
      body: JSON.stringify({ todo: todoInput.val() }),
      headers: { "Content-Type": "application/json;charset = utf-8" }
    })
      .then(res => {
     
        return res.json();
      })
      .then(data => {
        
        if (data.result.ok == 1 && data.result.n == 1) {
          let ids = buildIDs(data.document);
          todoList.append(buildTemplate(data.document, ids));
          editTodo(todo,ids.todoID,ids.editID);
          deleteTodo(data.document,ids.listItemID,ids.deleteID);
          resetTodoInput();
        }
        
      });
  });

  //edit todo
  const editTodo=(todo,todoID,editID)=>{
    let editBtn=$(`#${editID}`);
    editBtn.click(()=>{

      fetch(`/${todo._id}`,
      {
        method:"PUT",
        headers:{'Content-Type':'application/json;charset=utf-8'},
        body:JSON.stringify({todo:todoInput.val()})
      }).then((res)=>{
        return res.json();
      }).then((data)=>{
        console.log(data);
        if(data.ok==1){// if successful
            let todoIndex=$(`#${todoID}`);//id of the list item to be changed - <li> id
            todoIndex.html(todoInput.val());
            
            resetTodoInput();

        }
      });
    });
  }

  //Delete todo
  const deleteTodo=(todo,listItemID,deleteID)=>{
    let deleteBtn=$(`#${deleteID}`);
    deleteBtn.click(()=>{
      fetch(`/${todo._id}`,
      {
        method:"delete",
      }).then((res)=>{
        return res.json();
      }).then((data)=>{
        if(data.ok==1){
          $(`#${listItemID}`).remove();
        }
      });
    });
  }
});
