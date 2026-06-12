"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/:id", auth_1.authenticate, async (req, res) => {
    const lessonId = Number(req.params.id);
    const userId = req.userId;
    const lesson = await prisma_1.default.lesson.findUnique({
        where: { id: lessonId },
        include: { course: { include: { lessons: { orderBy: { order: "asc" } } } } },
    });
    if (!lesson)
        return res.status(404).json({ error: "Lección no encontrada" });
    const enrollment = await prisma_1.default.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: lesson.courseId } },
    });
    if (!enrollment)
        return res.status(403).json({ error: "No estás inscrito en este curso" });
    const lessons = lesson.course.lessons;
    const currentIndex = lessons.findIndex((l) => l.id === lessonId);
    if (currentIndex > 0) {
        const prevLesson = lessons[currentIndex - 1];
        const prevProgress = await prisma_1.default.lessonProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId: prevLesson.id } },
        });
        if (!prevProgress?.completed) {
            return res.status(403).json({
                error: "Debes completar la lección anterior primero",
                nextLessonId: prevLesson.id,
            });
        }
    }
    const progress = await prisma_1.default.lessonProgress.findUnique({
        where: { userId_lessonId: { userId, lessonId } },
    });
    const progressRecords = await prisma_1.default.lessonProgress.findMany({
        where: { userId, lesson: { courseId: lesson.courseId }, completed: true },
        select: { lessonId: true },
    });
    const completedLessonIds = progressRecords.map((p) => p.lessonId);
    const totalLessons = lessons.length;
    const completedCount = completedLessonIds.length;
    const canAccessQuiz = completedCount >= totalLessons - 1 && currentIndex === lessons.length - 1;
    res.json({
        lesson,
        completed: progress?.completed ?? false,
        nextLesson: lessons[currentIndex + 1] || null,
        prevLesson: lessons[currentIndex - 1] || null,
        allLessons: lessons.map((l) => ({ id: l.id, title: l.title, order: l.order, completed: completedLessonIds.includes(l.id) })),
        completedLessonIds,
        courseProgress: {
            totalLessons,
            completedLessons: completedCount,
            progress: Math.round((completedCount / totalLessons) * 100),
        },
        canAccessQuiz,
    });
});
router.put("/:id/complete", auth_1.authenticate, async (req, res) => {
    const lessonId = Number(req.params.id);
    const userId = req.userId;
    const lesson = await prisma_1.default.lesson.findUnique({
        where: { id: lessonId },
        include: { course: { include: { lessons: { orderBy: { order: "asc" } } } } },
    });
    if (!lesson)
        return res.status(404).json({ error: "Lección no encontrada" });
    const enrollment = await prisma_1.default.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: lesson.courseId } },
    });
    if (!enrollment)
        return res.status(403).json({ error: "No estás inscrito en este curso" });
    const lessons = lesson.course.lessons;
    const currentIndex = lessons.findIndex((l) => l.id === lessonId);
    if (currentIndex > 0) {
        const prevLesson = lessons[currentIndex - 1];
        const prevProgress = await prisma_1.default.lessonProgress.findUnique({
            where: { userId_lessonId: { userId, lessonId: prevLesson.id } },
        });
        if (!prevProgress?.completed) {
            return res.status(403).json({
                error: "Debes completar la lección anterior primero",
                nextLessonId: prevLesson.id,
            });
        }
    }
    const progress = await prisma_1.default.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: { completed: true, completedAt: new Date() },
        create: { userId, lessonId, completed: true, completedAt: new Date() },
    });
    const totalLessons = await prisma_1.default.lesson.count({ where: { courseId: lesson.courseId } });
    const completedCount = await prisma_1.default.lessonProgress.count({
        where: { userId, lesson: { courseId: lesson.courseId }, completed: true },
    });
    let quizAvailable = false;
    if (completedCount >= totalLessons) {
        quizAvailable = true;
    }
    res.json({ progress, courseCompleted: completedCount >= totalLessons, quizAvailable });
});
router.delete("/:id/progress", auth_1.authenticate, async (req, res) => {
    const lessonId = Number(req.params.id);
    const userId = req.userId;
    const lesson = await prisma_1.default.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson)
        return res.status(404).json({ error: "Lección no encontrada" });
    const enrollment = await prisma_1.default.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: lesson.courseId } },
    });
    if (!enrollment)
        return res.status(403).json({ error: "No estás inscrito en este curso" });
    await prisma_1.default.lessonProgress.deleteMany({
        where: { userId, lessonId },
    });
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=lessons.js.map