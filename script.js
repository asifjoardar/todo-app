let newtask = document.querySelector('#new-task');
let add_task = document.querySelector('#addTask');
let todo_items = document.querySelector('#items');

let todo = [];

if(localStorage.length){
    todo = JSON.parse(localStorage.getItem('todo'));
}

let addtask = function(event) {
    let item = {
        checkbox: false,
        text: newtask.value,
    };

    todo.push(item);
    localStorage.setItem('todo',JSON.stringify(todo));
    newtask.value = "";

    add();
    location.reload(); 
}

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

(function(){
    add();
})();

add_task.addEventListener('click', addtask);

for(let i=0;i<todo_items.children.length;i++){
    //console.log(i);
    todo_items.children[i].addEventListener('click',function(event){
        if(event.target.className === 'delete'){
            todo_items.children[i].remove();
            todo.splice(i, 1);
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
        location.reload(); 
    });
}
