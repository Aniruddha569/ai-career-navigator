// backend/utils/companyRequirements.js
// Static reference data describing what each target company typically
// looks for in interns/new grads. This gets injected into the Gemini
// prompt for skill-gap analysis so the AI has concrete criteria to
// compare the resume against, instead of guessing.

const companyRequirements = {
  'SAP Labs': {
    coreSkills: ['Java', 'JavaScript', 'SQL', 'Data Structures & Algorithms', 'OOP Concepts', 'ABAP (preferred)'],
    frameworks: ['Spring Boot', 'SAP Fiori/UI5', 'Node.js', 'REST APIs'],
    softSkills: ['Communication', 'Problem Solving', 'Team Collaboration'],
    focusAreas: ['Enterprise software', 'Cloud (SAP BTP)', 'Clean coding practices'],
  },
  Amazon: {
    coreSkills: ['Data Structures & Algorithms', 'System Design Basics', 'Java/C++/Python', 'SQL'],
    frameworks: ['AWS fundamentals', 'Distributed Systems concepts', 'Object-Oriented Design'],
    softSkills: ['Leadership Principles (Amazon-specific)', 'Ownership', 'Customer Obsession'],
    focusAreas: ['Scalability', 'Time/Space Complexity', 'Behavioral STAR-format answers'],
  },
  Microsoft: {
    coreSkills: ['Data Structures & Algorithms', 'C#/C++/Java/Python', 'SQL', 'OOP Concepts'],
    frameworks: ['.NET (if applicable)', 'Azure fundamentals', 'REST APIs'],
    softSkills: ['Growth Mindset', 'Collaboration', 'Communication'],
    focusAreas: ['Problem solving approach', 'Clean code', 'Real-world project depth'],
  },
  Google: {
    coreSkills: ['Data Structures & Algorithms (strong)', 'Python/Java/C++', 'System Design Basics'],
    frameworks: ['Distributed Systems', 'APIs', 'Testing practices'],
    softSkills: ['Googliness (collaboration, comfort with ambiguity)', 'Communication'],
    focusAreas: ['Algorithmic efficiency', 'Scalable thinking', 'Strong CS fundamentals'],
  },
};

function getCompanyRequirements(companyName) {
  return companyRequirements[companyName] || null;
}

function getSupportedCompanies() {
  return Object.keys(companyRequirements);
}

module.exports = {
  companyRequirements,
  getCompanyRequirements,
  getSupportedCompanies,
};