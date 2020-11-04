const inquirer = require("inquirer");
const mysql = require("mysql");
require("console.table");

let connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Lumberjack12",
    database: "company_db"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    main();
});

function main() {
    inquirer.prompt([{
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: ["View Departments", "View Employees", "View Employee Roles", "Add Department", "Add Employee", "Add Employee Role", "Update Employee Role", "Exit"]
    }]).then(answers => {
        if (answers.choices === "View Departments") {
            viewDepartments();
        } else if (answers.choices === "View Employees") {
            viewEmployees();
        } else if (answers.choices === "View Employee Roles") {
            viewEmployeeRoles();
        } else if (answers.choices === "Add Department") {
            addDepartment();
        } else if (answers.choices === "Add Employee") {
            addEmployee();
        } else if (answers.choices === "Add Employee Role") {
            addEmployeeRole();
        } else if (answers.choices === "Update Employee Role") {
            updateEmployeeRole();
        } else if (answers.choices === "Exit") {
            connection.end();
        }
    })
};

function viewDepartments() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        console.table(res);
        main();
    })
};

function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "newDepartment",
        message: "What is your new department?"
    }).then(answers => {
        connection.query("INSERT INTO department SET ?", {
            name: answers.newDepartment
        }, function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " department inserted!\n");
            main();
        })
    })
};

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        main();
    })
};

function updateEmployeeRole() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        inquirer.prompt([{
                type: "input",
                name: "employeeID",
                message: "What is the employee's ID?"
            },
            {
                type: "input",
                name: "roleID",
                message: "What is the employee's new role ID?"
            }
        ]).then(answers => {
            connection.query("UPDATE employee SET ? WHERE ?", [{
                        role_id: answers.roleID
                    },
                    {
                        id: answers.employeeID
                    }
                ],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + " employee role updated!\n");
                    main();
                })
        })
    })
};

function addEmployee() {
    inquirer.prompt([{
            type: "input",
            name: "employeeFirstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "employeeLastName",
            message: "What is the employee's last name?"
        },
        {
            type: "input",
            name: "employeeRoleID",
            message: "What is the employee's role ID?"
        },
        {
            type: "input",
            name: "employeeManagerID",
            message: "What is the employee's manager ID?"
        },
    ]).then(answers => {
        connection.query(
            "INSERT INTO employee SET ?", {
                first_name: answers.employeeFirstName,
                last_name: answers.employeeLastName,
                role_id: answers.employeeRoleID,
                manager_id: answers.employeeManagerID
            },
            function (err, res) {
                if (err) throw err;
                console.log(res.affectedRows + " employee added!\n");
                main();
            })
    })
};

function addEmployeeRole() {
    inquirer.prompt([{
        type: "input",
        name: "employeeTitle",
        message: "What is the employee's title?"
    },
    {
        type: "input",
        name: "employeeSalary",
        message: "What is the employee's salary?"
    },
    {
        type: "input",
        name: "employeeDepartmentID",
        message: "What is the employee's department id?"
    },
]).then(answers => {
    connection.query(
        "INSERT INTO role SET ?", {
            title: answers.employeeTitle,
            salary: answers.employeeSalary,
            department_id: answers.employeeDepartmentID
        },
        function (err, res) {
            if (err) throw err;
            console.log(res.affectedRows + " employee role added!\n");
            main();
        })
})
};

function viewEmployeeRoles() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);
        main();
    })
}