//TaskMapper App variable intialization
window.onload = () => {
  const taskList = document.querySelector("#task-list");
  const taskForm = document.querySelector("#task-form");
  const taskInputBox = document.querySelector("#task-input-box");
  const taskAlert = document.querySelector("#task-alert-box");
  const taskMessage = document.querySelector("#alert-message");
  const alertIcon = document.querySelector("#alert-icon");
  const alertCloseButton = document.querySelector("#alert-close-button");

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
        console.log(JSON.stringify(data));
        displayTasks(data);
      });
  };

  //init first method to load tasks data
  loadTasks();

  //generic method to create and display tasks list
  let displayTasks = tasksArray => {
    tasksArray.forEach(task => {
      //retrived task Object
      console.log(JSON.stringify(task));
      //calling generateElementIDs with task_id object value
      let IDList = generateElementIDs(task._id);
      console.log(IDList);
      //calling createTaskTemplate with IDlist Array and Task's todo value
      createTaskTemplate(IDList, task.todo);
    });
  };

  //generated ids for li element,edit and delete button to process further click events
  let generateElementIDs = id => {
    return {
      taskId: id,
      editId: "edit-" + id,
      deleteId: "delete-" + id
    };
  };

  //create task list item template by creating html elements and proving ids and values
  let createTaskTemplate = (IDList, data) => {
    //creating <li> element;
    let li = document.createElement("li");
    //set attributes
    li.setAttribute("id", IDList.taskId);
    li.setAttribute("class", "task-list-item");
    //set other elements inside <li> element
    li.innerHTML = `
            <span>
              <i class="ion-md-checkmark-circle-outline title-color"></i>
              ${data}
            </span>
            <div class="action-links">
              <button class="button-link btn-edit" id="${IDList.editId}">
                <i class="ion-md-create primary"></i>
              </button>
              <button class="button-link btn-save" id="${IDList.editId}">
                <i class="ion-md-done-all success"></i>
              </button>
              <button class="button-link">
                <i class="ion-md-remove-circle-outline danger" id="${IDList.deleteId}"></i>
              </button>
            </div>`;
    //appending new task <li> to <ul> tasklist
    taskList.appendChild(li);
  };

  //create the new task
  //taskForm.submit((event)=>{

    //preventing default form submission behaviour
    // event.preventDefault();
    // console.log("data submitted");
    // //fetching url with header information
    // fetch('/',{
    //   method: "post",
    //   body: JSON.stringify({ todo: taskInputBox.val(),date:new Date() }),
    //   headers: { "Content-Type": "application/json;charset = utf-8" }
    // }).then(res=>{
    //   return res.json();
    // }).then(data=>{
    //   console.log(`respons after insertion:${JSON.stringify(data)}`);
    // });
  //});
  
  //end of windos onload function
};
