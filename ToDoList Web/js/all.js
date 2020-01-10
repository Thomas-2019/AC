(function() {
  "use strict";

  const Todo = document.getElementById("Todo");
  const Done = document.getElementById("Done");

  /*預設值清單*/

  const TodoList = ["範例-Tode1", "範例-Tode2", "範例-Tode3", "範例-Tode4"];

  for (let list of TodoList) {
    addTodo(list);
  }

  const DoneList = ["範例-Done1", "範例-Done2", "範例-Done3", "範例-Done4"];
  for (let list of DoneList) {
    addDone(list);
  }

  /*function*/

  function addTodo(item) {
    let li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "bg-transparent",
      "border",
      "border-primary",
      "p-1"
    );
    li.innerHTML = `
    <label class="col-7">${item}</label>
    <i class="col-2 icon-minus-square btn btn-primary"></i>
    <i class="col-2 icon-bin btn btn-secondary"></i>
    `;
    Todo.appendChild(li);
  }

  function addDone(item) {
    let li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "bg-transparent",
      "border",
      "border-success",
      "p-1"
    );
    li.innerHTML = `
    <label class="col-7 text-muted">${item}</label>
    <i class="col-2 icon-plus-square btn btn-success"></i>
    <i class="col-2 icon-bin btn btn-secondary"></i>
    `;
    Done.appendChild(li);
  }

  /* 監聽事件*/

  const inpt = document.getElementById("inp-item");
  const main = document.getElementsByTagName("main")[0];

  main.addEventListener("click", function(event) {
    const el = Array.from(event.target.classList);
    const target = event.target.parentNode;
    const value = target.firstElementChild.textContent;

    if (el[1] === "icon-minus-square") {
      target.remove();
      addDone(value);
    } else if (el[1] === "icon-plus-square") {
      target.remove();
      addTodo(value);
    } else if (el[1] === "icon-bin") {
      target.remove();
    } else if (event.target.id === "btn" && inpt.value !== "") {
      addTodo(inpt.value);
      inpt.value = "";
    }
  });
})();
