const inquirer = require("inquirer"); // Importing packages
const pool = require('./config/connection.js'); // Postgres database connection
const Department = require('./models/department.js');

pool.connect();

const mainMenuOptions = [ // Array to hold the prompts for the main menu list
    {
        type: 'list',
        message: "What would you like to do:",
        name: 'selection',
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
            console.table(rows);
        });
        // promptUser();
    } catch (error) {
        console.error(error);
    }
};

async function viewDepartmentEmployees() {
    try {
        // Query the database for all employees in the database by department
        await pool.query(`SELECT * FROM employee;`,
             function (err, { rows }) {
            console.log(rows);
        });
        // promptUser();
    } catch (error) {
        console.error(error);
    }
};

async function viewDepartments() {
    try {
        // Query the database for all departments in the database
        await pool.query('SELECT * FROM department', function (err, { rows }) {
            console.table(rows);
        });
        // promptUser();
    } catch (error) {
        console.error(error);
    }
};

async function viewRoles() {
    try {
        // Query the database for all roles in the database
        await pool.query('SELECT * FROM role;', function (err, { rows }) {
            console.table(rows);
        });
        // promptUser();
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
                name: 'departmentName'
            }
        ];

        const answer = await inquirer.prompt(question);

        // Insert the department into the database with class constructor
		const newDepartment = await new Department(answer.departmentName);

        console.log(`${answer.departmentName} successfully added to Departments!`);
        //init();
    } catch (error) {
        console.error(error);
    }
};

function quit() {
        console.log('Goodbye!');
        process.exit();
};

mainMenu();