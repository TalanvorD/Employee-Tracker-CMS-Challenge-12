const inquirer = require("inquirer"); // Importing packages
const pool = require('./config/connection.js'); // Postgres database connection
const Department = require('./models/department.js'); // Constructors for Department, Employee and Role
const Employee = require('./models/employee.js');
const Role = require('./models/role.js');

pool.connect();

const departmentList = getDepartmentList();
const roleList = getRoleList();
const employeeList = getEmployeeList();

const mainMenuOptions = [ // Array to hold the prompts for the main menu list
    {
        type: 'list',
        message: "What would you like to do:",
        name: 'selection',
        pageSize: 13,
        choices: [
            'View All Employees',
            'View Employees by Department',
            'View Employees by Manager',
            'Add Employee',
            'Update Employee',
            'Delete Employee',
            'View All Departments',
            'Add Department',
            'Delete Department',
            'View All Roles',
            'Add Role',
            'Delete Role',
            'Exit to console'
        ]
    },
];

function mainMenu() {
    inquirer
        .prompt(mainMenuOptions)
        .then((response) => {
            switch (response.selection) {
                case 'View All Employees':
                    viewEmployees(); // Works
                    break;
                case 'View Employees by Department':
                    viewDepartmentEmployees(); // Works
                    break;
                case 'View Employees by Manager':
                    viewEmployeesManagers(); // Works
                    break;
                case 'Update Employee':
                    getEmployeeList("update"); // Works
                    break;
                case 'Add Employee':
                    addEmployee(); // Works
                    break;
                case 'Delete Employee':
                    getEmployeeList("delete"); // Works
                    break;
                case 'View All Roles':
                    viewRoles(); // Works
                    break;
                case 'Add Role':
                    getDepartmentList("addRole"); // Works
                    break;
                case 'Delete Role':
                    getRoleList("delete"); // Works
                    break;
                case 'View All Departments':
                    viewDepartments(); // Works
                    break;
                case 'Add Department':
                    addDepartment(); // Works
                    break;
                case 'Delete Department':
                    getDepartmentList("delete"); // Works
                    break;
                case 'See budgets of departments':
                    getDepartmentList("budget"); // Not implemented
                    break;
                case 'Exit to console':
                    exit(); // Works
                    break;
            }
        });
};

async function viewEmployees() { // Query the database for all employees in the database and displays the result
    try {
        await pool.query(`SELECT employee.id,
                          CONCAT(employee.first_name, ' ', employee.last_name) AS employee_name, role.title AS job_title, role.salary, department.name AS department,
                          CONCAT(manager.first_name, ' ', manager.last_name) AS manager
                          FROM employee
                          LEFT JOIN employee manager ON employee.manager_id = manager.id
                          INNER JOIN role ON employee.role_id = role.id
                          INNER JOIN department ON role.department_id = department.id
                          ORDER BY employee.id;`,
                          function (err, { rows }) {
            console.clear();
            console.table(rows);
            console.log(`\n`);
            return mainMenu();
        });
    } catch (error) {
        console.error(error);
    }
};

async function viewDepartmentEmployees() { // Query the database for all employees in the database sorted by department and displays the result
    try {
        await pool.query(`SELECT department.id, department.name AS Department,
                        CONCAT(employee.first_name, ' ', employee.last_name) AS Employee_Name,
                        role.title AS Role_Title,
                        role.salary,
                        CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
                        FROM employee
                        LEFT JOIN employee manager ON employee.manager_id = manager.id
                        INNER JOIN role ON employee.role_id = role.id
                        INNER JOIN department ON role.department_id = department.id
                        ORDER BY department.name;`,
                        function (err, { rows }) {
                console.clear();
                console.table(rows);
                console.log(`\n`);
                return mainMenu();
            });
    } catch (error) {
        console.error(error);
    }
};

async function viewEmployeesManagers() { // Query the database for all employees in the database sorted by manager and displays the result
    try {
        await pool.query(`SELECT 
                        employee.manager_id,
                        CONCAT(manager.first_name, ' ', manager.last_name) AS Manager,
                        department.name AS Department,
                        CONCAT(employee.first_name, ' ', employee.last_name) AS Employee_Name,
                        role.title AS Role_Title,
                        role.salary
                        FROM employee
                        LEFT JOIN employee manager ON employee.manager_id = manager.id
                        INNER JOIN role ON employee.role_id = role.id
                        INNER JOIN department ON role.department_id = department.id
                        ORDER BY employee.manager_id;`,
                        function (err, { rows }) {
                console.clear();
                console.table(rows);
                console.log(`\n`);
                return mainMenu();
            });
    } catch (error) {
        console.error(error);
    }
};

async function viewDepartments() { // Query the database for all departments in the database and then displays the result
    try {
        await pool.query('SELECT * FROM department', function (err, { rows }) {
            console.clear();
            console.table(rows);
            console.log(`\n`);
            return mainMenu();
        });
    } catch (error) {
        console.error(error);
    }
};

async function viewRoles() { // Query the database for all roles in the database and then displays the result
    try {
        await pool.query('SELECT * FROM role;', function (err, { rows }) {
            console.clear();
            console.table(rows);
            console.log(`\n`);
            return mainMenu();
        });
    } catch (error) {
        console.error(error);
    }
};

/* Ran out of time for this, perhaps revisit it later
async function departmentBudget(departmentList){
    try {
        const question = [
            {
                type: 'list',
                message: 'Select the department to see their budget:',
                name: 'department',
                choices: departmentList
            }
        ];

        const answer = await inquirer.prompt(question);

        // Queries the database to view its budget
        await pool.query(`DELETE FROM department WHERE id = $1`, [answer.department]);

        await pool.query('SELECT department_id FROM department WHERE id = $1', [answer.department], function (err, { rows }) {
            console.clear();
            console.table(rows);
            console.log(`\n`);
            return mainMenu();
        });

    } catch (error) {
        console.error(error);
    }
}; */

async function addDepartment() { // Adds a department to the database, asking for what it should be named
    try {
        const question = [
            {
                type: 'input',
                message: 'Enter the department name:',
                name: 'departmentName',
                validate: (inputCheck) => {
                    if (inputCheck.length > 30) {
                        return "Department name is too long. Please enter up to 30 characters.";
                    } else { return true; }
                }
            }
        ];

        const answer = await inquirer.prompt(question);

        // Insert the department into the database with class constructor
        const newDepartment = await new Department(answer.departmentName);

        await console.log(`${answer.departmentName} successfully added to Departments!`);
        await console.log(`\n`);
        await mainMenu();
    } catch (error) {
        console.error(error);
    }
};

async function addRole(deptList) { // Adds a role to the database, asking for a title, salary and a department
    try {
        const question = [
            {
                type: 'input',
                message: 'Enter the role title:',
                name: 'roleTitle',
                validate: (inputCheck) => {
                    if (inputCheck.length > 30) {
                        throw new Error("Role title is too long. Please enter up to 30 characters.");
                    } else { return true; }
                }
            },
            {
                type: 'number',
                message: 'Enter salary for this role:',
                name: 'roleSalary',
                validate: (inputCheck) => {
                    if (typeof inputCheck !== 'number' || inputCheck <= 0) {
                        throw new Error("That's not a valid number for salary. Please enter a greater than 0 number only.");
                    } else { return true; }
                }
            },
            {
                type: 'list',
                message: 'Select the department for this role:',
                name: 'roleDepartment',
                choices: deptList
            }
        ];

        const answer = await inquirer.prompt(question);

        // Insert the role into the database with class constructor
        const newRole = await new Role(answer.roleTitle, answer.roleSalary, answer.roleDepartment);

        await console.log(`${answer.roleTitle} successfully added to Roles!`);
        await console.log(`\n`);
        await mainMenu();
    } catch (error) {
        console.error(error);
    }
};

async function addEmployee() { // Adds an employee to the database, asking for a first name, last name, role and a manager (if they have one)
    try {
        const question = [
            {
                type: 'input',
                message: 'Enter the employees first name:',
                name: 'fName',
                validate: (inputCheck) => {
                    if (inputCheck.length > 30) {
                        throw new Error("First name is too long. Please enter up to 30 characters.");
                    } else { return true; }
                }
            },
            {
                type: 'input',
                message: 'Enter the employees last name:',
                name: 'lName',
                validate: (inputCheck) => {
                    if (inputCheck.length > 30) {
                        throw new Error("Last name is too long. Please enter up to 30 characters.");
                    } else { return true; }
                }
            },
            {
                type: 'number',
                message: 'Enter the role id for this employee:',
                name: 'empRole',
                validate: (inputCheck) => {
                    if (typeof inputCheck !== 'number' || inputCheck <= 0) {
                        throw new Error("That's not a valid number for role. Please enter a number only.");
                    } else { return true; }
                }
            },
            {
                type: 'number',
                message: 'Enter manager ID for this employee (0 if they have no manager):',
                name: 'empManager',
                validate: (inputCheck) => {
                    if (typeof inputCheck !== 'number') {
                        throw new Error("That's not a valid number for manager. Please enter a number only.");
                    } else { return true; }
                }
            }
        ];

        const answer = await inquirer.prompt(question);

        // Insert the role into the database with class constructor
        const newEmployee = await new Employee(answer.fName, answer.lName, answer.empRole, answer.empManager);
        await console.log(`${answer.fName} ${answer.lName} successfully added to Employees!`);
        await console.log(`\n`);
        await mainMenu();
    } catch (error) {
        console.error(error);
    }
};

async function updateEmployee(employeeList) { // Updates an employee to change their role and/or manager
    try {
        const question = [
            {
                type: 'list',
                message: 'Select the employee to update:',
                name: 'employee',
                choices: employeeList
            },
            {
                type: 'number',
                message: 'Enter the new role ID for this employee:',
                name: 'empRole',
                validate: (inputCheck) => {
                    if (typeof inputCheck !== 'number' || inputCheck <= 0) {
                        throw new Error("That's not a valid number for role. Please enter a number only.");
                    } else { return true; }
                }
            },
            {
                type: 'number',
                message: 'Enter a new manager ID for this employee (0 if they have no manager):',
                name: 'empManager',
                validate: (inputCheck) => {
                    if (typeof inputCheck !== 'number') {
                        throw new Error("That's not a valid number for manager. Please enter a number only.");
                    } else { return true; }
                }
            }
        ];

        const answer = await inquirer.prompt(question);

        // Queries the database to update the employee role_id and manager_id
        if (answer.empManager == 0) {
            await pool.query(`UPDATE employee SET role_id = $1, manager_id = NULL WHERE id = $2`,
                [answer.empRole, answer.employee]);
        } else {
            await pool.query(`UPDATE employee SET role_id = $1, manager_id = NULL WHERE id = $3`,
                [answer.empRole, answer.empManager, answer.employee]);
        };


        await console.log(`Employee has been successfully updated!`);
        await console.log(`\n`);
        await mainMenu();
    } catch (error) {
        console.error(error);
    }
};

async function removeDepartment(departmentList) { // Removes a department from the database
    try {
        const question = [
            {
                type: 'list',
                message: 'Select the department to be removed:',
                name: 'department',
                choices: departmentList
            }
        ];

        const answer = await inquirer.prompt(question);

        // Queries the database to removes the department by id from the database
        await pool.query(`DELETE FROM department WHERE id = $1`, [answer.department]);

        await console.log(`Department has been successfully removed.`);
        await console.log(`\n`);
        await mainMenu();
    } catch (error) {
        console.error(error);
    }
};

async function removeEmployee(employeeList) { // Removes an employee from the database
    try {
        const question = [
            {
                type: 'list',
                message: 'Select the employee to be removed:',
                name: 'employee',
                choices: employeeList
            }
        ];

        const answer = await inquirer.prompt(question);

        // Queries the database to removes the department by id from the database
        await pool.query(`DELETE FROM employee WHERE id = $1`, [answer.employee]);

        await console.log(`${answer.employee} successfully removed from Departments!`);
        await console.log(`\n`);
        await mainMenu();
    } catch (error) {
        console.error(error);
    }
};

async function removeRole(roleList) { // Removes a role from the database
    try {
        const question = [
            {
                type: 'list',
                message: 'Select the role to be removed:',
                name: 'role',
                choices: roleList
            }
        ];

        const answer = await inquirer.prompt(question);

        // Queries the database to removes the role by id from the database
        await pool.query(`DELETE FROM role WHERE id = $1`, [answer.role]);

        await console.log(`Role has been successfully removed.`);
        await console.log(`\n`);
        await mainMenu();
    } catch (error) {
        console.error(error);
    }
};

async function getEmployeeList(operation) { // Queries the database for a list of employees
    try {
        await pool.query('SELECT id, first_name, last_name FROM employee', (err, { rows }) => {
            if (err) throw err;
            const empList = rows.map(({ id, first_name, last_name }) => ({
                value: id,
                name: `${first_name} ${last_name}`
            }));
            if (operation === "delete") {
                removeEmployee(empList); // Calls the removeEmployee function and passes it a list to use as a selection
            } else if (operation === "update") {
                updateEmployee(empList); // Calls the updateEmployee function and passes it a list to use as a selection
            } else {
                return empList;
            };
        });
    } catch (error) {
        console.error(error);
        return;
    };
};

async function getDepartmentList(operation) { // Queries the database for a list of departments
    try {
        await pool.query('SELECT id, name FROM department', (err, { rows }) => {
            if (err) throw err;
            const deptList = rows.map(({ id, name }) => ({
                value: id,
                name: `${name}`
            }));
            if (operation === "delete") { // Calls the removeDepartment function and passes it a list to use as a selection
                removeDepartment(deptList);
            } else if (operation === "addRole") { // Calls the addRole function and passes it a list to use as a selection
                addRole(deptList);
            } else if (operation == "budget") {
                departmentBudget(deptList);
            } else {
                return;
            }
        });
    } catch (error) {
        console.error(error);
        return;
    };
};

async function getRoleList(operation) { // Queries the database for a list of roles
    try {
        await pool.query('SELECT id, title FROM role', (err, { rows }) => {
            if (err) throw err;
            const roleList = rows.map(({ id, title }) => ({
                value: id,
                name: `${title}`
            }));
            if (operation === "delete") { // Calls the removeList function and passes it a list to use as a selection
                removeRole(roleList);
            } else if (operation === "add") { // Calls the addEmployee function and passes it a list to use as a selection
                addRole(roleList);
            } else {
                return roleList;
            };
        });
    } catch (error) {
        console.error(error);
        return;
    };
};

/* // I'd like to get this working so it's more universal but there's not enough time. Perhaps I can revisit it after turning it in.
async function getAllList(operation) { // Queries the database for a list of employees, roles and departments.
  try { 
      await pool.query('SELECT id, first_name, last_name FROM employee', (err, { rows }) => {
          if (err) throw err;
          const empList = rows.map(({ id, first_name, last_name }) => ({
            value: id,
            name: `${first_name} ${last_name}`}));
          if (operation === "delete"){
              removeEmployee(empList);
          } else if (operation === "update") {
              updateEmployee(empList);
          } else {
              console.log("Something went wrong!");
              return;
          };
      });
      await pool.query('SELECT id, title FROM role', (err, { rows }) => {
          if (err) throw err;
          const roleList = rows.map(({ id, title }) => ({
            value: id,
            name: `${title}`
          }));
          if (operation === "delete"){
              removeRole(roleList);
          } else if (operation === "add") {
              addRole(roleList);
          } else {
              console.log("Something went wrong!");
              return;
          };
      });
      await pool.query('SELECT id, name FROM department', (err, { rows }) => {
          if (err) throw err;
          const deptList = rows.map(({ id, name }) => ({
            value: id,
            name: `${name}`
          }));
          if (operation === "delete"){
              removeDepartment(deptList);
          } else if (operation === "addRole") {
              addRole(deptList);
          } else {
              console.log("Something went wrong!");
              return;
          };
      });
  } catch (error) {
      console.error(error);
      return;
  };
}; */

function exit() { // Exits the menu back to the console
    console.clear();
    console.log('Goodbye!');
    process.exit();
};

mainMenu(); // Starts the mainMenu on running index.js with node