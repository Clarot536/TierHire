'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Get domain IDs
    const domains = await queryInterface.sequelize.query(
      'SELECT domain_id, domain_name FROM "Domains"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const webDevDomain = domains.find(d => d.domain_name === 'Web Development');
    const dsaDomain = domains.find(d => d.domain_name === 'Data Structures & Algorithms');
    const sqlDomain = domains.find(d => d.domain_name === 'Database Management');

    const problems = [];

    // Web Development Problems
    if (webDevDomain) {
      problems.push(
        {
          title: "React Component Counter",
          description: "Create a React component that displays a counter with increment and decrement buttons.",
          difficulty: "EASY",
          domain_id: webDevDomain.domain_id,
          constraints: "Use React hooks (useState)",
          examples: JSON.stringify([
            {
              input: "Click increment button",
              output: "Counter increases by 1"
            }
          ]),
          test_files: JSON.stringify({
            tests: [
              {
                description: "Counter should start at 0",
                test: "expect(counter).toBe(0)"
              },
              {
                description: "Increment should increase counter by 1",
                test: "expect(increment()).toBe(1)"
              }
            ]
          }),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: "Todo List App",
          description: "Build a complete todo list application with add, delete, and mark as complete functionality.",
          difficulty: "MEDIUM",
          domain_id: webDevDomain.domain_id,
          constraints: "Use React with state management",
          examples: JSON.stringify([
            {
              input: "Add task 'Learn React'",
              output: "Task appears in list"
            }
          ]),
          test_files: JSON.stringify({
            tests: [
              {
                description: "Should add new todo item",
                test: "expect(addTodo('test')).toHaveLength(1)"
              },
              {
                description: "Should delete todo item",
                test: "expect(deleteTodo(1)).toHaveLength(0)"
              }
            ]
          }),
          created_at: new Date(),
          updated_at: new Date()
        }
      );
    }

    // DSA Problems
    if (dsaDomain) {
      problems.push(
        {
          title: "Two Sum",
          description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          difficulty: "EASY",
          domain_id: dsaDomain.domain_id,
          constraints: "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
          examples: JSON.stringify([
            {
              input: "nums = [2,7,11,15], target = 9",
              output: "[0,1]"
            }
          ]),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: "Reverse Linked List",
          description: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
          difficulty: "MEDIUM",
          domain_id: dsaDomain.domain_id,
          constraints: "The number of nodes in the list is the range [0, 5000]",
          examples: JSON.stringify([
            {
              input: "head = [1,2,3,4,5]",
              output: "[5,4,3,2,1]"
            }
          ]),
          created_at: new Date(),
          updated_at: new Date()
        }
      );
    }

    // SQL Problems
    if (sqlDomain) {
      problems.push(
        {
          title: "Find Customer Orders",
          description: "Write a SQL query to find all customers who have placed more than 5 orders.",
          difficulty: "EASY",
          domain_id: sqlDomain.domain_id,
          constraints: "Use standard SQL syntax",
          examples: JSON.stringify([
            {
              input: "Customers table with orders",
              output: "List of customers with >5 orders"
            }
          ]),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          title: "Employee Salary Analysis",
          description: "Find the average salary by department and rank departments by average salary.",
          difficulty: "MEDIUM",
          domain_id: sqlDomain.domain_id,
          constraints: "Include departments with no employees",
          examples: JSON.stringify([
            {
              input: "Employees and Departments tables",
              output: "Department rankings by average salary"
            }
          ]),
          created_at: new Date(),
          updated_at: new Date()
        }
      );
    }

    // Insert problems
    const insertedProblems = await queryInterface.bulkInsert('Problems', problems, { returning: true });

    // Create test cases for some problems
    const testCases = [];

    insertedProblems.forEach((problem, index) => {
      if (problem.title === "Two Sum") {
        testCases.push(
          {
            problem_id: problem.problem_id,
            input: JSON.stringify({ nums: [2, 7, 11, 15], target: 9 }),
            expected_output: JSON.stringify([0, 1]),
            is_hidden: false,
            created_at: new Date()
          },
          {
            problem_id: problem.problem_id,
            input: JSON.stringify({ nums: [3, 2, 4], target: 6 }),
            expected_output: JSON.stringify([1, 2]),
            is_hidden: true,
            created_at: new Date()
          }
        );
      }
    });

    if (testCases.length > 0) {
      await queryInterface.bulkInsert('Test_Cases', testCases);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Test_Cases', null, {});
    await queryInterface.bulkDelete('Problems', null, {});
  }
};
