import React, { createContext, useContext, useState, useEffect } from 'react';

export const PERSONAS = {
  'school-cbse': {
    id: 'school-cbse',
    title: 'School Student (CBSE)',
    shortTitle: 'CBSE School',
    roleGroup: 'School',
    badge: 'CBSE Class 9-12 CS / IP',
    iconName: 'School',
    color: '#3b82f6',
    description: 'Curated for CBSE Curriculum: Python coding, Logic, Relational SQL, and Web basics.',
    recommendedTracks: ['python', 'sql', 'web-foundations', 'scratch-logic'],
    recommendedLangs: ['python', 'sql', 'html-css', 'scratch'],
    interviewFocus: ['School Board Exams', 'Python Fundamentals', 'SQL Queries', 'Logic Building']
  },
  'school-icse': {
    id: 'school-icse',
    title: 'School Student (ICSE / ISC)',
    shortTitle: 'ICSE/ISC School',
    roleGroup: 'School',
    badge: 'ICSE / ISC Class 9-12 Java',
    iconName: 'GraduationCap',
    color: '#8b5cf6',
    description: 'Curated for ICSE/ISC Curriculum: Java OOP, Number Theory, Arrays, Functions & Logic.',
    recommendedTracks: ['java-core', 'scratch-logic', 'sql', 'web-foundations'],
    recommendedLangs: ['java', 'scratch', 'sql', 'html-css'],
    interviewFocus: ['ICSE Java OOP', 'String & Array Manipulations', 'Loops & Patterns']
  },
  'college-cse': {
    id: 'college-cse',
    title: 'College Student (CSE / IT Degree)',
    shortTitle: 'College (CSE)',
    roleGroup: 'College',
    badge: 'B.Tech / B.E. / BCA / MCA',
    iconName: 'BookOpen',
    color: '#10b981',
    description: 'Curated for Engineering Placements: C Fundamentals, C++ & DSA, Core Java, SQL & Web Stack.',
    recommendedTracks: ['cpp-dsa', 'c-systems', 'java-core', 'sql', 'nodejs', 'python'],
    recommendedLangs: ['cpp', 'c', 'java', 'sql', 'node', 'python', 'html-css'],
    interviewFocus: ['Campus Placements', 'Data Structures & Algorithms', 'C Pointers & Memory', 'DBMS Normalization']
  },
  'it-professional': {
    id: 'it-professional',
    title: 'IT Professional / Working Engineer',
    shortTitle: 'IT Professional',
    roleGroup: 'Professional',
    badge: 'Senior & Architecture Track',
    iconName: 'Briefcase',
    color: '#f59e0b',
    description: 'Curated for Senior Engineers: Spring Boot, AWS Cloud, GraphQL, Node.js Microservices & System Design.',
    recommendedTracks: ['aws', 'springboot', 'nodejs', 'graphql', 'python'],
    recommendedLangs: ['java', 'node', 'python', 'graphql', 'sql'],
    interviewFocus: ['System Design', 'Spring Boot Microservices', 'AWS Cloud Architecture', 'High Throughput API Design']
  },
  'general-learner': {
    id: 'general-learner',
    title: 'General Learner / Career Switcher',
    shortTitle: 'General Learner',
    roleGroup: 'General',
    badge: 'Self-Paced Practical Dev',
    iconName: 'Sparkles',
    color: '#ec4899',
    description: 'Curated for rapid practical coding: Python scripting, HTML/CSS/JS frontend, and SQL querying.',
    recommendedTracks: ['python', 'web-foundations', 'sql', 'scratch-logic'],
    recommendedLangs: ['python', 'html-css', 'node', 'sql', 'scratch'],
    interviewFocus: ['Core Programming Logic', 'Web Development Fundamentals', 'Practical Project Building']
  }
};

const STORAGE_KEY = 'edu_hub_user_preference_v1';

const UserPreferenceContext = createContext();

export function UserPreferenceProvider({ children }) {
  const [personaId, setPersonaId] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && PERSONAS[saved]) {
        return saved;
      }
    } catch {
      // LocalStorage access fallback
    }
    return null; // Null indicates new user needing onboarding
  });

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  useEffect(() => {
    // If no preference saved, open onboarding automatically on initial visit
    if (!personaId) {
      setIsOnboardingOpen(true);
    }
  }, [personaId]);

  const selectPersona = (id) => {
    if (PERSONAS[id]) {
      setPersonaId(id);
      try {
        localStorage.setItem(STORAGE_KEY, id);
      } catch (e) {
        console.warn('Failed to save user preference to localStorage', e);
      }
      setIsOnboardingOpen(false);
    }
  };

  const activePersona = PERSONAS[personaId] || null;

  return (
    <UserPreferenceContext.Provider
      value={{
        personaId,
        activePersona,
        isOnboardingOpen,
        openPreferenceModal: () => setIsOnboardingOpen(true),
        closePreferenceModal: () => setIsOnboardingOpen(false),
        selectPersona,
        allPersonas: PERSONAS,
      }}
    >
      {children}
    </UserPreferenceContext.Provider>
  );
}

export function useUserPreference() {
  const context = useContext(UserPreferenceContext);
  if (!context) {
    throw new Error('useUserPreference must be used within a UserPreferenceProvider');
  }
  return context;
}
