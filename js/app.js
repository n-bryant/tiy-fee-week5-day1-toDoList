"use strict";

const toDoList = {
  // comma separated properties
  incompleteItems: 0,
  tasks: [],

  // comma separated methods

  // Create a todo item when the user submits the form
  addItem(task) {
    let newTask = {};
    newTask.completed = false;
    newTask.key = this.tasks.length;
    newTask.taskName = task;

    // push newTask to tasks array
    this.tasks.push(newTask);

    // append newTask to items list
    this.generateTemplate('all');

    // updates incomplete count
    this.updateIncompleteCount();
  },

  // bind event listeners
  bindEvents() {
    // submission of form
    $('form').on('submit', function() {
      event.preventDefault();
      let newItem = $('.new-todo').val(); // event.target[0].value;
      toDoList.addItem(newItem);
      this.reset();
    });
    // clicking on a todo item's text
    // using event delegation because the p element doesn't exist yet
    $('.items').on('click', 'p', function() {
      toDoList.editItem(this);
    });
    // removing focus from edit input
    $('.items').on('focusout', 'input', function() {
      toDoList.updateItem(this);
    });
    // clicking on check button
    $('.items').on('click', '.check', function() {
      toDoList.completeItem(this);
    });
    // clicking on delete button
    $('.items').on('click', '.delete', function() {
      toDoList.deleteItem(this);
    });
    // clicking clear button
    $('.clear').on('click', function() {
      toDoList.clearCompleted();
    });
    // clicking on "Active"
    $('.show-active').on('click', function() {
      toDoList.showActive();
    });
    // clicking on "All"
    $('.show-all').on('click', function() {
      toDoList.showAll();
    });
    // clicking on "Completed"
    $('.show-completed').on('click', function() {
      toDoList.showCompleted();
    });
  },

  // remove completed items from UI
  clearCompleted() {
    // remove completed items from tasks array
    let incompleteTasks = [];
    for (let index = 0; index < this.tasks.length; index++) {
      if (!this.tasks[index].completed) {
        incompleteTasks.push(this.tasks[index]);
      }
    }
    this.tasks = incompleteTasks;

    // generate new template based on updated array
    this.generateTemplate();
  },

  // toggles an items complete status and updates completed count
  completeItem(item) {
    // toggle completed status in array data
    let key = Number($(item).parents('li').attr('data-key'));
    for (let index = 0; index < this.tasks.length; index++) {
      if (key === this.tasks[index].key) {
        if (!this.tasks[index].completed) {
          this.tasks[index].completed = true;
        } else {
          this.tasks[index].completed = false;
        }
      }
    }

    // toggle completed styles in UI
    $(item).parents('li').toggleClass('completed');

    // update incomplete count
    this.updateIncompleteCount();
  },

  // allow user to delete item when clicking on item's red X
  deleteItem(item) {
    let key = Number($(item).parents('li').attr('data-key'));
    for (let index = 0; index < this.tasks.length; index++) {
      if (key === this.tasks[index].key) {
        // remove from array
        this.tasks.splice(index, 1);
        // remove from page
        $(`li[data-key=${key}]`).remove();
      }
    }

    // updates incomplete count
    this.updateIncompleteCount();
  },

  // allow user to edit the item inline when clicked
  editItem(item) {
    // toggle display for p and input elements
    $(item).toggle();
    $(item).siblings('input').toggle();
  },

  // generate new task template
  generateTemplate() {
    const source = $(`#task-template`).html();
    const template = Handlebars.compile(source);
    const context = this; // toDoList
    const html = template(context);

    $('.items').html(html);
  },

  //
  showActive() {
    // toggle active class on footer buttons
    this.toggleActive('.show-active', '.show-all', '.show-completed');

    // hide completed items
    $('.items li').removeClass('hide');
    $('.items li.completed').addClass('hide');
  },

  // update UI to show all items regardless of completed status
  showAll() {
    // toggle active class on footer buttons
    this.toggleActive('.show-all', '.show-active', '.show-completed');

    // remove hide from all items
    $('.items li').removeClass('hide');
  },

  // update UI to only show completed items
  showCompleted() {
    // toggle active class on footer buttons
    this.toggleActive('.show-completed', '.show-active', '.show-all');

    // hide incomplete items
    $('.items li').addClass('hide');
    $('.items li.completed').removeClass('hide');
  },

  // toggles active class on footer buttons
  toggleActive(active, inactive1, inactive2) {
    if (!$(active).hasClass('.active')) {
      $(active).addClass('active');
    }
    $(inactive1).removeClass('active');
    $(inactive2).removeClass('active');
  },

  // update the incompleted items count on the UI
  updateIncompleteCount() {
    this.incompleteItems = $('.items li').length - $('.completed').length;
    $('.incomplete-items').html(this.incompleteItems);
  },

  // updates edited item's value and its corresponding data in the tasks array
  updateItem(item) {
    // update tasks array
    let index = Number($(item).parents('li').attr('data-key'));
    this.tasks[index].taskName = $(item).val();

    // set p html to be the input value
    $(item).siblings('p').html($(item).val());
    console.log($(item).siblings('p').html());

    // clear input value and toggle display on p and input
    $(item).toggle();
    $(item).val('');
    $(item).siblings('p').toggle();
  },

  // initialize
  init() {
    this.bindEvents();
  }
};
toDoList.init();
