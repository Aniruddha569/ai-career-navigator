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
  // Return known requirements or generate a generic one for any company
  return companyRequirements[companyName] || {
    coreSkills: ['Data Structures & Algorithms', 'Programming fundamentals', 'SQL', 'OOP Concepts'],
    frameworks: ['REST APIs', 'Version Control (Git)', 'Problem Solving'],
    softSkills: ['Communication', 'Team Collaboration', 'Adaptability'],
    focusAreas: ['Technical fundamentals', 'Project experience', 'Industry-relevant skills'],
  };
}

function getSupportedCompanies() {
  return Object.keys(companyRequirements);
}

module.exports = { companyRequirements, getCompanyRequirements, getSupportedCompanies };