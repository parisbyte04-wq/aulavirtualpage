import { createRouter, createWebHistory } from "vue-router";
import { decodeToken } from "../services/api";
import LandingPage from "../views/LandingPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "landing",
      component: LandingPage,
    },
    {
      path: "/aula",
      name: "catalog",
      component: () => import("../views/aula/CatalogView.vue"),
    },
    {
      path: "/aula/:id",
      name: "course-detail",
      component: () => import("../views/aula/CourseDetail.vue"),
    },
    {
      path: "/aula/:courseId/leccion/:lessonId",
      name: "lesson",
      component: () => import("../views/aula/LessonView.vue"),
      meta: { requiresStudent: true },
    },
    {
      path: "/mis-cursos",
      name: "my-courses",
      component: () => import("../views/aula/MyCourses.vue"),
      meta: { requiresStudent: true },
    },
    {
      path: "/mis-certificados",
      name: "my-certificates",
      component: () => import("../views/aula/MyCertificates.vue"),
      meta: { requiresStudent: true },
    },
    {
      path: "/mi-perfil",
      name: "profile",
      component: () => import("../views/aula/ProfileView.vue"),
      meta: { requiresStudent: true },
    },
    {
      path: "/publicaciones",
      name: "publications",
      component: () => import("../views/public/PublicationsView.vue"),
    },
    {
      path: "/publicaciones/:id",
      name: "publication-detail",
      component: () => import("../views/public/PublicationDetail.vue"),
    },
    {
      path: "/verificar",
      name: "verify",
      component: () => import("../views/public/VerifyCertificate.vue"),
    },
    {
      path: "/auth/login",
      name: "login",
      component: () => import("../views/auth/LoginView.vue"),
    },
    {
      path: "/auth/register",
      name: "register",
      component: () => import("../views/auth/RegisterView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/admin/AdminLayout.vue"),
      redirect: "/admin/dashboard",
      children: [
        {
          path: "login",
          name: "admin-login",
          component: () => import("../views/admin/LoginView.vue"),
        },
        {
          path: "dashboard",
          name: "dashboard",
          component: () => import("../views/admin/DashboardView.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "profile",
          name: "admin-profile",
          component: () => import("../views/admin/ProfileAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "projects",
          name: "admin-projects",
          component: () => import("../views/admin/ProjectsAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "team",
          name: "admin-team",
          component: () => import("../views/admin/TeamAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "publications",
          name: "admin-publications",
          component: () => import("../views/admin/PublicationsAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "areas",
          name: "admin-areas",
          component: () => import("../views/admin/AreasAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "messages",
          name: "admin-messages",
          component: () => import("../views/admin/MessagesAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "admins",
          name: "admin-admins",
          component: () => import("../views/admin/AdminsAdmin.vue"),
          meta: { requiresAdmin: true, requiresSuperAdmin: true },
        },
        {
          path: "about",
          name: "admin-about",
          component: () => import("../views/admin/AboutAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "courses",
          name: "admin-courses",
          component: () => import("../views/admin/CourseListAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "courses/crear",
          name: "admin-course-create",
          component: () => import("../views/admin/CourseFormAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "courses/:id",
          name: "admin-course-edit",
          component: () => import("../views/admin/CourseFormAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "courses/:courseId/lessons",
          name: "admin-lessons",
          component: () => import("../views/admin/LessonListAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "courses/:courseId/lessons/crear",
          name: "admin-lesson-create",
          component: () => import("../views/admin/LessonFormAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "courses/:courseId/lessons/:lessonId",
          name: "admin-lesson-edit",
          component: () => import("../views/admin/LessonFormAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "courses/:courseId/quiz",
          name: "admin-quiz",
          component: () => import("../views/admin/QuizFormAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "courses/:courseId/certificate",
          name: "admin-certificate",
          component: () => import("../views/admin/CertificateConfigAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "enrollments",
          name: "admin-enrollments",
          component: () => import("../views/admin/EnrollmentsAdmin.vue"),
          meta: { requiresAdmin: true },
        },
        {
          path: "certificates",
          name: "admin-certificates",
          component: () => import("../views/admin/CertificatesAdmin.vue"),
          meta: { requiresAdmin: true },
        },
      ],
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAdmin || to.meta.requiresStudent) {
    if (!token) {
      next({ name: to.meta.requiresAdmin ? "admin-login" : "login" });
      return;
    }

    const payload = decodeToken(token);
    if (!payload) {
      localStorage.removeItem("token");
      next({ name: to.meta.requiresAdmin ? "admin-login" : "login" });
      return;
    }

    if (to.meta.requiresAdmin && payload.role !== "admin") {
      next({ name: payload.role === "student" ? "landing" : "admin-login" });
      return;
    }

    if (to.meta.requiresSuperAdmin && !payload.isSuperAdmin) {
      next({ name: "dashboard" });
      return;
    }

    if (to.meta.requiresStudent && payload.role !== "student") {
      next({ name: payload.role === "admin" ? "dashboard" : "login" });
      return;
    }
  }

  next();
});

export default router;
