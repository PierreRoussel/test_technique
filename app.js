import { isTaskNameOk } from "./app-utils.js";
import { h, component } from "./lib.js";

function loadData() {
  return fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.error(err);
      return [];
    });
}

const button = component((props, children) => {
  return h(
    "button",
    {
      type: props.type || "button",
      onclick: props.onclick,
    },
    children
  );
});

const taskItem = component((props, children, rerender) => {
  function toggle(event) {
    props.task.done = !props.task.done;
    rerender();
  }

  function rename() {
    const newName = window.prompt("Nouveau nom de tâche", props.task.title);
    if (!isTaskNameOk(newName)) return alert("Le nom entré n'est pas correct");
    props.task.title = newName;
    rerender();
  }

  const checkStatus = props.task.done ? { checked: "" } : {};
  return h("li", { class: "task-list__item" }, [
    h("label", {}, [
      h("input", { type: "checkbox", onclick: toggle, ...checkStatus }),
      h(
        "span",
        { class: `${props.task.done && "task-item--checked"}` },
        props.task.title
      ),
    ]),
    button({ onclick: rename }, "rename"),
    button({ onclick: () => props.onTaskDeleted(props.task) }, "delete"),
  ]);
});

const taskList = component((props) => {
  if (!props.tasks.length)
    return h(
      "div",
      { class: "app__task-list--empty app__task-list" },
      "Ajoute de nouvelles tâches !"
    );
  const items = props.tasks.map((task) => {
    return taskItem({
      task,
      onTaskDeleted: () => props.onTaskDeleted(task),
    });
  });
  return h("ul", { class: "app__task-list" }, [...items]);
});

const addTaskForm = component((props) => {
  function onsubmit(event) {
    event.preventDefault();
    const newTaskTitle = event.target.elements.title.value;
    if (!isTaskNameOk(newTaskTitle))
      return alert("Le nom entré n'est pas correct");
    props.onTaskCreated(newTaskTitle);
  }

  return h("form", { onsubmit }, [
    h("input", { type: "text", placeholder: "Task title", name: "title" }),
    button({ type: "submit" }, "Add"),
  ]);
});

let tasks;
const app = component((props, children, rerender) => {
  if (tasks) {
    return h("div", { id: "app" }, [
      h("h1", { class: "app__title" }, "Kantree Todo App !"),
      taskList({
        tasks,
        onTaskDeleted: (task) => {
          tasks = tasks.filter((taskTofilter) => taskTofilter !== task);
          rerender();
        },
      }),
      addTaskForm({
        onTaskCreated: (task) => {
          tasks.push({ title: task, done: false });
          rerender();
        },
      }),
    ]);
  }

  loadData().then((data) => {
    tasks = data;
    rerender();
  });

  return h("div", { class: "loading" }, "Loading...");
});

document.addEventListener("DOMContentLoaded", () =>
  document.body.appendChild(app())
);
