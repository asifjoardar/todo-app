let submitTodo = document.querySelector('.input-things');
let newTask = document.querySelector('#new-task');
let addTodo = document.querySelector('.add-todo');
let completeTodo = document.querySelector('.complete-todo');

let selected = document.querySelector(".selected");
let optionsContainer = document.querySelector(".options-container");
let optionsList = document.querySelectorAll(".option");

let todo = {};
let complete = {};

if(JSON.parse(localStorage.getItem('todo')) != null)
    todo = JSON.parse(localStorage.getItem('todo'));
if(JSON.parse(localStorage.getItem('complete')) != null)
    complete = JSON.parse(localStorage.getItem('complete'));

/*..id genarator..*/
const id = function () {
    return '_' + Math.random().toString(36).substr(2, 7);
};
/*....*/

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

/*..adding new todo into localstorage and todo list(listenning event from submit)..*/
let addTask = function(event) {
    event.preventDefault();
    if(selected.innerHTML === "Priority" || newTask.value == ""){
        alert(`Priority or input field should not empty.`);
        return;
    }
    var ID = id().toString();
    todo[ID] = {
        text: newTask.value,
        priority: selected.innerHTML,
    }
    console.log(todo);
    localStorage.setItem('todo', JSON.stringify(todo));

    let listItem = createtask(newTask.value, selected.innerHTML, ID);
    addTodo.appendChild(listItem);
    
    newTask.value = "";
    selected.innerHTML = "Priority";
    bindCompleteItems1(listItem, completeTask, /*todo.length-1*/ID);
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

    bindCompleteItems1(listItem, completeTask, ID);
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

    bindCompleteItems2(listItem, deleteTask, ID);
}
/*.............................*/

/*..listenning to delete button..*/
let deleteTask = function(ID) {
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
        checkBoxclick(ID);
    });
    update.addEventListener('click', function(){
        listItem.remove();
        newTask.value = todo[ID].text;
        selected.innerText = todo[ID].priority;
        delete todo[ID];
        localStorage.setItem('todo', JSON.stringify(todo));
        init();
    });

}
/*.............................*/

function init(){
    dropDown();
    /*..listen to submitted todo item..*/
    submitTodo.addEventListener('submit', addTask);
    /*.............................*/

    /*..traverse on prev todo and complete list..*/
    for(/*let i=0;i<todo.length;i++*/ let ID in todo){
        prevTodoList(todo[ID].text, todo[ID].priority, ID);
    }

    for(/*let i=0;i<complete.length;i++*/ let ID in complete){
        prevCompleteList(complete[ID].text, complete[ID].priority, ID);
    }
    /*.............................*/
}

(function(){
    init();
})();
