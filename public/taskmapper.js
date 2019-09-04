

//TaskMapper App variable intialization with Jquery
$(() => {
  //jQuery Method of intialization
  const taskList = $("#task-list");
  const taskInputBox = $("#task-input-box");
  const taskInputButton = $("#task-input-button");
  const taskAlert = $("#task-alert-box");
  const alertCloseButton = $("#alert-close-button");
  taskAlert.hide();

  /**
   * Load Tasks
   * Desc: creating method by using fetch() method that can load localhost:3000/tasks url
   * @return json array object with tasks
   */

  let loadTasks = () => {
    fetch("/tasks")
      .then(res => {
        return res.json();
      })
      .then(data => {
        displayTasks(data);
      });
  };

  //init first method to load tasks data
  loadTasks();

  //generic method to create and display tasks list
  let displayTasks = tasksArray => {
    let IDList;
    if (tasksArray.length > 1) {
      tasksArray.forEach(task => {
        //calling generateElementIDs with task_id object value
        IDList = generateElementIDs(task._id);
        //calling createTaskTemplate with IDlist Array and Task's todo value
        createTaskTemplate(IDList, task.todo);
        editTask(IDList.taskId,IDList.editId);
        deleteTask(IDList.taskId,IDList.deleteId);

      });
    } else {
      //calling generateElementIDs with task_id object value
      IDList = generateElementIDs(tasksArray._id);
      //calling createTaskTemplate with IDlist Array and Task's todo value
      createTaskTemplate(IDList, tasksArray.todo);
      editTask(IDList.taskId,IDList.editId);
      deleteTask(IDList.taskId,IDList.deleteId);
    }
    
    
  };

  //generated ids for li element,edit and delete button to process further click events
  let generateElementIDs = id => {
    return {
      taskId: id,
      editId: "edit-" + id,
      deleteId: "delete-" + id
    };
  };

  

  /**
   * create task list item template by creating html elements
   * params: Array of IDs  and task data
   * */
  let createTaskTemplate = (IDList, data) => {
    //creating <li> element;
    let li = $('<li/>').attr("id", IDList.taskId).attr("class", "task-list-item").html(`
            <p>
              <i class="ion-md-checkmark-circle-outline title-color"></i>
              <span>${data}</span>
            </p>
            <div class="action-links">
              <button class="button-link btn-edit"  id="${IDList.editId}">
                <i class="ion-md-create primary"></i>
              </button>
              <button class="button-link btn-save" id="${IDList.editId}">
                <i class="ion-md-done-all success"></i>
              </button>
              <button class="button-link">
                <i class="ion-md-remove-circle-outline danger" id="${IDList.deleteId}"></i>
              </button>
            </div>`);
    //appending new task <li> to <ul> tasklist
    taskList.append(li);
  };

  //create template that update value in tasklist
  let updateTaskTemplate=(taskId,data)=>{
    let newTaskItem=$(`#${taskId}>p span`);
    newTaskItem.html(data);
  }
  //Delete Task Template
  let deleteTaskTemplate=(taskId)=>{
    //remove task Element
    let taskItem=$(`#${taskId}`);
    taskItem.remove();
  }

  /** Insert new Task to the task list
   * event occurs on taskinout button's click event
   */
  taskInputButton.on("click", () => {
    fetch("/", {
      method: "POST",
      body: JSON.stringify({ todo: taskInputBox.val()}),
      headers: { "Content-Type": "application/json;charset = utf-8" }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (!data.error) {
          if (data.result.ok === 1 && data.result.n === 1) {
            //create new task element by passing document json object from returned respose
            displayTasks(data.document);
            //shown operation status
            showStatus(true,data.message); 
            //clear input field
            clearForm();
            
          }
        }
        else{
          showStatus(false,data.error.message);
          clearForm();
        }
        console.log(`${JSON.stringify(data)}`);
      });
  });// end of insert task method
 
  /** 
   * Edit task Item value 
   * @param taskId task object id
   * */
 let editTask=(taskId,editId)=>{
   console.log(`taskId:${taskId}..`);
  //calling jquery delegate method to add event on dynamic elements
  $(document).on("click",`#${editId}`,()=>{ 
   
    //check if data is empty
    let taskData=(taskInputBox.val()!=='')? taskInputBox.val():'';
    //javascript's fetch method use to load url and header info withour form
    fetch(`/${taskId}`,{
        method:'PUT',
        body:JSON.stringify({todo:taskData}),
        headers: { "Content-Type": "application/json;charset=utf-8" }
      }).then((res)=>{
        return res.json()
      }).then((data)=>{
        console.log(JSON.stringify(data));
        if(data.result.ok==1){
          //update the task front end side on the fly 
          let newData=taskInputBox.val();
          updateTaskTemplate(taskId,newData);
          //show message
          showStatus(true,data.message);
          //clear Form
          clearForm();

        }
        else{
          showStatus(false,data.error.message);
          clearForm();
        }
      });
  });
}//edit task ends

/** 
   * Delete task Item value 
   * @param taskId task object id
   * */
  let deleteTask=(taskId,deleteId)=>{
    //calling jquery delegate method to add event on dynamic elements
   $(document).on("click",`#${deleteId}`,()=>{ 
     //javascript's fetch method use to load url and header info withour form
     fetch(`/${taskId}`,{
         method:'DELETE'
        }).then((res)=>{
         return res.json()
       }).then((data)=>{
         console.log(JSON.stringify(data));
         if(data.result.ok==1){
           //delete the task front end side on the fly 
           deleteTaskTemplate(taskId);
           //show message
           showStatus(true,data.message);
          }
         else{
           showStatus(false,data.error.message);
          }
      });
   });
  }//delete task ends
  
 
  //clear input field
  let clearForm = () => {
    taskInputBox.val('');
  };

  
/******** show CRUD Operation status by alert message **********
 * show error message after all insert update delte operation or Error
*/
let showStatus=(status,message)=>{
  
  if(status){
    //if opration successful
    taskAlert.attr('class','alert alert-success')
    .html(`
    <span><i class="ion-md-checkmark-circle"></i>${message}</span>
    <button class="button-link" id="alert-close-button"><i class="ion-md-close-circle light"></i>
    </button>`);
  }
  else{
    //if operation fails
    taskAlert.attr('class','alert alert-danger')
    .html(`
    <span><i class="ion-md-alert"></i>${message}</span>
    <button class="button-link" id="alert-close-button"><i class="ion-md-close-circle light"></i>
    </button>`);
    
  }
  taskAlert.show();//display:flex
};


  
  //end of windos onload function
});
