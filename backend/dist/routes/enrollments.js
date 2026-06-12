"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const router = (0, express_1.Router)();
router.post("/", auth_1.authenticate, roles_1.requireStudent, async (req, res) => {
    const { courseId } = req.body;
    const userId = req.userId;
    const course = await prisma_1.default.course.findUnique({ where: { id: courseId } });
    if (!course)
        return res.status(404).json({ error: "Curso no encontrado" });
    if (!course.published)
        return res.status(400).json({ error: "El curso no está disponible" });
    const existing = await prisma_1.default.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });
    if (existing)
        return res.status(400).json({ error: "Ya estás inscrito en este curso" });
    const enrollment = await prisma_1.default.enrollment.create({
        data: { userId, courseId },
        include: { course: true },
    });
    res.json(enrollment);
});
router.get("/", auth_1.authenticate, async (req, res) => {
    const userId = req.userId;
    const enrollments = await prisma_1.default.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                include: {
                    lessons: { orderBy: { order: "asc" }, select: { id: true, title: true, order: true } },
                    _count: { select: { lessons: true } },
                    researchArea: true,
                },
            },
        },
        orderBy: { enrolledAt: "desc" },
    });
    const result = await Promise.all(enrollments.map(async (e) => {
        const completedCount = await prisma_1.default.lessonProgress.count({
            where: { userId, lesson: { courseId: e.courseId }, completed: true },
        });
        const totalLessons = e.course._count.lessons;
        return {
            ...e,
            progress: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
            completedLessons: completedCount,
            totalLessons,
        };
    }));
    res.json(result);
});
exports.default = router;
//# sourceMappingURL=enrollments.js.map