export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  avatarUrl: string | null;
}

export interface About {
  id?: number;
  title: string;
  mission: string;
  vision: string;
  history: string;
}

export interface ResearchArea {
  id: number;
  title: string;
  description: string;
  icon: string;
  order: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  type: string;
  techStack: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  researchAreaId: number | null;
  researchArea?: ResearchArea | null;
  createdAt: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string | null;
  photoUrl: string | null;
  email: string | null;
  linkedin: string | null;
  order: number;
}

export interface Publication {
  id: number;
  title: string;
  summary: string;
  content: string | null;
  imageUrl: string | null;
  date: string;
  type: string;
  link: string | null;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  category: string | null;
  published: boolean;
  _count?: { lessons: number; enrollments: number };
  lessons?: Lesson[];
}

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
  duration: number | null;
}

export interface Enrollment {
  id: number;
  userId: number;
  courseId: number;
  course: Course;
  enrolledAt: string;
  completedAt: string | null;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
}

export interface Quiz {
  id: number;
  title: string;
  passingScore: number;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  order: number;
}

export interface QuizData {
  quiz: Quiz;
  questions: Question[];
  submission: {
    score: number;
    total: number;
    passed: boolean;
    answers: number[];
    submittedAt: string;
  } | null;
}

export interface Certificate {
  id: number;
  userId: number;
  courseId: number;
  code: string;
  issuedAt: string;
  course: { title: string };
  user?: { name: string };
}

export interface Discussion {
  id: number;
  lessonId: number;
  userId: number;
  content: string;
  parentId: number | null;
  createdAt: string;
  user: { id: number; name: string; avatarUrl: string | null };
  replies?: Discussion[];
}
