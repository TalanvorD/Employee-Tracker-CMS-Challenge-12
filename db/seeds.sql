INSERT INTO department (name)
VALUES ('Sales'),
       ('Engineering'),
       ('Legal'),
       ('Customer Service'),
       ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Leader', 100000, 1),
       ('Salesperson', 80000, 1),
       ('Lead Engineer', 150000, 2),
       ('Software Engineer', 120000, 2),
       ('Account Manager', 1600000, 5),
       ('Accountant', 125000, 5),
       ('Legal Team Lead', 250000, 3),
       ('Lawyer', 190000, 3),
       ('Customer Service Manager', 100000, 4),
       ('Customer Service Rep', 75000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('M.', 'Bison', 1, NULL),
       ('Dee', 'Jay', 2, 1),
       ('Fei', 'Long', 3, NULL),
       ('Ken', 'Masters', 4, 3),
       ('Chun', 'Li', 5, NULL),
       ('El', 'Fuerte', 6, 5),
       ('Rainbow', 'Mika', 7, NULL),
       ('T.', 'Hawk', 8, 1),
       ('Cammy', 'White', 9, NULL),
       ('Shin', 'Akuma', 10, 9);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;