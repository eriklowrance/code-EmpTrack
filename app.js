const connection = require("./connection");
const inquirer = require("inquirer");
// Start our application
init();

async function init() {
  const { action } = await inquirer.prompt({
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View all Employees",
      "View all Employeees by Department",
      "View all Employees by Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "View All Roles",
      "Add Role",
      "Remove Role",
      "exit",
    ],
  });

  switch (action) {
    case "View all Employees":
      viewEmployees();
      break;
    case "View all Employeees by Department":
      byDepartment();
      break;
    case "View all Employees by Manager":
      byManager();
      break;
    case "Add Employee":
      addEmployee();
      break;
    case "Remove Employee":
      removeEmployee();
      break;
    case "Update Employee Role":
      updateEmployee();
      break;
    case "Update Employee Manager":
      updateManager();
      break;
    case "View All Roles":
      viewRoles();
      break;
    case "Add Role":
      addRole();
      break;
    case "Remove Role":
      removeRole();
      break;
    case "exit":
      process.exit(0);
      break;
    default:
      break;
  }
}

async function viewEmployees() {
    
}