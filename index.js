const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3001;

let tasks = [];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

let employees = []; // store data in-memory

// Dashboard page
app.get("/", (req, res) => {
  res.render("index");
});

// Employee page
app.get("/employee", (req, res) => {
  res.render("pages/employee", { employees });
});

// Add employee POST route
app.post("/add-employee", (req, res) => {
  const { id, name, email, phone, role, department, balance, level, status } = req.body;

  const newEmployee = {
    id,
    name,
    email,
    phone,
    role,
    department,
    balance,
    level,
    created: new Date().toLocaleDateString(),
  };

  employees.push(newEmployee);

  //  Terminal log
  console.log(" [ADD] New Employee:");
  console.log(newEmployee);
  console.log("------------------------------");

  res.redirect("/employee");
});

// Delete employee 
app.delete("/delete/:id", (req, res) => {
  const empId = req.params.id;
  employees = employees.filter(emp => emp.id !== empId);

  //  Terminal log
  console.log(` [DELETE] Employee with ID ${empId} deleted.`);
  console.log("------------------------------");

  res.json({ success: true });
});

// Edit employee 
app.post('/edit-employee', (req, res) => {
  const updated = req.body;
  const index = employees.findIndex(emp => emp.id === updated.id);

  if (index !== -1) {
    const existing = employees[index];

    // Merge new data but keep 'created' date
    employees[index] = {
      ...existing, 
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      department: updated.department,
      balance: updated.balance,
      level: updated.level
    };

    //  Terminal log
    console.log(" [EDIT] Employee updated:");
    console.log(employees[index]);
    console.log("------------------------------");
  }

  res.redirect("/employee");
});

// Task Management
app.get('/taskManagement', (req, res) => {
  res.render('pages/taskManagement', { tasks });
});

app.post('/assign-task', (req, res) => {
  const { employeeId, subject, project, deadline, priority } = req.body;

  const employee = employees.find(emp => emp.id.toString() === employeeId.toString());

  const task = {
    id: Date.now().toString(),
    employeeId,
    employeeName: employee?.name || "Unknown",
    subject,
    project,
    deadline,
    priority,
    assignedAt: new Date().toLocaleDateString()
  };

  tasks.push(task);

  //  Terminal log
  console.log(" [TASK ASSIGNED]");
  console.log(task);
  console.log("------------------------------");

  res.redirect('/taskManagement');
});

app.listen(port, () => {
  console.log(` Server running at http://localhost:${port}`);
});
