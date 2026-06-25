const Groq = require('groq-sdk');
const { getCompanyRequirements } = require('../utils/companyRequirements');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function cleanJsonResponse(rawText) {
  return rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
}

async function callGroqForJSON(prompt) {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_completion_tokens: 2048,
  });
  const rawText = completion.choices[0].message.content;
  const cleaned = cleanJsonResponse(rawText);
  try { return JSON.parse(cleaned); }
  catch (err) { throw new Error('AI returned an unexpected format. Please try again.'); }
}

async function analyzeResume(resumeText) {
  const prompt = `
You are an expert technical recruiter. Analyze the following resume and return ONLY a valid JSON object with EXACTLY this structure, no other text:
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
  return callGroqForJSON(prompt);
}

async function analyzeSkillGap(resumeText, targetCompany) {
  const knownRequirements = getCompanyRequirements(targetCompany);
  const isKnownCompany = ['SAP Labs', 'Amazon', 'Microsoft', 'Google'].includes(targetCompany);

  const requirementsText = isKnownCompany
    ? `Use these known requirements for ${targetCompany}: ${JSON.stringify(knownRequirements)}`
    : `Use your knowledge of ${targetCompany}'s specific internship/fresher hiring requirements for software engineering. Consider ${targetCompany}'s actual tech stack, domain, and what they specifically look for.`;

  const prompt = `
You are a strict technical recruiter evaluating a fresher resume for ${targetCompany}.

${requirementsText}

Resume: """${resumeText}"""

Analyze SPECIFICALLY for ${targetCompany}. Different companies have different requirements:
- TCS/Wipro/Infosys focus on: aptitude, communication, basic coding, trainability
- Product companies (Google/Amazon/Microsoft) focus on: DSA, system design, algorithms
- SAP focuses on: Java, enterprise software, SAP BTP, ABAP
- Startups focus on: full stack, deployment, quick learning

Give a UNIQUE and HONEST assessment for ${targetCompany} specifically.
matchPercentage must be calculated strictly based on how well THIS resume matches ${targetCompany}'s SPECIFIC requirements.

Return ONLY valid JSON:
{
  "matchedSkills": ["only skills relevant to ${targetCompany}"],
  "missingSkills": ["skills ${targetCompany} specifically needs that are missing"],
  "matchPercentage": <strict honest integer, varies per company>,
  "learningRoadmap": [{"skill": "", "priority": "<High|Medium|Low>", "suggestion": "specific to ${targetCompany}"}]
}`.trim();

  return callGroqForJSON(prompt);
}

async function generateInterviewQuestions(resumeText, targetCompany) {
  const requirements = getCompanyRequirements(targetCompany);
  const prompt = `
Generate interview questions for ${targetCompany} internship candidate.
Resume: """${resumeText}"""
Company requirements: ${JSON.stringify(requirements)}
Return ONLY valid JSON, no other text:
{
  "technicalQuestions": [<5-7 questions>],
  "hrQuestions": [<5 questions>],
  "dsaQuestions": [<5 questions>],
  "projectQuestions": [<4-6 questions>]
}`.trim();
  return callGroqForJSON(prompt);
}

module.exports = { analyzeResume, analyzeSkillGap, generateInterviewQuestions };