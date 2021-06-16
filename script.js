let submitTodo = document.querySelector('.input-things');
let newTask = document.querySelector('#new-task');
let addTodo = document.querySelector('.add-todo');
let completeTodo = document.querySelector('.complete-todo');

let selected = document.querySelector(".selected");
let optionsContainer = document.querySelector(".options-container");
let optionsList = document.querySelectorAll(".option");

let todo1 = JSON.parse(localStorage.getItem('todo'));
let complete1 = JSON.parse(localStorage.getItem('complete'));
let todo = [];
let complete = [];

/*..dropdown..*/
function dropDown(){
    selected.addEventListener("click", () => {
        optionsContainer.classList.toggle("active");
    });

    optionsList.forEach(o => {
        o.addEventListener("click", () => {
            selected.innerHTML = o.querySelector("label").innerHTML;
            optionsContainer.classList.remove("active");
        });
    });
}
/*.............................*/

/*..clean localstorage data..*/
function cleanData(){
    if(todo1 != null){
        for(let i=0;i<todo1.length;i++){
            if(todo1[i].text != ""){
                todo.push(todo1[i]);
            }
        }
        localStorage.setItem('todo', JSON.stringify(todo));
    }
    if(complete1 != null){
        for(let i=0;i<complete1.length;i++){
            if(complete1[i].text != ""){
                complete.push(complete1[i]);
            }
        }
        localStorage.setItem('complete', JSON.stringify(complete));
    }
}
/*.............................*/

/*..create todo list..*/
let createtask = function(task, priority){

    let listItem = document.createElement('li');
    let checkBox = document.createElement('input');
    let label = document.createElement('label');
    let btn = document.createElement('button');
    btn.innerText = 'Update';
    checkBox.type = 'checkBox';
    checkBox.className = 'checkBox';
    listItem.className = 'item';
    listItem.className += " " + priority;
    btn.className = 'update';
    label.innerText = task;
    checkBox.checked = false;

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(btn);

    return listItem;
}
/*.............................*/

/*..create completed task list..*/
let createCompleteTask = function(text, priority){
    let listItem = document.createElement('li');
    let btn1 = document.createElement('button');
    let label = document.createElement('label');
    let btn2 = document.createElement('button');

    label.innerText = text;
    btn1.innerText = 'Undo';
    btn2.innerText = 'Delete';
    listItem.className = 'item';
    listItem.className += " " + priority;
    btn1.className = 'undo';
    btn2.className = 'delete';

    listItem.appendChild(btn1);
    listItem.appendChild(label);
    listItem.appendChild(btn2);

    return listItem;
}
/*.............................*/

/*..adding new todo into localstorage and todo list(listenning event from submit)..*/
let addTask = function(event) {
    event.preventDefault();
    if(selected.innerHTML === "Priority"){
        return;
    }
    let item = {
        text: newTask.value,
        priority: selected.innerHTML,
    }
    todo.push(item);
    localStorage.setItem('todo', JSON.stringify(todo));

    let listItem = createtask(newTask.value, selected.innerHTML);
    addTodo.appendChild(listItem);
    newTask.value = "";
    selected.innerHTML = "Priority";
    bindCompleteItems1(listItem, completeTask, todo.length-1);
}
/*.............................*/

/*..adding new todo into localstorage and todo list from undo click..*/
let undoAdd = function(i){
    todo.push({text: complete[i].text, priority: complete[i].priority,});
    localStorage.setItem('todo', JSON.stringify(todo));

    let listItem = createtask(complete[i].text, complete[i].priority);
    addTodo.appendChild(listItem);
    
    complete[i].text = "";
    localStorage.setItem('complete', JSON.stringify(complete));

    bindCompleteItems1(listItem, completeTask, todo.length-1);
}
/*.............................*/

/*..adding prev stored todo list..*/
let prevTodoList = function(text, priority, i){
    let listItem = createtask(text, priority);
    addTodo.appendChild(listItem);
    bindCompleteItems1(listItem, completeTask, i);
}
/*.............................*/

/*..adding prev stored complete list..*/
let prevCompleteList = function(text, priority, i){
    let listItem = createCompleteTask(text, priority);
    completeTodo.appendChild(listItem);

    bindCompleteItems2(listItem, deleteTask, i);
}
/*.............................*/

/*..listenning to checkBox..*/
let completeTask = function(i){
    let listItem = createCompleteTask(todo[i].text, todo[i].priority);

    complete.push({text: todo[i].text, priority: todo[i].priority,});
    localStorage.setItem('complete', JSON.stringify(complete));

    todo[i].text = "";
    localStorage.setItem('todo', JSON.stringify(todo));

    completeTodo.appendChild(listItem);

    bindCompleteItems2(listItem, deleteTask, complete.length-1);
}
/*.............................*/

/*..listenning to delete button..*/
let deleteTask = function(i) {
    complete[i].text = "";
    localStorage.setItem('complete', JSON.stringify(complete));
}
/*.............................*/

/*..checking the event for delete and undo button..*/
let bindCompleteItems2 = function(listItem, buttonClick, i){
    let undoBtn = listItem.querySelector('button[class="undo"]');
    let deleteBtn = listItem.querySelector('button[class="delete"]');
    deleteBtn.addEventListener('click', function(){
        let listItem = this.parentNode;
        let ul = listItem.parentNode;
        ul.removeChild(listItem);
        buttonClick(i);
    });
    undoBtn.addEventListener('click', function(){
        this.parentNode.parentNode.removeChild(this.parentNode);
        undoAdd(i);
    });
}
/*.............................*/

/*..checking the event for checkBox..*/
let bindCompleteItems1 = function(listItem, checkBoxclick, i) {
    let checkBox = listItem.querySelector('input[type="checkBox"]');
    checkBox.addEventListener('click', function(){
        this.parentNode.parentNode.removeChild(this.parentNode);
        checkBoxclick(i);
    });
}
/*.............................*/

function init(){
    cleanData();
    dropDown();
    /*..listen to submitted todo item..*/
    submitTodo.addEventListener('submit', addTask);
    /*.............................*/

    /*..traverse on prev todo and complete list..*/
    for(let i=0;i<todo.length;i++){
        prevTodoList(todo[i].text, todo[i].priority, i);
    }

    for(let i=0;i<complete.length;i++){
        prevCompleteList(complete[i].text, complete[i].priority, i);
    }
    /*.............................*/
}

(function(){
    init();
})();
