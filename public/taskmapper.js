//TaskMapper App variable intialization
window.onload = () => {
  const taskList = document.querySelector("#task-list");
  const taskForm = document.querySelector("#task-form");
  const taskInputBox = document.querySelector("#task-input-box");
  const taskInputButton = document.querySelector("#task-input-button");
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
        // console.log(JSON.stringify(data));
        displayTasks(data);
      });
  };

  //init first method to load tasks data
  loadTasks();

  //generic method to create and display tasks list
  let displayTasks = tasksArray => {
    
    if (tasksArray.length > 1) {
      tasksArray.forEach(task => {
        //calling generateElementIDs with task_id object value
        let IDList = generateElementIDs(task._id);
        //calling createTaskTemplate with IDlist Array and Task's todo value
        createTaskTemplate(IDList, task.todo);
      });
    } else {
      //calling generateElementIDs with task_id object value
      let IDList = generateElementIDs(tasksArray._id);
      //calling createTaskTemplate with IDlist Array and Task's todo value
      createTaskTemplate(IDList, tasksArray.todo);
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

  //***************************************** */ temporary data
  taskInputButton.addEventListener("click", () => {
    fetch("/", {
      method: "POST",
      body: JSON.stringify({ todo: taskInputBox.value }),
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
            //clear input field
            clearForm();
          }
        } //main if ends
        console.log(`${JSON.stringify(data)}`);
      });
  });

  //clear input field
  let clearForm = () => {
    taskInputBox.value = "";
  };
  //end of windos onload function
};
