const inquirer = require("inquirer"); // Importing packages
const pool = require('./config/connection.js'); // Postgres database connection
const Department = require('./models/department.js');
const Employee = require('./models/employee.js');
const Role = require('./models/role.js');

pool.connect();

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
                    getEmployeeList("update"); // Works. No manager = 0 doesn't seem to work?
                    break;
                case 'Add Employee':
                    addEmployee(); // Works, improvement?
                    break;
                case 'Delete Employee':
                    getEmployeeList("delete"); // Works
                    break;
                case 'View All Roles':
                    viewRoles(); // Works
                    break;
                case 'Add Role':
                    addRole(); // Works, improvement?
                    break;
                case 'Delete Role':
                    getRoleList(); // Works
                    break;
                case 'View All Departments':
                    viewDepartments(); // Works
                    break;
                case 'Add Department':
                    addDepartment(); // Works
                    break;
                case 'Delete Department':
                    getDepartmentList(); // Works
                    break;
                case 'See budget by department':
                    departmentBudget(); // Doesn't work
                    break;
                case 'Exit to console':
                    exit(); // Works
                    break;
            }
        });
};

async function viewEmployees() {
    try {
        // Query the database for all employees in the database
        await pool.query('SELECT * FROM employee;', function (err, { rows }) {
            console.clear();
            console.table(rows);
            console.log(`\n`);
            return mainMenu();
        });
    } catch (error) {
        console.error(error);
    }
};

async function viewDepartmentEmployees() {
    try {
        // Query the database for all employees in the database sorted by department
        await pool.query(`SELECT 
                        department.id,
                        department.name AS Department,
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

async function viewEmployeesManagers() {
    try {
        // Query the database for all employees in the database sorted by manager
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

async function viewDepartments() {
    try {
        // Query the database for all departments in the database
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

async function viewRoles() {
    try {
        // Query the database for all roles in the database
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

async function addDepartment() {
    try {
        const question = [
            {
                type: 'input',
                message: 'Enter the department name:',
                name: 'departmentName',
                validate: (textCheck) => {
                    if (textCheck.length > 30){
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

async function addRole() {
    try {
        const question = [
            {
                type: 'input',
                message: 'Enter the role title:',
                name: 'roleTitle',
                validate: (inputCheck) => {
                    if (inputCheck.length > 30){
                        throw new Error("Role title is too long. Please enter up to 30 characters.");
                    } else { return true; }
                  }
            },
            {
                type: 'number',
                message: 'Enter salary for this role:',
                name: 'roleSalary',
                validate: (inputCheck) => {
                    if (!inputCheck){
                        throw new Error("That's not a valid number for salary. Please enter a number only.");
                    } else { return true; }
                  }
            },
            {
                type: 'number',
                message: 'Enter department ID for this role:',
                name: 'roleDepartment',
                validate: (inputCheck) => {
                    if (!inputCheck){
                        throw new Error("That's not a valid number for department. Please enter a number only.");
                    } else { return true; }
                  }
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

async function addEmployee() {
    try {
        const question = [
            {
                type: 'input',
                message: 'Enter the employees first name:',
                name: 'fName',
                validate: (inputCheck) => {
                    if (inputCheck.length > 30){
                        throw new Error("First name is too long. Please enter up to 30 characters.");
                    } else { return true; }
                  }
            },
            {
                type: 'input',
                message: 'Enter the employees last name:',
                name: 'lName',
                validate: (inputCheck) => {
                    if (inputCheck.length > 30){
                        throw new Error("Last name is too long. Please enter up to 30 characters.");
                    } else { return true; }
                  }
            },
            {
                type: 'number',
                message: 'Enter the role id for this employee:',
                name: 'empRole',
                validate: (inputCheck) => {
                    if (!inputCheck){
                        throw new Error("That's not a valid number for salary. Please enter a number only.");
                    } else { return true; }
                  }
            },
            {
                type: 'number',
                message: 'Enter manager ID for this employee (0 if they have no manager):',
                name: 'empManager',
                validate: (inputCheck) => {
                    if (!inputCheck){
                        throw new Error("That's not a valid number for department. Please enter a number only.");
                    } else { return true; }
                  }
            }
        ];

        const answer = await inquirer.prompt(question);

        // Insert the role into the database with class constructor
		const newEmployee = await new Employee(answer.fName, answer.lName, answer.empRole, answer.empManager);
        await console.log(`${answer.fName} ${answer.lName} successfully added to Departments!`);
        await console.log(`\n`);
        await mainMenu();
    } catch (error) {
        console.error(error);
    }
};

async function updateEmployee(employeeList) {
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
                    if (!inputCheck){
                        throw new Error("That's not a valid number for salary. Please enter a number only.");
                    } else { return true; }
                  }
            },
            {
                type: 'number',
                message: 'Enter a new manager ID for this employee (0 if they have no manager):',
                name: 'empManager',
                validate: (inputCheck) => {
                    if (!inputCheck){
                        throw new Error("That's not a valid number for manager. Please enter a number only.");
                    } else { return true; }
                  }
            }
        ];

        const answer = await inquirer.prompt(question);
        await console.log(answer);

        // Queries the database to update the employee role_id and manager_id
		await pool.query(`UPDATE employee SET role_id = $1, manager_id = $2 WHERE id = $3`,
            [ answer.empRole, answer.empManager, answer.employee ]);

        await console.log(`Employee has been successfully updated!`);
        await console.log(`\n`);
        await mainMenu();
    } catch (error) {
        console.error(error);
    }
};

async function removeDepartment(departmentList) {
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
		await pool.query(`DELETE FROM department WHERE id = $1`, [ answer.department ]);

        await console.log(`Department has been successfully removed.`);
        await console.log(`\n`);
        await mainMenu();
    } catch (error) {
        console.error(error);
    }
};

async function removeEmployee(employeeList) {
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
		await pool.query(`DELETE FROM employee WHERE id = $1`, [ answer.employee ]);

        await console.log(`${answer.employee} successfully removed from Departments!`);
        await console.log(`\n`);
        await mainMenu();
    } catch (error) {
        console.error(error);
    }
};

async function removeRole(roleList) {
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
		await pool.query(`DELETE FROM role WHERE id = $1`, [ answer.role ]);

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
            if (operation === "delete"){
                removeEmployee(empList);
            } else if (operation === "update") {
                updateEmployee(empList);
            } else {
                console.log("Something went wrong!");
                return;
            };
        });
    } catch (error) {
        console.error(error);
        return;
    };
  };

  async function getDepartmentList() { // Queries the database for a list of departments and calls the removeDepartment function with the result
    try {
        await pool.query('SELECT id, name FROM department', (err, { rows }) => {
            if (err) throw err;
            const deptList = rows.map(({ id, name }) => ({
              value: id,
              name: `${name}`
            }));
            removeDepartment(deptList);
        });
    } catch (error) {
        console.error(error);
        return;
    };
  };

  async function getRoleList() { // Queries the database for a list of roles and calls the removeRole function with the result
    try {
        await pool.query('SELECT id, title FROM role', (err, { rows }) => {
            if (err) throw err;
            const roleList = rows.map(({ id, title }) => ({
              value: id,
              name: `${title}`
            }));
            removeRole(roleList);
        });
    } catch (error) {
        console.error(error);
        return;
    };
  };

function exit() {
    console.clear();    
    console.log('Goodbye!');
    process.exit();
};

mainMenu();