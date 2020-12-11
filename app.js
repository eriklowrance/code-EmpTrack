const connection = require("./connection");
const logo = require("asciiart-logo");
const inquirer = require("inquirer");
const { async } = require("rxjs");
// Start our application
console.log(
    logo({
      name: "EMPLOYEE TRACKER",
      font: "DOOM",
      lineChars: 14,
      padding: 8,
      margin: 8,
      borderColor: "bold-green",
      logoColor: "bold-red",
      textColor: "green",
    })
      .emptyLine()
      .right("version 3.7.123")
      .emptyLine()
      .render()
  );
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
      "Add Department",
      "View Department",
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
    case "Add Department":
      addDepartment();
      break;
    case "View Department":
      viewDepartment();
      break;
    case "exit":
      process.exit(0);
      break;
    default:
      break;
  }
}

async function viewEmployees() {
    const query = `select  
    department.name AS 'Department',
    role.title AS 'Job Title',
    IFNULL(CONCAT(m.first_name, ' ', m.last_name),
    'Top Manager') AS 'Manager',
    CONCAT(e.first_name,' ',e.last_name) AS 'Direct report', 
    role.salary AS 'Employee Salary'
    from employee e
    left join employee m on m.id = e.manager_id
    inner join role on e.role_id = role.id
    inner join department on role.department_id = department.id
    ORDER BY manager DESC`
  const data = await connection.query(query);
  console.table(data);
  init();
}

// async function byDepartment() {
//     const { dept } = await inquirer.prompt({
//         name: "dept",
//         type: "list",
//         message: "What department would you like to view?",
//         choices: ["Sales", "Engineering", "Finance", "Legal"],
//       });
//     const query =
//     "SELECT * FROM employee WHERE name = ?";
//   const data = await connection.query(query, dept);
//   console.table(data);
//   init();
// }

async function addDepartment() {
  const { dept } = await inquirer.prompt({
    name: "dept",
    type: "input",
    message: "What department would you like to add?",
  });
  const query = "INSERT INTO department (name) VALUES (?)";
  const data = await connection.query(query, dept);
  console.log("Department Added!");
  init();
}

async function viewDepartment() {
  const query = "SELECT * FROM department";
  const data = await connection.query(query);
  console.table(data);
  init();
}

async function addRole() {
  let query = "SELECT * FROM department";
  const deptData = await connection.query(query);
  const departmentName = deptData.map((dept) => dept.name);
  const { role, salary, dept } = await inquirer.prompt([
    {
      name: "role",
      type: "input",
      message: "What role would you like to add?",
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary of this role?",
    },
    {
      name: "dept",
      type: "list",
      message: "What department is this role in?",
      choices: departmentName,
    },
  ]);
  const deptObj = deptData.find((department) => dept === department.name);
  query = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
  const data = await connection.query(query, [role, salary, deptObj.id]);
  console.log("Role Added!");
  init();
}

async function viewRoles() {
  const query = "SELECT * FROM role";
  const data = await connection.query(query);
  console.table(data);
  init();
}

async function addEmployee() {
  let query = "SELECT * FROM role";
  const roleData = await connection.query(query);
  query = "SELECT * FROM employee";
  const employeeData = await connection.query(query);
  let roleList = roleData.map((role) => role.title);
  let employeeList = employeeData.map(
    (employee) => employee.first_name + " " + employee.last_name
  );
  employeeList.push("NULL")
  const { first, last, title, manager } = await inquirer.prompt([
    {
      name: "first",
      type: "input",
      message: "What is the first name?",
    },
    {
      name: "last",
      type: "input",
      message: "What is the last name?",
    },
    {
      name: "title",
      type: "list",
      message: "What role does this employee have?",
      choices: roleList,
    },
    {
      name: "manager",
      type: "list",
      message: "Do they have a manager?",
      choices: employeeList,
    },
  ]);
  const roleObj = roleData.find((role) => title === role.title);
  const employeeObj = employeeData.find(
    (employee) => manager === employee.first_name + " " + employee.last_name
  );
  query =
    "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
  const data = await connection.query(query, [
    first,
    last,
    roleObj.id,
    // if cannot find id = 0
    employeeObj ? employeeObj.id: 0,
  ]);
  console.log("Employee Added!");
  init();
}

async function updateEmployee() {
    const employeeData = await connection.query("SELECT id, concat(first_name, ' ', last_name)as 'name' FROM employee")
    console.log(employeeData);
    let query = "SELECT * FROM role";
  const roleData = await connection.query(query);
      const { update, title } = await inquirer.prompt([
        {
          name: "update",
          type: "list",
          message: "Which employee would you like to update?",
          choices: employeeData.map((employee) => ({
            name: employee.name,
            value: employee.id,
          })),
        },
        
        {
            name: "title",
            type: "list",
            message: "What role does this employee have?",
            choices: roleData.map((role) => ({
                name: role.title,
                value: role.id,
              })),
        },
    ])
    // let employeeList = employeeData.map(
    //     (employee) => employee.first_name + " " + employee.last_name
    //   );
    let query1 = "UPDATE employee SET role_id = ? WHERE id = ?";
    const data = await connection.query(query1, [title, update])
    init();
    };
    //   const employeeObj = employeeData.find(
    //     (employee) => manager === employee.first_name + " " + employee.last_name
    //   );

