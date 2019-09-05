//TaskMapper App variable intialization with Jquery
$(() => {
  //jQuery Method of intialization
  const taskList = $("#task-list");
  const taskInputBox = $("#task-input-box");
  const taskInputButton = $("#task-input-button");
  const taskAlert = $("#task-alert-box");
  let updatedTextId;
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
    let IDList, data;
    if (tasksArray.length > 1) {
      tasksArray.forEach(task => {
        data = task.todo;
        //calling generateElementIDs with task_id object value
        IDList = generateElementIDs(task._id);
        //calling createTaskTemplate with IDlist Array and Task's todo value
        createTaskTemplate(IDList, task.todo);
        // changing UI of task list to task text to be updated later
        createEditTaskTemplate(IDList.taskId, IDList.uiId, data);
        //save edited task on the textbox besides
        editTask(IDList.taskId, IDList.editId);
        //delete task
        deleteTask(IDList.taskId, IDList.deleteId);
      });
    } else {
      data = tasksArray.todo;
      //calling generateElementIDs with task_id object value
      IDList = generateElementIDs(tasksArray._id);
      //calling createTaskTemplate with IDlist Array and Task's todo value
      createTaskTemplate(IDList, tasksArray.todo);
      // changing UI of task list to task text to be updated later
      createEditTaskTemplate(IDList.taskId, IDList.uiId, data);
      //save edited task on the textbox besides
      editTask(IDList.taskId, IDList.editId);
      //Delete Task
      deleteTask(IDList.taskId, IDList.deleteId);
    }
  };

  //generated ids for li element,edit and delete button to process further click events
  let generateElementIDs = id => {
    return {
      taskId: id,
      uiId: "ui-" + id,
      deleteId: "delete-" + id,
      editId: "edit-" + id
    };
  };

  /**
   * create task list item template by creating html elements
   * params: Array of IDs  and task data
   * */
  let createTaskTemplate = (IDList, data) => {
    //creating <li> element;
    let li = $("<li/>")
      .attr("id", IDList.taskId)
      .attr("class", "task-list-item").html(`
            <p>
              <i class="ion-md-checkmark-circle-outline title-color"></i>
              <span>${data}</span>
            </p>
            <div class="action-links">
              <button class="button-link btn-ui"  id="${IDList.uiId}">
                <i class="ion-md-create primary"></i>
              </button>
              <button class="button-link btn-edit" id="${IDList.editId}">
                <i class="ion-md-done-all success"></i>
              </button>
              <button class="button-link" id="${IDList.deleteId}">
                <i class="ion-md-remove-circle-outline danger" ></i>
              </button>
            </div>`);

    //appending new task <li> to <ul> tasklist
    taskList.append(li);
  };

  //create template that update value in tasklist after successful update process
  let updateTaskTemplate = (taskId, data) => {
    let newTaskItem = $(`#${taskId}>p span`);
    newTaskItem.html(data);
  };
  //Delete Task Template
  let deleteTaskTemplate = taskId => {
    //remove task Element
    let taskItem = $(`#${taskId}`);
    taskItem.remove();
  };

  /** Insert new Task to the task list
   * event occurs on taskinout button's click event
   */
  taskInputButton.on("click", () => {
    fetch("/", {
      method: "POST",
      body: JSON.stringify({ todo: taskInputBox.val() }),
      headers: { "Content-Type": "application/json;charset = utf-8" }
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (!data.error) {
          if (!data.error) {
            //create new task element by passing document json object from returned respose
            displayTasks(data.document);
            //shown operation status
            showStatus("success", data.message);
            //clear input field
            clearForm();
          }
        } else {
          showStatus("error", data.error.message);
          clearForm();
        }
        console.log(`${JSON.stringify(data)}`);
      });
  }); // end of insert task method

  //change task UI from list to textbox to be change on the spot
  let createEditTaskTemplate = (taskId, uiId, data) => {
    $(document).on("click", `#${uiId}`, () => {
      //generating Id for new textbox
      let inputId = "input-" + taskId;
      //selecting tasklist<li> and sub class to set new textbox
      let newTaskItem = $(`#${taskId}>p span`);
      //appending new textbox to tasklist <li>
      newTaskItem.html(`<input type='text' value='${data}' id='${inputId}'/>`);
      //returning id of new input element
      updatedTextId = inputId;
      //disabling ui-edit button and enabling save-edit button
      let inputButton = $(`#${uiId}`);
      let editButton = $(`#edit-${taskId}`);
      inputButton.hide();
      editButton.show();
    });
  };

  /**
   * Save edited task Item value
   * @param taskId task object id
   * */
  let editTask = (taskId, editId) => {
    //calling jquery delegate method to add event on dynamic elements

    $(document).on("click", `#${editId}`, () => {
      if (updatedTextId) {
        //get the value from edit textbox
        let inputBox = $(`#${updatedTextId}`);
        let taskData = inputBox.val();
        if (taskData.trim() == "") {
          inputBox.val('');
          showStatus("warnig", "Task list can not be empty!! ");
        } else {
          //javascript's fetch method use to load url and header info withour form
          fetch(`/${taskId}`, {
            method: "PUT",
            body: JSON.stringify({ todo: taskData }),
            headers: { "Content-Type": "application/json;charset=utf-8" }
          })
            .then(res => {
              return res.json();
            })
            .then(data => {
              if (!data.error) {
                //update the task front end side on the fly
                let newData = taskData;
                updateTaskTemplate(taskId, newData);
                //show message
                showStatus("success", data.message);
                //clear Form
                clearForm();
              } else {
                showStatus("error", data.error.message);
                clearForm();
              }
            });
        }
        //Enable new edit button and disable save button
        let inputButton = $(`#${editId}`);
        let editButton = $(`#ui-${taskId}`);
        inputButton.hide();
        editButton.show();
      } else {
        //throw Error if try to save before edit text
        showStatus("warning", "No data found to be edited!!");
      }
    });
  }; //save edited task ends

  /**
   * Delete task Item value
   * @param taskId task object id
   * */
  let deleteTask = (taskId, deleteId) => {
    //calling jquery delegate method to add event on dynamic elements
    $(document).on("click", `#${deleteId}`, () => {
      //javascript's fetch method use to load url and header info withour form
      fetch(`/${taskId}`, {
        method: "DELETE"
      })
        .then(res => {
          return res.json();
        })
        .then(data => {
          if (!data.error) {
            //delete the task front end side on the fly
            deleteTaskTemplate(taskId);
            //show message
            showStatus("success", data.message);
          } else {
            showStatus("error", data.error.message);
          }
        });
    });
  }; //delete task ends

  //clear input field
  let clearForm = () => {
    taskInputBox.val("");
  };

  /******** show CRUD Operation status by alert message **********
   * show error message after all insert update delte operation or Error
   */
  let showStatus = (status, message) => {
    if (status == "success") {
      //if opration successful
      taskAlert.attr("class", "alert alert-success").html(`
    <span><i class="ion-md-checkmark-circle"></i>${message}</span>
    <button class="button-link" id="alert-close-button"><i class="ion-md-close-circle light"></i>
    </button>`);
    } else if (status == "error") {
      //if operation fails
      taskAlert.attr("class", "alert alert-danger").html(`
    <span><i class="ion-md-alert"></i>${message}</span>
    <button class="button-link" id="alert-close-button"><i class="ion-md-close-circle light"></i>
    </button>`);
    } else {
      //if operation fails
      taskAlert.attr("class", "alert alert-warning").html(`
    <span><i class="ion-md-warning"></i>${message}</span>
    <button class="button-link" id="alert-close-button"><i class="ion-md-close-circle default"></i>
    </button>`);
    }
    taskAlert.show(); //display:flex
  };

  //Alert close funtion
  let removeAlert = () => {
    $(document).on("click", "#alert-close-button", () => {
      taskAlert.hide();
    });
  };
  removeAlert();

  //end of wdocument.ready()
});
