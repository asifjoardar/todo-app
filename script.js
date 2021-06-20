"use strict";

let submitTodo = document.querySelector('.input-tasks');
let submitUpdate = document.querySelector('.input-updates');
let addTodo = document.querySelector('.add-todo');
let completeTodo = document.querySelector('.complete-todo');
let addHistory = document.querySelector('#history-items');
let getTask = document.querySelector('#new-task');
let getPriority = document.querySelector('#priority-select');
let getUpdatePriority = document.querySelector('#update-priority');
let getUpdateTask = document.querySelector('#update-task');

let history = [];
let todo = {};
let complete = {};

if(JSON.parse(localStorage.getItem('history')) != null)
    history = JSON.parse(localStorage.getItem('history'));
if(JSON.parse(localStorage.getItem('todo')) != null)
    todo = JSON.parse(localStorage.getItem('todo'));
if(JSON.parse(localStorage.getItem('complete')) != null)
    complete = JSON.parse(localStorage.getItem('complete'));

/*..id genarator..*/
const id = function () {
    return Math.random().toString(36).substr(2, 7);
};
/*....*/

/*..create todo list..*/
let createtask = function(task, priority, ID){

    let listItem = document.createElement('li');
    let checkBox = document.createElement('input');
    let label = document.createElement('label');
    let btn = document.createElement('button');
    let divForId = document.createElement('div');
    let divForContent = document.createElement('div');

    divForContent.className = 'list-content';
    divForId.className = 'id';
    divForId.innerText = ID;
    btn.innerText = 'Update';
    checkBox.type = 'checkBox';
    checkBox.className = 'checkBox';
    listItem.className = 'item';
    listItem.className += " " + priority;
    btn.className = 'update';
    
    label.innerText = task;
    checkBox.checked = false;

    divForContent.appendChild(checkBox);
    divForContent.appendChild(label);
    divForContent.appendChild(btn);
    listItem.appendChild(divForId);
    listItem.appendChild(divForContent);

    return listItem;
}
/*.............................*/

/*..create completed task list..*/
let createCompleteTask = function(text, priority, ID){
    let listItem = document.createElement('li');
    let btn1 = document.createElement('button');
    let label = document.createElement('label');
    let btn2 = document.createElement('button');
    let divForId = document.createElement('div');
    let divForContent = document.createElement('div');

    divForContent.className = 'list-content';
    divForId.className = 'id';
    divForId.innerText = ID;
    label.innerText = text;
    btn1.innerText = 'Undo';
    btn2.innerText = 'Delete';
    listItem.className = 'item';
    listItem.className += " " + priority;
    btn1.className = 'undo';
    btn2.className = 'delete';

    divForContent.appendChild(btn1);
    divForContent.appendChild(label);
    divForContent.appendChild(btn2);

    listItem.appendChild(divForId);
    listItem.appendChild(divForContent);

    return listItem;
}
/*.............................*/

let createHistoryList = function(text){
    let listItem = document.createElement('li');
    listItem.className = 'item';
    listItem.innerText = text;
    return listItem;
}

/*..adding new todo into localstorage and todo list(listenning event from submit)..*/
let addTask = function(event) {
    event.preventDefault();
    if(getPriority.value === "" || getTask.value == ""){
        alert(`Priority or input field should not empty.`);
        return;
    }
    var ID = id().toString();
    todo[ID] = {
        text: getTask.value,
        priority: getPriority.value,
    }
    localStorage.setItem('todo', JSON.stringify(todo));

    let listItem = createtask(getTask.value, getPriority.value, ID);
    addTodo.appendChild(listItem);
    
    getTask.value = "";
    getPriority.value = "";
    let historyListItem = createHistoryList(`Id "${ID}" is Added`);
    addHistory.insertBefore(historyListItem, addHistory.childNodes[0]);
    history.push(`Id "${ID}" is Added`);
    localStorage.setItem('history', JSON.stringify(history));
    bindCompleteItems1(listItem, completeTask, ID);
}
/*.............................*/

/*..adding new todo into localstorage and todo list from undo click..*/
let undoAdd = function(ID){
    todo[ID] = {text: complete[ID].text, priority: complete[ID].priority,};
    localStorage.setItem('todo', JSON.stringify(todo));

    let listItem = createtask(complete[ID].text, complete[ID].priority, ID);
    addTodo.appendChild(listItem);
    
    delete complete[ID];
    localStorage.setItem('complete', JSON.stringify(complete));

    let historyListItem = createHistoryList(`Undo Id "${ID}"`);
    addHistory.insertBefore(historyListItem, addHistory.childNodes[0]);
    history.push(`Undo Id "${ID}"`);
    localStorage.setItem('history', JSON.stringify(history));
    bindCompleteItems1(listItem, completeTask, ID);
}
/*.............................*/

/*updating task*/
let updateTask = function(listItem, ID){
    document.querySelector('.task-container').hidden = true;
    document.querySelector('.update-container').hidden = false;
    document.querySelector('#update-task').value = todo[ID].text;
    document.querySelector('#update-priority').value = todo[ID].priority;
    document.querySelector('.update-title').innerText = `Update Your task for ID: ${ID}`;


    submitUpdate.addEventListener('submit', function(event){
        if(getUpdatePriority.value === "" || getUpdateTask.value == ""){
            alert(`1 Priority or input field should not empty.`);
            return;
        }
        listItem.classList.remove(todo[ID].priority);

        todo[ID].text = getUpdateTask.value;
        todo[ID].priority = getUpdatePriority.value;
        localStorage.setItem('todo', JSON.stringify(todo));

        listItem.querySelector('label').innerText = todo[ID].text;
        listItem.className += " " + todo[ID].priority;
        document.querySelector('.task-container').hidden = false;
        document.querySelector('.update-container').hidden = true;

        let historyListItem = createHistoryList(`Id "${ID}" is Updated`);
        addHistory.insertBefore(historyListItem, addHistory.childNodes[0]);
        history.push(`Id "${ID}" is Updated`);
        localStorage.setItem('history', JSON.stringify(history));

        bindCompleteItems1(listItem, completeTask, ID);
    });
}
/*.............................*/

/*..adding prev stored todo list..*/
let prevTodoList = function(text, priority, ID){
    let listItem = createtask(text, priority, ID);
    addTodo.appendChild(listItem);
    bindCompleteItems1(listItem, completeTask, ID);
}
/*.............................*/

/*..adding prev stored complete list..*/
let prevCompleteList = function(text, priority, ID){
    let listItem = createCompleteTask(text, priority, ID);
    completeTodo.appendChild(listItem);

    bindCompleteItems2(listItem, deleteTask, ID);
}
/*.............................*/

/*..listenning to checkBox..*/
let completeTask = function(ID){
    let listItem = createCompleteTask(todo[ID].text, todo[ID].priority, ID);

    complete[ID] = {text: todo[ID].text, priority: todo[ID].priority,};
    localStorage.setItem('complete', JSON.stringify(complete));
    delete todo[ID];
    localStorage.setItem('todo', JSON.stringify(todo));

    completeTodo.appendChild(listItem);

    let historyListItem = createHistoryList(`Id "${ID}" completed`);
    addHistory.insertBefore(historyListItem, addHistory.childNodes[0]);
    history.push(`Id "${ID}" completed`);
    localStorage.setItem('history', JSON.stringify(history));

    bindCompleteItems2(listItem, deleteTask, ID);
}
/*.............................*/

/*..listenning to delete button..*/
let deleteTask = function(ID) {
    let historyListItem = createHistoryList(`Delete completed Id "${ID}"`);
    addHistory.insertBefore(historyListItem, addHistory.childNodes[0]);
    history.push(`Delete completed Id "${ID}"`);
    localStorage.setItem('history', JSON.stringify(history));

    delete complete[ID];
    localStorage.setItem('complete', JSON.stringify(complete));
}
/*.............................*/

/*..checking the event for delete and undo button..*/
let bindCompleteItems2 = function(listItem, buttonClick, ID){
    let undoBtn = listItem.querySelector('button[class="undo"]');
    let deleteBtn = listItem.querySelector('button[class="delete"]');
    deleteBtn.addEventListener('click', function(){
        listItem.remove();
        buttonClick(ID);
    });
    undoBtn.addEventListener('click', function(){
        listItem.remove();
        undoAdd(ID);
    });
}
/*.............................*/

/*..checking the event for checkBox..*/
let bindCompleteItems1 = function(listItem, checkBoxclick, ID) {
    let checkBox = listItem.querySelector('input[type="checkBox"]');
    let update = listItem.querySelector('button[class="update"]');
    checkBox.addEventListener('click', function(){
        listItem.remove();
        checkBoxclick(ID.toString());
    });
    update.addEventListener('click', function(){
        updateTask(listItem, ID);
    });
}
/*.............................*/

function init(){
    /*..listen to submitted or updated todo item..*/
    submitTodo.addEventListener('submit', addTask);
    /*.............................*/

    /*..traverse on prev todo and complete list..*/
    for(let ID in todo){
        prevTodoList(todo[ID].text, todo[ID].priority, ID);
    }

    for(let ID in complete){
        prevCompleteList(complete[ID].text, complete[ID].priority, ID);
    }

    for(let i=0;i<history.length;i++){
        let historyListItem = createHistoryList(history[i]);
        addHistory.insertBefore(historyListItem, addHistory.childNodes[0]);
    }
    /*.............................*/
}

(function(){
    init();
})();
