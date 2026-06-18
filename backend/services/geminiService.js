const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getCompanyRequirements } = require('../utils/companyRequirements');

// Set to true to use mock data (when Gemini quota is exhausted)
const USE_MOCK = true;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

function cleanJsonResponse(rawText) {
  return rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
}

async function callGeminiForJSON(prompt) {
  const result = await model.generateContent(prompt);
  const rawText = result.response.text();
  const cleaned = cleanJsonResponse(rawText);
  try { return JSON.parse(cleaned); }
  catch (err) { throw new Error('AI returned an unexpected format. Please try again.'); }
}

// ── MOCK DATA ──────────────────────────────────────────────
function getMockAnalysis() {
  return {
    resumeScore: 72,
    atsScore: 68,
    sapReadinessScore: 65,
    strengths: [
      "Strong foundation in Data Structures and Algorithms",
      "Hands-on project experience with React and Node.js",
      "Good academic record from a reputed institution",
      "Relevant internship or project experience listed"
    ],
    weaknesses: [
      "Resume lacks quantifiable achievements (numbers/impact)",
      "No mention of system design experience",
      "Missing cloud platform experience (AWS/Azure/GCP)",
      "Summary/objective section could be stronger"
    ],
    missingSkills: ["Docker", "Kubernetes", "System Design", "AWS", "Spring Boot"],
    improvementSuggestions: [
      "Add metrics to your project descriptions (e.g. 'improved load time by 40%')",
      "Include a brief professional summary at the top of your resume",
      "Add a skills section with categorized technical skills",
      "Mention any open source contributions or GitHub activity",
      "Include relevant certifications (AWS, Google Cloud, etc.)"
    ]
  };
}

function getMockSkillGap(targetCompany) {
  return {
    matchedSkills: ["JavaScript", "React", "Node.js", "SQL", "Data Structures", "OOP"],
    missingSkills: ["Spring Boot", "SAP BTP", "Docker", "System Design", "ABAP"],
    matchPercentage: 62,
    learningRoadmap: [
      { skill: "System Design", priority: "High", suggestion: "Study Grokking the System Design Interview, practice designing URL shortener, chat app" },
      { skill: "Spring Boot", priority: "High", suggestion: "Build a REST API project using Spring Boot and deploy it on GitHub" },
      { skill: "Docker", priority: "Medium", suggestion: "Containerize your existing Node.js project, learn docker-compose" },
      { skill: "SAP BTP", priority: "Medium", suggestion: "Complete the free SAP BTP beginner course on SAP Learning Hub" },
      { skill: "ABAP", priority: "Low", suggestion: "Go through SAP's free ABAP trial environment and basic tutorials" }
    ]
  };
}

function getMockInterviewQuestions(targetCompany) {
  return {
    technicalQuestions: [
      `Explain the difference between REST and GraphQL APIs. Which would you use for ${targetCompany}'s use case?`,
      "What is the difference between SQL JOIN types? Write a query using LEFT JOIN.",
      "Explain the concept of closures in JavaScript with an example.",
      "What is the time complexity of common sorting algorithms?",
      "How does React's virtual DOM work and why is it efficient?",
      "Explain the MVC architecture pattern with an example."
    ],
    hrQuestions: [
      `Why do you want to intern at ${targetCompany} specifically?`,
      "Tell me about a time you faced a technical challenge and how you overcame it.",
      "Describe a project you're most proud of and your specific contribution.",
      "How do you handle tight deadlines and multiple priorities?",
      "Where do you see yourself in 5 years in the tech industry?"
    ],
    dsaQuestions: [
      "Given an array, find two numbers that sum to a target value. (Two Sum)",
      "Implement a stack using two queues.",
      "Find the longest common subsequence of two strings.",
      "Check if a binary tree is balanced.",
      "Implement binary search on a rotated sorted array."
    ],
    projectQuestions: [
      "Walk me through the architecture of your most complex project.",
      "What was the biggest technical challenge in your projects and how did you solve it?",
      "How did you handle state management in your React projects?",
      "What would you improve in your existing projects if you had more time?",
      "How did you ensure the security of your backend APIs?"
    ]
  };
}
// ── END MOCK DATA ──────────────────────────────────────────

async function analyzeResume(resumeText) {
  if (USE_MOCK) return getMockAnalysis();
  const prompt = `
You are an expert technical recruiter. Analyze the following resume and return ONLY a valid JSON object with EXACTLY this structure:
{
  "resumeScore": <integer 0-100>,
  "atsScore": <integer 0-100>,
  "sapReadinessScore": <integer 0-100>,
  "strengths": [<3-6 strings>],
  "weaknesses": [<3-6 strings>],
  "missingSkills": [<array of strings>],
  "improvementSuggestions": [<4-6 strings>]
}
Resume: """${resumeText}"""`.trim();
  return callGeminiForJSON(prompt);
}

async function analyzeSkillGap(resumeText, targetCompany) {
  if (USE_MOCK) return getMockSkillGap(targetCompany);
  const requirements = getCompanyRequirements(targetCompany);
  if (!requirements) throw new Error(`Unsupported target company: ${targetCompany}`);
  const prompt = `
Compare this resume against ${targetCompany} requirements: ${JSON.stringify(requirements)}
Resume: """${resumeText}"""
Return ONLY valid JSON:
{
  "matchedSkills": [],
  "missingSkills": [],
  "matchPercentage": <integer 0-100>,
  "learningRoadmap": [{"skill": "", "priority": "<High|Medium|Low>", "suggestion": ""}]
}`.trim();
  return callGeminiForJSON(prompt);
}

async function generateInterviewQuestions(resumeText, targetCompany) {
  if (USE_MOCK) return getMockInterviewQuestions(targetCompany);
  const requirements = getCompanyRequirements(targetCompany);
  const prompt = `
Generate interview questions for ${targetCompany} internship candidate.
Resume: """${resumeText}"""
Return ONLY valid JSON:
{
  "technicalQuestions": [<5-7 questions>],
  "hrQuestions": [<5 questions>],
  "dsaQuestions": [<5 questions>],
  "projectQuestions": [<4-6 questions>]
}`.trim();
  return callGeminiForJSON(prompt);
}

module.exports = { analyzeResume, analyzeSkillGap, generateInterviewQuestions };