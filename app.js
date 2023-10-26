const express = require("express");
const bodyParser = require("body-parser");
const csrf = require("csurf");
const session = require("express-session");

const port = 3000;

const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: "fu54gyii677jhkhj8=:f798jn" }));

app.use(csrf({ cookie: false }));

app.set("view engine", "ejs");

const toDoList = [
  {
    id: 1,
    name: "workout",
    completed: false,
  },
  {
    id: 2,
    name: "Drink",
    completed: false,
  },
];

// Route to display the To-Do list
app.get("/", (req, res) => {
  const generatedCSRFToken = req.csrfToken();

  req.session.CSRF = generatedCSRFToken;

  res.render("todo", { toDoList, csrf: generatedCSRFToken });
});

// Route to add a new task to the To-Do list
app.post("/add", (req, res) => {
  const { task, _csrf } = req.body;

  if (_csrf !== req.session.CSRF) {
    res.status(400).send({ message: "Invalid Token" });
    return;
  }

  if (!task || task.trim() === "") {
    res.status(400).send({ message: "Please Enter Something" });
    return;
  }

  toDoList.push({ name: task, id: toDoList.length + 1 });

  res.redirect("/");
});

// Route to edit a task
app.post("/edit/:id", (req, res) => {
  if (req.body._csrf !== req.session.CSRF) {
    res.status(400).send({ message: "Invalid Token" });
    return;
  }

  const taskIndex = toDoList.findIndex((task) => task.id == req.params.id);

  if (taskIndex !== -1) {
    console.log(taskIndex, req.body.name);
    toDoList[taskIndex] = {
      ...toDoList[taskIndex],
      name: req.body.name,
    };
    res.redirect("/");
  } else {
    res.status(404).send({ message: "Index Not Found" });
  }
});

// Route to delete a task
app.get("/delete/:id", (req, res) => {
  const taskIndex = toDoList.findIndex((task) => task.id == req.params.id);

  if (taskIndex !== -1) {
    toDoList.splice(taskIndex, 1);

    res.redirect("/");
  } else {
    res.status(404).send({ message: "Index Not Found" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
