const fs = require('fs');
const inquirer = require('inquirer');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const Engineer = require('./lib/Engineer');
const Intern = require('./lib/Intern');
const Manager = require('./lib/Manager');
const ejs = require('ejs');

const employeeArray = [];

function promptQuestions() {
    return inquirer
        .prompt([
            {
                type: "input",
                message: "What is your name?",
                name: "name"
            },
            {
                type: "input",
                message: "What is your ID?",
                name: "id"
            },
            {
                type: "input",
                message: "What is your email address?",
                name: "email"
            },
            {
                type: "list",
                message: "What is your role in the company?",
                name: "role",
                choices: [
                    "Manager",
                    "Engineer",
                    "Intern"
                ]
            }
        ])
}

async function generateEmployeeSummary() {
    try {
        let continuePrompting = true;
        while (continuePrompting) {
            const answers = await promptQuestions();
            const { name, email, id, role } = answers;
            switch (role) {
                case "Manager":
                    const officeRes = await inquirer.prompt(
                        {
                            type: "input",
                            message: "What is your office number?",
                            name: "office"
                        })
                    const { office } = officeRes;
                    const manager = new Manager(name, email, id, office);
                    employeeArray.push(manager);
                    break;
                case "Engineer":
                    const githubRes = await inquirer.prompt(
                        {
                            type: "input",
                            message: "What is your github username?",
                            name: "github"
                        })
                    const { github } = githubRes;
                    const engineer = new Engineer(name, email, id, github);
                    employeeArray.push(engineer);
                    break;
                case "Intern":
                    const schoolRes = await inquirer.prompt(
                        {
                            type: "input",
                            message: "What is your school name?",
                            name: "school"
                        })
                    const { school } = schoolRes
                    const intern = new Intern(name, email, id, school);
                    employeeArray.push(intern);
                    break;
            }

            const addEmployee = await inquirer.prompt({
                type: "list",
                message: "ADD MORE EMPLOYEES?",
                name: "add",
                choices: [
                    "yes",
                    "no"
                ]
            })
            if (addEmployee.add === "no") {
                continuePrompting = false;
            }
        }

        const finalHTML = await ejs.renderFile("./templates/main.html", { employeeArray });
        await writeFileAsync("./output/team.html", finalHTML, 'utf-8');
    }

    catch (err) {
        console.log(err)
    }
}
generateEmployeeSummary();


