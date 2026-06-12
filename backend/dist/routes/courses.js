"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCourseRoutes = void 0;
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    const courses = await prisma_1.default.course.findMany({
        where: { published: true },
        include: { _count: { select: { lessons: true, enrollments: true } }, researchArea: true },
        orderBy: { createdAt: "desc" },
    });
    res.json(courses);
});
router.get("/all", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const courses = await prisma_1.default.course.findMany({
        include: { _count: { select: { lessons: true, enrollments: true } }, researchArea: true },
        orderBy: { createdAt: "desc" },
    });
    res.json(courses);
});
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const course = await prisma_1.default.course.findUnique({
        where: { id },
        include: {
            lessons: { orderBy: { order: "asc" } },
            _count: { select: { enrollments: true } },
            researchArea: true,
        },
    });
    if (!course)
        return res.status(404).json({ error: "Curso no encontrado" });
    res.json(course);
});
router.get("/:id/progress", auth_1.authenticate, async (req, res) => {
    const courseId = Number(req.params.id);
    const userId = req.userId;
    const enrollment = await prisma_1.default.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });
    const lessons = await prisma_1.default.lesson.findMany({ where: { courseId }, orderBy: { order: "asc" } });
    const progress = await prisma_1.default.lessonProgress.findMany({
        where: { userId, lesson: { courseId } },
    });
    const completedCount = progress.filter((p) => p.completed).length;
    const totalLessons = lessons.length;
    res.json({
        enrolled: !!enrollment,
        completedAt: enrollment?.completedAt || null,
        totalLessons,
        completedLessons: completedCount,
        progress: Math.round((completedCount / totalLessons) * 100),
        lessonProgress: lessons.map((l) => ({
            lessonId: l.id,
            completed: progress.some((p) => p.lessonId === l.id && p.completed),
            order: l.order,
        })),
    });
});
exports.default = router;
exports.adminCourseRoutes = (0, express_1.Router)();
exports.adminCourseRoutes.get("/", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const courses = await prisma_1.default.course.findMany({
        include: { _count: { select: { lessons: true, enrollments: true } }, researchArea: true },
        orderBy: { createdAt: "desc" },
    });
    res.json(courses);
});
exports.adminCourseRoutes.post("/", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const { title, slug, description, imageUrl, category, researchAreaId, published, certificateEnabled, certificateTitle, certificateBgUrl, certificateNameX, certificateNameY, certificateNameSize, certificateNameFont, certificateFontUrl } = req.body;
    const course = await prisma_1.default.course.create({
        data: { title, slug, description, imageUrl, category, researchAreaId: researchAreaId ?? null, published: published ?? false, certificateEnabled, certificateTitle, certificateBgUrl, certificateNameX, certificateNameY, certificateNameSize, certificateNameFont, certificateFontUrl },
    });
    res.json(course);
});
exports.adminCourseRoutes.put("/:id", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { title, slug, description, imageUrl, category, researchAreaId, published, certificateEnabled, certificateTitle, certificateBgUrl, certificateNameX, certificateNameY, certificateNameSize, certificateNameFont, certificateFontUrl } = req.body;
    const course = await prisma_1.default.course.update({ where: { id }, data: { title, slug, description, imageUrl, category, researchAreaId: researchAreaId ?? null, published, certificateEnabled, certificateTitle, certificateBgUrl, certificateNameX, certificateNameY, certificateNameSize, certificateNameFont, certificateFontUrl } });
    res.json(course);
});
exports.adminCourseRoutes.delete("/:id", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.default.course.delete({ where: { id } });
    res.json({ success: true });
});
//# sourceMappingURL=courses.js.map