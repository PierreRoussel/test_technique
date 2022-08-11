import { h, component } from "./lib.js";

function loadData() {
  return fetch("./data.json")
    .then((res) => {
      return res.json();
    })
    .catch((err) => {
      console.error(err);
    });
}

const button = component((props, children) => {
  // TODO
});

const taskItem = component((props, children, rerender) => {
  function toggle(event) {
    // TODO
  }

  function rename() {
    // TODO
  }

  const checkStatus = props.task.done ? { checked: "" } : {};
  return h("div", { class: "task-item" }, [
    h("input", { type: "checkbox", onclick: toggle, ...checkStatus }),
    button({ onclick: rename }, "rename"),
    button({ onclick: () => props.onTaskDeleted() }, "delete"),
  ]);
});

const taskList = component((props) => {
  // TODO: loop on props.tasks to generate a list of taskItem
  // call props.onTaskDeleted(task) when a task is deleted
});

const addTaskForm = component((props) => {
  function onsubmit(event) {
    // TODO: call props.onTaskCreared() with a task object as argument
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
      taskList({
        tasks,
        onTaskDeleted: (task) => {
          // TODO
        },
      }),
      addTaskForm({
        onTaskCreated: (task) => {
          // TODO
        },
      }),
    ]);
  }

  loadData().then((data) => {
    tasks = data;
    console.log("data", data);
    rerender();
  });

  return h("div", { class: "loading" }, "Loading...");
});

document.addEventListener("DOMContentLoaded", () =>
  document.body.appendChild(app())
);
