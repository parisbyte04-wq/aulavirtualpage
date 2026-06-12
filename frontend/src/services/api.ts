import axios from "axios";
import type {
  About, ResearchArea, Project, TeamMember, Publication,
  LoginResponse, ContactMessage, User, Course, Lesson,
  Enrollment, QuizData, Certificate, Discussion,
} from "../types";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      const payload = token ? decodeToken(token) : null;
      localStorage.removeItem("token");
      const current = window.location.pathname;
      if (current.startsWith("/admin") && !current.startsWith("/admin/login")) {
        window.location.href = "/admin/login";
      } else if (!current.startsWith("/auth/") && current !== "/") {
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export function decodeToken(token: string): { userId: number; role: string; isSuperAdmin: boolean } | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export const auth = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>("/auth/login", { email, password }).then((r) => r.data),
  register: (name: string, email: string, password: string) =>
    api.post<LoginResponse>("/auth/register", { name, email, password }).then((r) => r.data),
  getProfile: () =>
    api.get<User>("/auth/profile").then((r) => r.data),
  updateProfile: (data: { name?: string; email?: string; phone?: string }) =>
    api.put<User>("/auth/profile", data).then((r) => r.data),
  changePassword: (currentPassword: string, newPassword: string) =>
    api.put("/auth/password", { currentPassword, newPassword }).then((r) => r.data),
  updateAvatar: (avatarUrl: string) =>
    api.put("/auth/avatar", { avatarUrl }).then((r) => r.data),
};

export const about = {
  get: () => api.get<About>("/about").then((r) => r.data),
  update: (data: Partial<About>) => api.put<About>("/about", data).then((r) => r.data),
};

export const researchAreas = {
  getAll: () => api.get<ResearchArea[]>("/research-areas").then((r) => r.data),
  create: (data: Partial<ResearchArea>) => api.post<ResearchArea>("/research-areas", data).then((r) => r.data),
  update: (id: number, data: Partial<ResearchArea>) => api.put<ResearchArea>(`/research-areas/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/research-areas/${id}`).then((r) => r.data),
};

export const projects = {
  getAll: () => api.get<Project[]>("/projects").then((r) => r.data),
  getSoftware: () => api.get<Project[]>("/projects/software").then((r) => r.data),
  getById: (id: number) => api.get<Project>(`/projects/${id}`).then((r) => r.data),
  create: (data: Partial<Project>) => api.post<Project>("/projects", data).then((r) => r.data),
  update: (id: number, data: Partial<Project>) => api.put<Project>(`/projects/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/projects/${id}`).then((r) => r.data),
};

export const teamMembers = {
  getAll: () => api.get<TeamMember[]>("/team").then((r) => r.data),
  create: (data: Partial<TeamMember>) => api.post<TeamMember>("/team", data).then((r) => r.data),
  update: (id: number, data: Partial<TeamMember>) => api.put<TeamMember>(`/team/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/team/${id}`).then((r) => r.data),
};

export const publications = {
  getAll: () => api.get<Publication[]>("/publications").then((r) => r.data),
  getById: (id: number) => api.get<Publication>(`/publications/${id}`).then((r) => r.data),
  create: (data: Partial<Publication>) => api.post<Publication>("/publications", data).then((r) => r.data),
  update: (id: number, data: Partial<Publication>) => api.put<Publication>(`/publications/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/publications/${id}`).then((r) => r.data),
};

export const contact = {
  send: (data: { name: string; email: string; subject: string; message: string }) =>
    api.post("/contact", data).then((r) => r.data),
  getAll: () => api.get<ContactMessage[]>("/contact").then((r) => r.data),
  markRead: (id: number) => api.put(`/contact/${id}/read`).then((r) => r.data),
  remove: (id: number) => api.delete(`/contact/${id}`).then((r) => r.data),
};

export const coursesApi = {
  getAll: () => api.get<Course[]>("/courses").then((r) => r.data),
  getAllAdmin: () => api.get<Course[]>("/admin/courses").then((r) => r.data),
  getById: (id: number) => api.get<Course>(`/courses/${id}`).then((r) => r.data),
  getProgress: (id: number) => api.get<CourseProgress>(`/courses/${id}/progress`).then((r) => r.data),
  create: (data: Partial<Course>) => api.post<Course>("/admin/courses", data).then((r) => r.data),
  update: (id: number, data: Partial<Course>) => api.put<Course>(`/admin/courses/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/admin/courses/${id}`).then((r) => r.data),
};

export interface CourseProgress {
  enrolled: boolean;
  completedAt: string | null;
  totalLessons: number;
  completedLessons: number;
  progress: number;
  lessonProgress: { lessonId: number; completed: boolean; order: number }[];
}

export const enrollmentsApi = {
  enroll: (courseId: number) => api.post("/enrollments", { courseId }).then((r) => r.data),
  getMyEnrollments: () => api.get<Enrollment[]>("/enrollments").then((r) => r.data),
};

export interface LessonData {
  lesson: Lesson;
  completed: boolean;
  courseProgress: { completedLessons: number; totalLessons: number; progress: number };
  prevLesson: { id: number } | null;
  nextLesson: { id: number } | null;
  canAccessQuiz: boolean;
  allLessons: { id: number; title: string; order: number; completed: boolean }[];
  completedLessonIds: number[];
}

export const lessonsApi = {
  getById: (id: number) => api.get<LessonData>(`/lessons/${id}`).then((r) => r.data),
  complete: (id: number) => api.put<{ completed: boolean; quizAvailable: boolean }>(`/lessons/${id}/complete`).then((r) => r.data),
  resetProgress: (id: number) => api.delete(`/lessons/${id}/progress`).then((r) => r.data),
  adminGetByCourse: (courseId: number) => api.get<Lesson[]>(`/admin/lessons/course/${courseId}`).then((r) => r.data),
  adminCreate: (data: Partial<Lesson>) => api.post("/admin/lessons", data).then((r) => r.data),
  adminUpdate: (id: number, data: Partial<Lesson>) => api.put(`/admin/lessons/${id}`, data).then((r) => r.data),
  adminDelete: (id: number) => api.delete(`/admin/lessons/${id}`).then((r) => r.data),
};

export const quizzesApi = {
  getByCourse: (courseId: number) => api.get<QuizData>(`/quizzes/course/${courseId}`).then((r) => r.data),
  submit: (courseId: number, answers: number[]) =>
    api.post<{ score: number; total: number; passed: boolean; percentage: number }>(`/quizzes/course/${courseId}/submit`, { answers }).then((r) => r.data),
  adminGetByCourse: (courseId: number) => api.get<any>(`/admin/quiz/course/${courseId}`).then((r) => r.data),
  adminSave: (courseId: number, data: { title: string; passingScore: number }) =>
    api.put(`/admin/quiz/course/${courseId}`, data).then((r) => r.data),
  adminCreateQuestion: (quizId: number, data: any) =>
    api.post(`/admin/quiz/${quizId}/questions`, data).then((r) => r.data),
  adminUpdateQuestion: (id: number, data: any) =>
    api.put(`/admin/quiz/questions/${id}`, data).then((r) => r.data),
  adminDeleteQuestion: (id: number) =>
    api.delete(`/admin/quiz/questions/${id}`).then((r) => r.data),
};

export const certificatesApi = {
  getMine: () => api.get<Certificate[]>("/certificates").then((r) => r.data),
  generate: (courseId: number) => api.post<Certificate>(`/certificates/generate/${courseId}`).then((r) => r.data),
  verify: (code: string) => api.get<any>(`/certificates/verify/${code}`).then((r) => r.data),
  adminGetAll: () => api.get<any[]>("/admin/certificates").then((r) => r.data),
};

export const discussionsApi = {
  getByLesson: (lessonId: number) => api.get<Discussion[]>(`/discussions/lesson/${lessonId}`).then((r) => r.data),
  create: (lessonId: number, content: string) => api.post(`/discussions/lesson/${lessonId}`, { content }).then((r) => r.data),
  reply: (discussionId: number, content: string) => api.post(`/discussions/${discussionId}/reply`, { content }).then((r) => r.data),
};

export const uploadsApi = {
  uploadAvatar: (file: File) => {
    const fd = new FormData();
    fd.append("avatar", file);
    return api.post<{ avatarUrl: string }>("/uploads/avatar", fd).then((r) => r.data);
  },
  uploadCourseImage: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post<{ url: string }>("/uploads/course-image", fd).then((r) => r.data);
  },
  uploadCertificateBg: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post<{ url: string }>("/uploads/certificate-bg", fd).then((r) => r.data);
  },
  uploadCertificateFont: (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return api.post<{ url: string; name: string }>("/uploads/certificate-font", fd).then((r) => r.data);
  },
};

export const adminUsers = {
  getAll: () => api.get<User[]>("/admin/users/admins").then((r) => r.data),
  create: (data: { name: string; email: string; password: string; phone?: string }) =>
    api.post<User>("/admin/users/admins", data).then((r) => r.data),
  update: (id: number, data: { name?: string; email?: string; password?: string; phone?: string }) =>
    api.put<User>(`/admin/users/admins/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/admin/users/admins/${id}`).then((r) => r.data),
};

export default api;
