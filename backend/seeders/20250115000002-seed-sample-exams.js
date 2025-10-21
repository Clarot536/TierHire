'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Get domain IDs
    const domains = await queryInterface.sequelize.query(
      'SELECT domain_id, domain_name FROM "Domains"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const exams = [];
    const questions = [];

    // Create initial assessment exams for each domain
    for (const domain of domains) {
      // Initial Assessment Exam
      const initialExam = {
        domain_id: domain.domain_id,
        exam_name: `${domain.domain_name} - Initial Assessment`,
        exam_type: 'INITIAL',
        description: `Comprehensive assessment to determine your initial tier placement in ${domain.domain_name}`,
        duration_minutes: 90,
        total_questions: 20,
        passing_score: 40,
        is_active: true,
        created_by: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      exams.push(initialExam);

      // Shifting Contest Exam
      const shiftingExam = {
        domain_id: domain.domain_id,
        exam_name: `${domain.domain_name} - Shifting Contest`,
        exam_type: 'SHIFTING',
        description: `Monthly shifting contest for tier reassessment in ${domain.domain_name}`,
        duration_minutes: 120,
        total_questions: 25,
        passing_score: 50,
        is_active: true,
        created_by: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      exams.push(shiftingExam);

      // Internal Contest Exam
      const internalExam = {
        domain_id: domain.domain_id,
        exam_name: `${domain.domain_name} - Internal Contest`,
        exam_type: 'INTERNAL',
        description: `Weekly internal contest to maintain activity and improve rankings`,
        duration_minutes: 60,
        total_questions: 15,
        passing_score: 30,
        is_active: true,
        created_by: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      exams.push(internalExam);
    }

    // Insert exams and get their IDs
    const insertedExams = await queryInterface.bulkInsert('Exams', exams, { returning: true });

    // Create sample questions for each exam
    for (const exam of insertedExams) {
      const domainName = domains.find(d => d.domain_id === exam.domain_id)?.domain_name;
      
      // Create different types of questions based on domain
      const sampleQuestions = generateSampleQuestions(exam, domainName);
      questions.push(...sampleQuestions);
    }

    await queryInterface.bulkInsert('Questions', questions);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Questions', null, {});
    await queryInterface.bulkDelete('Exams', null, {});
  }
};

function generateSampleQuestions(exam, domainName) {
    const questions = [];
    const questionCount = Math.min(exam.total_questions, 5); // Limit for seeding

    for (let i = 1; i <= questionCount; i++) {
      let questionType, questionText, options, correctAnswer, difficulty;

      switch (domainName) {
        case 'Data Structures & Algorithms':
          questionType = 'CODING';
          questionText = `Implement a function to find the maximum element in a binary tree. The function should return the value of the maximum element.`;
          correctAnswer = `function findMax(node) {
  if (!node) return Number.MIN_SAFE_INTEGER;
  const leftMax = findMax(node.left);
  const rightMax = findMax(node.right);
  return Math.max(node.val, leftMax, rightMax);
}`;
          difficulty = i <= 2 ? 'EASY' : i <= 4 ? 'MEDIUM' : 'HARD';
          break;

        case 'Web Development':
          questionType = i <= 2 ? 'MULTIPLE_CHOICE' : 'CODING';
          if (questionType === 'MULTIPLE_CHOICE') {
            questionText = `Which React hook is used to perform side effects in functional components?`;
            options = [
              'useEffect',
              'useState', 
              'useContext',
              'useReducer'
            ];
            correctAnswer = 'useEffect';
          } else {
            questionText = `Create a React component that displays a list of users fetched from an API. The component should show loading state and handle errors.`;
            correctAnswer = `function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`;
          }
          difficulty = i <= 2 ? 'EASY' : i <= 4 ? 'MEDIUM' : 'HARD';
          break;

        case 'Database Management':
          questionType = i <= 3 ? 'SQL' : 'MULTIPLE_CHOICE';
          if (questionType === 'SQL') {
            questionText = `Write a SQL query to find the second highest salary from the employees table.`;
            correctAnswer = `SELECT MAX(salary) as second_highest_salary
FROM employees 
WHERE salary < (SELECT MAX(salary) FROM employees);`;
          } else {
            questionText = `Which SQL clause is used to filter groups in a GROUP BY query?`;
            options = ['WHERE', 'HAVING', 'FILTER', 'GROUP WHERE'];
            correctAnswer = 'HAVING';
          }
          difficulty = i <= 2 ? 'EASY' : i <= 4 ? 'MEDIUM' : 'HARD';
          break;

        case 'Machine Learning':
          questionType = i <= 2 ? 'MULTIPLE_CHOICE' : 'CODING';
          if (questionType === 'MULTIPLE_CHOICE') {
            questionText = `Which algorithm is commonly used for binary classification problems?`;
            options = ['K-Means', 'Linear Regression', 'Logistic Regression', 'DBSCAN'];
            correctAnswer = 'Logistic Regression';
          } else {
            questionText = `Implement a function to calculate the accuracy of a classification model given true labels and predicted labels.`;
            correctAnswer = `def calculate_accuracy(y_true, y_pred):
    correct = sum(1 for true, pred in zip(y_true, y_pred) if true == pred)
    total = len(y_true)
    return correct / total if total > 0 else 0`;
          }
          difficulty = i <= 2 ? 'EASY' : i <= 4 ? 'MEDIUM' : 'HARD';
          break;

        case 'DevOps & Cloud':
          questionType = i <= 3 ? 'MULTIPLE_CHOICE' : 'TEXT';
          if (questionType === 'MULTIPLE_CHOICE') {
            questionText = `Which AWS service is used for container orchestration?`;
            options = ['EC2', 'ECS', 'Lambda', 'S3'];
            correctAnswer = 'ECS';
          } else {
            questionText = `Explain the difference between horizontal and vertical scaling in cloud computing.`;
            correctAnswer = `Horizontal scaling (scaling out) involves adding more machines to handle increased load, while vertical scaling (scaling up) involves adding more power (CPU, RAM) to existing machines.`;
          }
          difficulty = i <= 2 ? 'EASY' : i <= 4 ? 'MEDIUM' : 'HARD';
          break;

        default:
          questionType = 'MULTIPLE_CHOICE';
          questionText = `Sample question for ${domainName}`;
          options = ['Option A', 'Option B', 'Option C', 'Option D'];
          correctAnswer = 'Option A';
          difficulty = 'EASY';
      }

      questions.push({
        exam_id: exam.exam_id,
        question_type: questionType,
        question_text: questionText,
        options: options ? JSON.stringify(options) : null,
        correct_answer: correctAnswer,
        test_cases: questionType === 'CODING' ? JSON.stringify([
          { input: 'test case 1', expected: 'expected output 1' },
          { input: 'test case 2', expected: 'expected output 2' }
        ]) : null,
        points: difficulty === 'EASY' ? 10 : difficulty === 'MEDIUM' ? 15 : 20,
        difficulty: difficulty,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return questions;
}
