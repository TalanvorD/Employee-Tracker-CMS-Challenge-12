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
            'Quit'
        ]
    },
];

function mainMenu() {
    inquirer
        .prompt(mainMenuOptions)
        .then((response) => {
            switch (response.selection) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'View Employees by Department':
                    viewDepartmentEmployees();
                    break;
                case 'View Employees by Manager':
                    viewEmployeesManagers();
                    break;
                case 'Update Employee':
                    updateEmployee();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Delete Employee':
                    deleteEmployee();
                    break;
                case 'View All Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Delete Role':
                    deleteRole();
                    break;
                case 'View All Departments':
                    viewDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Delete Department':
                    deleteEmployee();
                    break;
                case 'See budget by department':
                    departmentBudget();
                    break;
                case 'Quit':
                    quit();
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

async function viewDepartmentEmployees() { // This needs to be fixed!!!!!!!!!!!!!!!!
    try {
        // Query the database for all employees in the database by department
        await pool.query(`SELECT * FROM employee;`,
             function (err, { rows }) {
            console.log(rows);
        });
        await mainMenu();
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
                message: 'Enter manager ID for this employee (0 if there is no manager):',
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

function quit() {
    console.clear();    
    console.log('Goodbye!');
    process.exit();
};

mainMenu();