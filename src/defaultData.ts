import { PortfolioData } from './types';

export const defaultPortfolioData: PortfolioData = {
  personal: {
    name: "Kalpani Madhubhashini",
    role: "BICT Undergraduate | Faculty Of Technology | University of Sri Jayewardenepura",
    bio: "I am an ICT Undergraduate student passionate about designing and developing practical software solutions that solve real-world problems. I focus on web and mobile application development, with a strong interest in building user-friendly and efficient digital systems. One of my key projects is SkoolGo – a School Transport Management System, where I applied my skills in system design, development, and problem-solving to create a solution that improves school transport operations. I am continuously learning and improving my skills in web development, mobile app development, and UI/UX design. My goal is to grow as a full-stack developer and contribute to innovative technology solutions that create real impact.",
    email: "kalpanimadhubashini29@gmail.com",
    phone: "+94743124980",
    location: "Anuradhapura, Sri Lanka",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    facebook: "https://facebook.com",
    avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&h=500&fit=crop",
    stats: [
      { id: "stat-1", value: "2+", label: "ACADEMIC PROJECTS" },
      { id: "stat-2", value: "USJP", label: "UNDERGRADUATE" },
      { id: "stat-3", value: "BICT", label: "DEGREE FOCUS" },
      { id: "stat-4", value: "100%", label: "DEDICATION" }
    ],
    competencies: [
      {
        id: "comp-1",
        title: "Web & App Development",
        description: "Building hands-on, end-to-end web applications like SkoolGo and AutoCare to tackle real-world organizational challenges.",
        icon: "Code2"
      },
      {
        id: "comp-2",
        title: "User Interface Crafting",
        description: "Caring deeply about responsive web layouts, readable typography pairings, fluid interactions, and mobile usability.",
        icon: "Layout"
      },
      {
        id: "comp-3",
        title: "Database & Systems",
        description: "Designing structured relational schemas and managing databases using modern SQL and cloud-hosted data engines like Firebase.",
        icon: "Database"
      },
      {
        id: "comp-4",
        title: "Practical Problem Solving",
        description: "Translating complex user scenarios and logistical requirements into simple, reliable, and secure software applications.",
        icon: "Zap"
      }
    ]
  },
  projects: [
    {
      id: "proj-1",
      title: "SkoolGo - School Transport Management System",
      description: "An end-to-end transport management platform built to improve school commute logistics, track vehicles, and simplify transport administration.",
      tags: ["React", "Node.js", "Express", "PostgreSQL"],
      githubLink: "https://github.com",
      liveLink: "https://example.com",
      imageUrl: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=600&auto=format&fit=crop",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=600&auto=format&fit=crop", title: "SkoolGo Home Dashboard" },
        { type: "image", url: "https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=600&auto=format&fit=crop", title: "Route Planning Console" },
        { type: "video", url: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-laptop-34281-large.mp4", title: "System Demo Walkthrough" }
      ]
    },
    {
      id: "proj-2",
      title: "AutoCare - Vehicle Service Management System",
      description: "A vehicle service system designed to automate booking, manage service logs, and streamline operations for automotive service centers.",
      tags: ["React", "Tailwind CSS", "Firebase", "Express"],
      githubLink: "https://github.com",
      liveLink: "https://example.com",
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop",
      media: [
        { type: "image", url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop", title: "Service Booking Interface" },
        { type: "image", url: "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?q=80&w=600&auto=format&fit=crop", title: "Mechanic Status Tracker" }
      ]
    }
  ],
  experience: [
    {
      id: "exp-1",
      company: "Faculty of Technology, USJP",
      role: "Academic Projects Developer",
      duration: "2024 - Present",
      achievements: [
        "Led a team of undergraduates to architect and build SkoolGo, a multi-tenant transport manager reducing route computation overhead by 30%.",
        "Configured Firebase authentication rules and real-time database syncing protocols for a secure, responsive automotive CRM.",
        "Created wireframes and designed responsive UI templates with a strong focus on touch-target spacing and high-contrast color systems."
      ]
    }
  ],
  skills: [
    {
      id: "skill-1",
      category: "Frontend",
      list: ["TypeScript", "React / Next.js", "Tailwind CSS", "Motion (Framer)", "Redux / Zustand"],
      percentages: {
        "TypeScript": 92,
        "React / Next.js": 95,
        "Tailwind CSS": 98,
        "Motion (Framer)": 85,
        "Redux / Zustand": 88
      }
    },
    {
      id: "skill-2",
      category: "Backend",
      list: ["Node.js / Express", "PostgreSQL / SQL", "GraphQL / REST APIs", "Firebase / Firestore", "Docker / Cloud Run"],
      percentages: {
        "Node.js / Express": 90,
        "PostgreSQL / SQL": 85,
        "GraphQL / REST APIs": 90,
        "Firebase / Firestore": 82,
        "Docker / Cloud Run": 75
      }
    },
    {
      id: "skill-3",
      category: "Tools",
      list: ["Git & GitHub Workflows", "Vite / Webpack", "Jest / Cypress (Testing)", "CI/CD Pipelines", "Figma UI/UX Design"],
      percentages: {
        "Git & GitHub Workflows": 95,
        "Vite / Webpack": 88,
        "Jest / Cypress (Testing)": 80,
        "CI/CD Pipelines": 78,
        "Figma UI/UX Design": 82
      }
    }
  ],
  academics: [
    {
      id: "acad-1",
      degree: "Bachelor of Information and Communication Technology (Hons) - BICT",
      institution: "University of Sri Jayewardenepura (USJP)",
      duration: "2025 - Present",
      description: "Dedicated to developing real-world software solutions using modern web technologies, mobile app development, and database management. Interested in building reliable, scalable, and well-designed systems.",
      certificateUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "acad-2",
      degree: "Secondary Education",
      institution: "A/ Thambuttegama Central College",
      duration: "2015 - 2024",
      description: "Passed O/L with 6A s' 2B s' and 1C. Passed A/L with 2A s' and 1C with ICT 'A' in Engineering Technology Stream and Achieved 10th Place in Anuradhapura District. Participated in Novel Reading Competition and won Silver Medal Award for reading 75+ Novels.",
      certificateUrl: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop"
    }
  ],
  passions: [
    {
      id: "pass-1",
      title: "Classical & Semi-Classical Singing",
      category: "CREATIVE SHOWCASE",
      description: "Perform semi-classical and cultural songs, training in vocal control, melody structures, and rhythm. Actively participating in university cultural events and choral groups.",
      imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop"
      ]
    },
    {
      id: "pass-2",
      title: "Traditional & Freestyle Dancing",
      category: "CREATIVE SHOWCASE",
      description: "Experienced in classical dance forms and free expression choreography. Explored physical fitness, coordination, teamwork, and storytelling through rhythmic movement.",
      imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop"
      ]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      title: "AWS Certified Cloud Practitioner",
      issuer: "Amazon Web Services (AWS)",
      credentialId: "AWS-CCP-98231",
      date: "2025",
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "cert-2",
      title: "Meta Front-End Developer Professional Certificate",
      issuer: "Meta / Coursera",
      credentialId: "META-FED-04821",
      date: "2025",
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop"
    }
  ],
  blogs: [
    {
      id: "blog-1",
      title: "Designing SkoolGo: Overcoming School Commute Logistics with React & SQL",
      excerpt: "A deep dive into how I engineered SkoolGo, a School Transport Management System. Read about optimizing school bus routing algorithms and managing reliable schedules in real-time.",
      content: "Building SkoolGo was one of the most rewarding challenges of my undergraduate journey. The core objective was clear: simplify transport administration for schools while giving parents peace of mind.\n\n### The Core Problem\nSchool transport logistics suffer from highly dynamic route calculation problems. Planning who gets on which bus, optimizing stops to prevent long detours, and handling real-time status updates is incredibly complex. \n\n### The Tech Stack Choice\nI selected React for the dashboard to keep the user interface fully responsive and highly reactive. For the back-end, PostgreSQL was crucial for storing clean relational data tables of routes, parents, drivers, and buses. Express acted as the perfect middleware layer.\n\n### Designing the Solution\nWe modeled the routes as directed graph structures. By running lightweight sorting algorithms on the backend, we managed to reduce route computation overhead by roughly 30%. This project taught me that great software is 10% coding and 90% structured system design.",
      date: "July 2, 2026",
      readTime: "5 min read",
      tags: ["System Design", "React", "PostgreSQL", "Education Technology"],
      imageUrl: "https://images.unsplash.com/photo-1557223562-6c77ef16210f?q=80&w=600&auto=format&fit=crop"
    },
    {
      id: "blog-2",
      title: "Why Touch-Target Spacing and Typography Are Critical in Admin Dashboards",
      excerpt: "When designing AutoCare, a vehicle service dashboard, I realized standard desktop grids fail in high-stress mobile/tablet workshop environments. Here is how I solved it.",
      content: "As web developers, we often design interfaces while sitting comfortably with our 27-inch high-resolution monitors. But in the real world, a mechanic using AutoCare inside a dusty workshop is accessing the system on a greasy, budget Android tablet.\n\n### The Real World Test\nDuring the initial testing of AutoCare, we noticed that mechanics were constantly misclicking buttons. The 'Complete Service' action was too close to 'Delete Log'. In high-stress or dirty environments, precision decreases significantly.\n\n### The Redesign Strategy\n1. **Touch Targets**: Increased all clickable items to a minimum of 48px on smaller screens.\n2. **High Contrast Rules**: Replaced soft gray-on-gray borders with high-contrast borders for better outdoor legibility.\n3. **Generous Line Heights**: Boosted typography letter-spacing and line heights to improve immediate readability.\n\nDesigning for accessibility is not just about compliance; it's about building software that actually respects the person using it daily.",
      date: "June 15, 2026",
      readTime: "4 min read",
      tags: ["UI/UX Design", "Accessibility", "Tailwind CSS", "Undergraduate Projects"],
      imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=600&auto=format&fit=crop"
    }
  ],
  articles: [
    {
      id: "art-1",
      title: "Academic Research Proposal: Neural Networks for Wildlife Tracking",
      description: "A comprehensive academic research proposal detailing the feasibility, computational costs, and deployment of lightweight deep learning models on solar-powered microcontroller cameras.",
      date: "May 20, 2026",
      tags: ["Deep Learning", "Academic Research", "Edge Computing"],
      fileName: "wildlife_tracking_proposal_draft.pdf",
      fileType: "application/pdf",
      fileSize: "1.4 MB",
      dataUrl: "data:text/plain;base64,U0FNUExFIFBSRVNFTlRBVElPTiBET0NVTUVOVAoKUmVzZWFyY2ggVGl0bGU6IE5ldXJhbCBOZXR3b3JrcyBmb3IgV2lsZGxpZmUgVHJhY2tpbmcKaW4gTG93LVBvd2VyIEVudmlyb25tZW50cwoKQXV0aG9yOiBQb3J0Zm9saW8gT3duZXIKRGF0ZTogTWF5IDIwLCAyMDI2CgpBYnN0cmFjdDoKVGhpcyBwYXBlciBleHBsb3JlcyB0aGUgYXBwbGljYXRpb24gb2YgY29udm9sdXRpb25hbCBuZXVyYWwgbmV0d29ya3MgKENOTnMpIGZvciByZWFsLXRpbWUgd2lsZGxpZmUgZGV0ZWN0aW9uLiBXZSBkZXZlbG9wIGEgcXVhbnRpemVkIG1vZGVsIHRoYXQgcnVucyBlZmZpY2llbnRseSBvbiBsb3ctcG93ZXIgbWljcm9jb250cm9sbGVycywgb2ZmZXJpbmcgOTglIGFjY3VyYWN5IHdoaWxlIGNvbnN1bWluZyB1bmRlciAyMDBtVy4="
    }
  ],
  customization: {
    accentColor: "indigo",
    layout: "grid"
  }
};
