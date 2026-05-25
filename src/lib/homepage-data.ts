import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Download,
  FileText,
  GraduationCap,
  LineChart,
  Target,
} from "lucide-react";

export type FeatureItem = {
  icon: LucideIcon;
  title: string;
  text: string;
};

export type MatchProof = {
  course: string;
  semester: number;
  subject: string;
  matchedQuestions: number;
  totalQuestions: number;
  highlight: string;
};

export const features: FeatureItem[] = [
  {
    icon: BookOpen,
    title: "Syllabus-Based Prediction",
    text: "Every paper is mapped directly to the official Calicut University syllabus.",
  },
  {
    icon: LineChart,
    title: "Topic Weightage Analysis",
    text: "We weigh chapters by frequency, marks distribution, and recurring patterns.",
  },
  {
    icon: FileText,
    title: "Previous Year Patterns",
    text: "Five years of past papers analysed to surface high-probability questions.",
  },
  {
    icon: Target,
    title: "Internal Exam Relevance",
    text: "Topics aligned with internal assessment trends and university expectations.",
  },
  {
    icon: GraduationCap,
    title: "Course-Specific Papers",
    text: "Tailored sets for B.Com, BBA, BSc, BA, BCA and more.",
  },
  {
    icon: Download,
    title: "Instant PDF Access",
    text: "Download a clean, printable PDF immediately after secure payment.",
  },
];

export const courses = [
  "B.Com",
  "BBA",
  "BA English",
  "BCA",
  "BA Economics",
  "BSc Botany",
  "BSc Mathematics",
  "BSc Computer Science",
  "BSc Microbiology",
  "More coming soon",
];

export const testimonials = [
  {
    name: "Aysha R.",
    course: "B.Com 4th Sem",
    text: "Helped me focus on the important topics in the last week. Saved hours of guesswork.",
  },
  {
    name: "Rahul M.",
    course: "BCA 2nd Sem",
    text: "Good for exam preparation. The pattern analysis felt accurate to what we got.",
  },
  {
    name: "Fathima K.",
    course: "FYUGP",
    text: "Affordable and useful. The PDF was clean and easy to revise from.",
  },
];

export const faqs = [
  {
    q: "What resources are available on this website?",
    a: "We provide predicted model papers, handwritten notes, previous year question papers (PYQs), micro pocket notes, study materials, important questions, and more for various university courses and semesters.",
  },
  {
    q: "Are the materials based on the official syllabus?",
    a: "Yes. All resources are prepared according to the latest official university syllabus and exam pattern available at the time of publishing.",
  },
  {
    q: "How do I access the files after payment?",
    a: "After successful payment, you will get instant access to download your purchased resource directly from the website.",
  },
  {
    q: "Which courses and universities are supported?",
    a: "We currently support multiple UG courses including B.Com, BBA, BCA, BA, BSc and more. New subjects and universities are added regularly.",
  },
  {
    q: "Are these resources useful for exam preparation?",
    a: "Yes. The materials are designed to help students revise faster, understand important topics, and prepare more effectively for exams.",
  },
  {
    q: "Can I request a subject or resource that is not available?",
    a: "Yes. If your course, subject, or semester is not listed, you can contact us and request it. We regularly add new resources based on student demand.",
  },
  {
    q: "Will I get updates if the syllabus changes?",
    a: "Yes. Important syllabus changes, exam updates, and newly released materials are shared through our community channels.",
  },
  {
    q: "Do I need an account to purchase resources?",
    a: "No. You can purchase and access resources without creating an account.",
  },
];

export const PREMIUM_TYPES = [
  "Handwritten Notes",
  "PYQs",
  "Model Papers",
  "Micro Notes",
  "Module-wise Notes",
  "Question Banks",
  "Important Questions",
];

export const FREE_TYPES = [
  "Free Notes",
  "Important Questions",
  "Selected PYQs",
  "Sample Papers",
];

export const MATCH_PROOFS: MatchProof[] = [
  {
    course: "BCA",
    semester: 4,
    subject: "AUTOMATION AND ROBOTICS",
    matchedQuestions: 15,
    totalQuestions: 20,
    highlight: "Including partial topic matches, 90% of questions aligned with predictions",
  },
  {
    course: "BCA",
    semester: 4,
    subject: "INTRODUCTION TO CYBER LAWS",
    matchedQuestions: 15,
    totalQuestions: 16,
    highlight: "The prediction achieved 100% topic-wise coverage, with approximately 94% of exact question matches",
  },
  {
    course: "BBA",
    semester: 4,
    subject: "BACHELOR OF BUSINESS ADMINISTRATION",
    matchedQuestions: 12,
    totalQuestions: 20,
    highlight: "60% of questions matched, including topic wise and direct question matches.",
  },
];

export const WHATSAPP_CHANNEL = "https://chat.whatsapp.com/DxIoknRVc7a0cZpVMNI6Gr";
export const TELEGRAM_CHANNEL = "https://t.me/FYUGPhub";
