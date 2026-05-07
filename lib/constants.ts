import type { TimelineItem, SkillCategory } from "@/types";
import type { PortfolioProject } from "@/lib/content-context";

export const SITE = {
  name: "Ashwath Ram",
  title: "Cloud Engineer & DevOps Practitioner",
  tagline:
    "Cloud and DevOps practitioner focused on AWS infrastructure and containerized applications. Exploring automation tools and gaining experience with GCP and Azure environments.",
  email: "ashwathaz@zohomail.in",
  phone: "+91 9176578001",
  linkedin: "https://www.linkedin.com/in/ashz3003/",
  github: "https://github.com/Ashwathaz",
  portfolio: "#",
  location: "India",
  resumeUrl: "/Ashwath_Ram_Resume.pdf",
} as const;

export const NAV_LINKS = [
  { label: "Experience", href: "#journey" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const PERSONAL_NAV_LINKS = [
  { label: "Gaming", href: "#gaming" },
  { label: "Food", href: "#foodie" },
  { label: "Ambitions", href: "#ambitions" },
  { label: "Sports", href: "#sports" },
  { label: "Gallery", href: "#gallery" },
] as const;

/* Words that rotate in the hero */
export const ROTATING_WORDS = [
  "AWS Cloud Infrastructure",
  "DevOps Automation",
  "Infrastructure as Code",
  "CI/CD Pipelines",
  "Containerized Systems",
];

/* Infinite ticker - companies / clients / institutions */
export const TICKER_ITEMS = [
  { name: "AWS", logo: "/computer server.png" },
  { name: "Docker", logo: "/computer server.png" },
  { name: "Terraform", logo: "/Satellite.png" },
  { name: "Linux", logo: "/computer server.png" },
  { name: "Prometheus", logo: "/Barchart.png" },
  { name: "Grafana", logo: "/Barchart.png" },
  { name: "CI/CD", logo: "/Clipboard.png" },
  { name: "Cloud Infrastructure", logo: "/Satellite.png" },
];

export const TIMELINE: TimelineItem[] = [
  {
    role: "DevOps Intern",
    organization: "ARCHON Platform 3 Solutions",
    period: "Dec 2025 - Mar 2026",
    points: [
      "Streamlined deployment processes by containerizing applications with Docker and establishing automated CI/CD pipelines alongside Terraform-based infrastructure.",
      "Architected and managed scalable cloud environments on AWS, utilizing core services like EC2, S3, IAM, and VPC.",
      "Maintained robust system performance through hands-on Linux administration, server configuration, networking, and user management.",
      "Built monitoring and visualization dashboards using Prometheus and Grafana.",
    ],
    color: "#6366F1",
  },
  {
    role: "Testing Intern",
    organization: "SARSE Technologies",
    period: "Oct 2025 - Dec 2025",
    points: [
      "Tested the VOTO Ecommerce Web Application to ensure smooth functionality and a seamless user experience.",
      "Created and executed test cases for product browsing, cart, checkout, and payment flows.",
      "Identified and reported bugs, collaborating with developers to resolve issues efficiently.",
      "Performed re-testing to verify all fixes were stable and deployment-ready.",
    ],
    color: "#FF5210",
  },
  {
    role: "Masters in Computer Applications",
    organization: "Sathyabama University | CGPA: 6.50",
    period: "2024 - Present",
    points: [],
    color: "#22C55E",
  },
  {
    role: "B.Sc Computer Science",
    organization: "Vels University | CGPA: 7.52",
    period: "2020 - 2024",
    points: [],
    color: "#8E60F0",
  },
];

export const PROJECTS: PortfolioProject[] = [
  {
    id: "1",
    title: "ECOMMERCE WEBSITE FOR GAMING ACCESSORIES",
    date: "Jan 2024 - May 2024",
    image: "/project3.png",
    link: "https://strixstore.duckdns.org/",
    tech: "React, CSS3, JavaScript",
    description:
      "A responsive ecommerce experience for gaming accessories with product discovery, cart flows, checkout simulation, and a gamer-focused dark interface.",
    points: [
      "Efficient product search and categorization system for gaming gear.",
      "Interactive UI components with smooth gaming-inspired animations.",
      "High-performance shopping cart with real-time inventory updates.",
      "Integrated secure payment gateway simulation for seamless checkout.",
      "User-centric dark theme optimized for long-session gaming enthusiasts.",
      "Responsive layout ensuring compatibility across device sizes.",
    ],
  },
  {
    id: "2",
    title: "AI Resume & ATS Analyzer",
    date: "Nov 2025 - Present",
    image: "/project1.png",
    link: "https://ai-resume-analyzer.duckdns.org/",
    tech: "Python, Streamlit, NLP, Docker",
    description:
      "A Dockerized resume analysis tool that parses resumes, scores ATS fit against job descriptions, and provides targeted improvement feedback.",
    points: [
      "Core NLP algorithms for deep resume parsing and analysis.",
      "Intelligent ATS score calculation based on job descriptions.",
      "Personalized skill gap analysis with improvement recommendations.",
      "Production-ready Docker environment for scalable deployment.",
      "Intuitive data visualization for resume performance metrics.",
      "Automated feedback generation for resume tailoring.",
    ],
  },
  {
    id: "3",
    title: "Sathyabama AI Chatbot",
    date: "Jul 2025 - Aug 2025",
    image: "/project2.png",
    link: "https://sist-chatbot.duckdns.org/",
    tech: "Python, Flask, Groq",
    description:
      "An academic inquiry chatbot for university students with a Flask backend, Groq-powered responses, and context-aware university-specific answers.",
    points: [
      "Large Language Model integration using Groq.",
      "Real-time academic inquiry handling for university students.",
      "Multi-turn conversation management for complex user queries.",
      "Context-aware response generation with university-specific data.",
      "Modern glass-style UI for enhanced user engagement.",
      "Optimized backend architecture for low-latency response delivery.",
    ],
  },
];

export const PERSONAL = {
  heroTitle: "Personal Blog & Hobbies",
  heroHeadingBefore: "Beyond the",
  heroHeadingAccent: "Build",
  heroHeadingAfter: "I explore",
  heroText:
    "Passionate gamer, sports enthusiast, and life explorer. This is where I document my personal journey, gaming milestones, and the things that keep me inspired outside of tech.",
  heroImage: "/personal.jpg",
  instagram: "https://instagram.com/ig._ashz",
  gaming: [
    { name: "Valorant", rank: "Diamond 1", desc: "Tactical precision and team coordination." },
    { name: "RDR2", rank: "Story Explorer", desc: "A breathtaking masterpiece of storytelling." },
    { name: "God of War", rank: "Axe Master", desc: "Epic battles and powerful emotions." },
    { name: "Ghost of Tsushima", rank: "Legendary Samurai", desc: "The way of the ghost in a beautiful world." },
    { name: "Ghost of Yotei", rank: "Wandering Ronin", desc: "A new legend begins." },
    { name: "GoW Ragnarok", rank: "Path to Valhalla", desc: "The conclusion of a legendary saga." },
    { name: "God of War III", rank: "Spartan Rage", desc: "The ultimate revenge of Kratos." },
    { name: "GTA 5", rank: "Los Santos Kingpin", desc: "Heists, cars, and endless chaos." },
    { name: "BGMI", rank: "1x Conqueror", desc: "Surviving till the end for the chicken dinner." },
  ],
  sports: [
    { name: "Chess", rank: "Strategic Thinker" },
    { name: "Tennis", rank: "Volley Player", desc: "Push to finish." },
  ],
  foodie: [
    { name: "Chicken Biryani", type: "The King of Meals" },
    { name: "Chicken Fried Rice", type: "Comfort in every bite" },
    { name: "Samosa", type: "The perfect snack" },
    { name: "Rose Milk", type: "Refreshing sweetness" },
    { name: "Tea", type: "Spiced and strong" },
    { name: "Coffee", type: "Morning fuel" },
    { name: "Chicken 65", type: "Spicy and crispy" },
    { name: "Grill Chicken", type: "Smoky goodness" },
  ],
  ambitions: [
    { name: "Indian Army", desc: "SERVE WITH HONOR" },
    { name: "Gaming Cafe", desc: "Vision to build a hub for local esports." },
  ],
  galleryNotes: [
    { title: "Exploration", desc: "Discovering new places, trekking through mountains, and taking in the fresh air." },
    { title: "Nature", desc: "Finding peace in landscapes and capturing moments in time." },
    { title: "Lifestyle", desc: "From everyday routines to extraordinary experiences, documented and shared." },
  ],
  gallery: ["/ashz1.jpg", "/ashz2.jpg", "/ashz3.jpg"],
};

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Cloud",
    icon: "cloud",
    skills: [
      "AWS EC2",
      "AWS S3",
      "IAM",
      "VPC",
      "GCP Fundamentals",
      "Azure Fundamentals",
      "Kubernetes",
    ],
  },
  {
    title: "DevOps",
    icon: "settings",
    skills: [
      "Docker",
      "Jenkins",
      "CI/CD Pipelines",
      "Terraform",
      "Linux Administration",
      "Server Configuration",
      "Networking",
    ],
  },
  {
    title: "Monitoring",
    icon: "activity",
    skills: [
      "Prometheus",
      "Grafana",
      "Dashboards",
      "Reliability",
      "Performance Checks",
      "Incident Visibility",
    ],
  },
  {
    title: "Technical",
    icon: "code",
    skills: [
      "Python",
      "JavaScript",
      "React",
      "Flask",
      "MySQL",
      "AI Integrations",
      "SQL",
      "Git / GitHub",
      "Testing",
    ],
  },
];

export const CHAT_PLACEHOLDERS = [
  "Ask about my cloud projects...",
  "What AWS services have you used?",
  "Tell me about my DevOps experience...",
  "How do I approach CI/CD and monitoring?",
];

export const RECRUITER_PLACEHOLDER =
  "Paste a job description to see if I'm a match...";

export const QUICK_ACTIONS_GENERAL = [
  { label: "My Projects", prompt: "Tell me about your most relevant cloud and DevOps projects" },
  { label: "DevOps Process", prompt: "Walk me through your approach to deployment, automation, and monitoring" },
  { label: "Skills", prompt: "What are your strongest cloud and infrastructure skills?" },
  { label: "Experience", prompt: "Tell me about your work experience" },
];

export const QUICK_ACTIONS_RECRUITER = [
  { label: "Match Analysis", prompt: "Analyze my fit for this role" },
  { label: "Key Strengths", prompt: "What are my unique strengths for this role?" },
  { label: "Impact Metrics", prompt: "What measurable impact have I made?" },
  { label: "Relevant Work", prompt: "Which projects are most relevant for this role?" },
];

export const SKILL_PILLS = [
  "AWS",
  "Jenkins",
  "Docker",
  "Terraform",
  "Kubernetes",
  "CI/CD",
  "Linux",
  "Prometheus",
];

export const ABOUT_TEXT = [
  "I'm a Cloud and DevOps practitioner focused on AWS infrastructure and containerized applications. I specialize in streamlining deployment processes by containerizing applications with Docker and establishing automated CI/CD pipelines alongside Terraform-based infrastructure.",
  "I've architected scalable cloud environments on AWS utilizing EC2, S3, IAM, and VPC. I maintain robust system performance through hands-on Linux administration and ensure reliability by building comprehensive monitoring dashboards with Prometheus and Grafana.",
  "Beyond the build, I am a passionate gamer, sports enthusiast, and life explorer. I thrive on tactical precision in Valorant and strategic thinking in Chess, applying that same analytical mindset to my engineering work.",
];

export const ABOUT_HIGHLIGHTS = [
  { label: "AWS", icon: "cloud" },
  { label: "Docker", icon: "box" },
  { label: "Terraform", icon: "layout" },
  { label: "CI/CD", icon: "git-branch" },
  { label: "Linux", icon: "terminal" },
  { label: "Monitoring", icon: "activity" },
];
