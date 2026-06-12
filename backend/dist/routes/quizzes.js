"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/course/:courseId", auth_1.authenticate, async (req, res) => {
    const courseId = Number(req.params.courseId);
    const userId = req.userId;
    const quiz = await prisma_1.default.quiz.findUnique({
        where: { courseId },
        include: {
            questions: { orderBy: { order: "asc" } },
        },
    });
    if (!quiz)
        return res.status(404).json({ error: "Este curso no tiene cuestionario" });
    const totalLessons = await prisma_1.default.lesson.count({ where: { courseId } });
    const completedLessons = await prisma_1.default.lessonProgress.count({
        where: { userId, lesson: { courseId }, completed: true },
    });
    if (completedLessons < totalLessons) {
        return res.status(403).json({ error: "Debes completar todas las lecciones primero" });
    }
    const existingSubmission = await prisma_1.default.quizSubmission.findUnique({
        where: { quizId_userId: { quizId: quiz.id, userId } },
    });
    if (existingSubmission) {
        return res.json({
            quiz: {
                id: quiz.id,
                title: quiz.title,
                passingScore: quiz.passingScore,
            },
            questions: quiz.questions.map((q) => ({
                id: q.id,
                text: q.text,
                options: JSON.parse(q.options),
                order: q.order,
            })),
            submission: {
                score: existingSubmission.score,
                total: existingSubmission.total,
                passed: existingSubmission.passed,
                answers: JSON.parse(existingSubmission.answers),
                submittedAt: existingSubmission.submittedAt,
            },
            canRetake: !existingSubmission.passed,
        });
    }
    res.json({
        quiz: {
            id: quiz.id,
            title: quiz.title,
            passingScore: quiz.passingScore,
        },
        questions: quiz.questions.map((q) => ({
            id: q.id,
            text: q.text,
            options: JSON.parse(q.options),
            order: q.order,
        })),
        submission: null,
    });
});
router.post("/course/:courseId/submit", auth_1.authenticate, async (req, res) => {
    const courseId = Number(req.params.courseId);
    const userId = req.userId;
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
        return res.status(400).json({ error: "Respuestas inválidas" });
    }
    const quiz = await prisma_1.default.quiz.findUnique({
        where: { courseId },
        include: { questions: { orderBy: { order: "asc" } } },
    });
    if (!quiz)
        return res.status(404).json({ error: "Cuestionario no encontrado" });
    const existing = await prisma_1.default.quizSubmission.findUnique({
        where: { quizId_userId: { quizId: quiz.id, userId } },
    });
    if (existing && existing.passed)
        return res.status(400).json({ error: "Ya has aprobado este cuestionario" });
    if (existing && !existing.passed) {
        await prisma_1.default.quizSubmission.delete({ where: { id: existing.id } });
    }
    let score = 0;
    quiz.questions.forEach((q, i) => {
        if (answers[i] === q.correctIndex)
            score++;
    });
    const total = quiz.questions.length;
    const passed = (score / total) * 100 >= quiz.passingScore;
    const submission = await prisma_1.default.quizSubmission.create({
        data: {
            quizId: quiz.id,
            userId,
            answers: JSON.stringify(answers),
            score,
            total,
            passed,
        },
    });
    if (passed) {
        await prisma_1.default.enrollment.update({
            where: { userId_courseId: { userId, courseId } },
            data: { completedAt: new Date() },
        });
    }
    res.json({ score, total, passed, percentage: Math.round((score / total) * 100) });
});
exports.default = router;
//# sourceMappingURL=quizzes.js.map