// Central content model for both index and project detail pages.
export const portfolioData = {
  name: "Midhun G Kaimal",
  role: "Full-Stack Developer | Product Engineer",
  heroSubtext:
    "I design and build product-focused web experiences with clean architecture, thoughtful UI, and reliable backend systems.",
  resumeUrl: "./Midhun-G-Kaimal.pdf",
  email: "midhungkaimal@gmail.com",
  about: {
    bio: "I am a full-stack developer who enjoys translating ambiguous product ideas into reliable digital systems. My focus is on clear user journeys, maintainable code, and measurable outcomes.",
    strengths: [
      "Product-first engineering decisions",
      "Performance-aware frontend architecture",
      "Pragmatic backend and API design"
    ],
    tools: ["JavaScript", "TypeScript", "Python", "Django", "Node.js", "PostgreSQL", "Figma"]
  },
  socials: [
    { label: "GitHub", url: "https://github.com/Midhungirish2002" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/midhun-g-kaimal2002" }
  ],
  skills: [
    {
      category: "Frontend",
      items: ["HTML5", "CSS3", "JavaScript", "React", "Accessible UI", "Responsive Systems"]
    },
    {
      category: "Backend",
      items: ["Node.js", "Express", "Django", "REST APIs", "JWT Auth", "WebSockets"]
    },
    {
      category: "Data & Infra",
      items: ["PostgreSQL", "MongoDB", "Redis", "Docker", "CI/CD", "AWS Basics"]
    }
  ],
  // Required project structure: id, title, year, role, description, repoUrl, tags, detail.
  projects: [
    {
      id: "online-learning",
      title: "Online Learning Platform",
      year: "2026",
      role: "Full-Stack Developer",
      description:
        "Role-based LMS with course creation, lesson progress tracking, quizzes, and discussion features.",
      summary:
        "A complete learning platform built for students, instructors, and admins with secure auth and dashboard analytics.",
      repoUrl: "https://github.com/Midhungirish2002/online-learning",
      tags: ["Django", "React", "PostgreSQL", "JWT", "WebSockets"],
      screenshots: [
        { label: "Student Dashboard", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80" },
        { label: "Instructor Course View", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80" }
      ],
      detail: {
        challenge:
          "Traditional LMS products often become complex and fragmented when multiple user roles and workflows are added.",
        solution:
          "Introduced a role-driven architecture with clean API boundaries so each user type gets focused actions without UI clutter.",
        features: [
          "Course publishing and enrollment flow",
          "Lesson completion and quiz attempts",
          "Discussion threads with notifications",
          "Admin analytics overview"
        ]
      }
    },
    {
      id: "healtrip",
      title: "HealTrip",
      year: "2026",
      role: "Product Engineer",
      description:
        "Travel planning concept that blends destination discovery with wellness constraints and preferences.",
      summary:
        "A concept product for health-aware trip planning where users can evaluate destinations and itineraries around personal wellness factors.",
      repoUrl: "https://github.com/Midhungirish2002/healtrip",
      tags: ["JavaScript", "UX", "Planning Engine", "API-Ready"],
      screenshots: [
        { label: "Trip Discovery", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80" },
        { label: "Wellness Filters", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80" }
      ],
      detail: {
        challenge:
          "Most travel tools optimize only for price or popularity and ignore health or wellness context.",
        solution:
          "Built a clear planning workflow that integrates destination inspiration with wellness-centered constraints.",
        features: [
          "Intent-based destination filtering",
          "Wellness profile aware itinerary suggestions",
          "Modular planning components for rapid iteration"
        ]
      }
    },
    {
      id: "alera",
      title: "ALERA",
      year: "2026",
      role: "Full-Stack + ML Integration",
      description:
        "Healthcare-focused web application integrating prediction flows with understandable user interfaces.",
      summary:
        "An AI-assisted health platform prototype combining model outputs with user-friendly, guided multi-step interactions.",
      repoUrl: "https://github.com/Midhungirish2002/ALERA",
      tags: ["Python", "Flask", "Machine Learning", "Healthcare UX"],
      screenshots: [
        { label: "Prediction Flow", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80" }
      ],
      detail: {
        challenge:
          "Healthcare prediction tools can be confusing and untrustworthy when outputs are presented without context.",
        solution:
          "Designed a transparent interaction model with guided steps and clear explanations around prediction outcomes.",
        features: [
          "Guided health input workflow",
          "Model output summaries with readable language",
          "Modular app structure for future model updates"
        ]
      }
    }
  ]
};
