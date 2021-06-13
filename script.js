let newtask = document.querySelector('#new-task');
let add_task = document.querySelector('form');
let todo_items = document.querySelector('#items');

let todo = [];

//checking storage is it empty or not. 
if(localStorage.length){
    let todo1 = JSON.parse(localStorage.getItem('todo'));
    for(let i=0;i<todo1.length;i++){
        if(todo1[i].text != ""){
            //todo.splice(i, 1);
            todo.push(todo1[i]);
        }
    }
    localStorage.setItem('todo',JSON.stringify(todo));
}

//adding new list to localstorage
let addtask = function(event) {
    let item = {
        checkbox: false,
        text: newtask.value,
    };
    todo.push(item);
    localStorage.setItem('todo',JSON.stringify(todo));
    newtask.value = "";
    add();
}

//adding new list
function add() {
    todo_items.innerHTML = "";

    for(let i=0;i<todo.length;i++){

        let listItem = document.createElement('li');
        let checkBox = document.createElement('input');
        let label = document.createElement('label');
        let btn = document.createElement('button');
        btn.innerText = 'Delete';
        checkBox.type = 'checkbox';
        listItem.className = 'item';
        btn.className = 'delete';

        label.innerText = todo[i].text;
        checkBox.checked = todo[i].checkbox;

        listItem.appendChild(checkBox);
        listItem.appendChild(label);
        listItem.appendChild(btn);

        todo_items.appendChild(listItem);
    }
}


//IIFE to show exitst todo from list
(function(){
    add();
})();

//grab the submit event to add new todo
add_task.addEventListener('submit', addtask);

//delete or update list
function del_item(child, i){
    child.addEventListener('click',function(event){
        if(event.target.className === 'delete'){
            child.remove();
            //todo.splice(i, 1);
            todo[i].text = "";
        }
        else{
            if(todo[i].checkbox === true){
                todo[i].checkbox = false;
            }
            else{
                todo[i].checkbox = true;
            }
        }
        localStorage.setItem('todo',JSON.stringify(todo));
    });
}

//traverse on list to update or delete
for(let i=0;i<todo_items.children.length;i++){
    del_item(todo_items.children[i], i);
}
