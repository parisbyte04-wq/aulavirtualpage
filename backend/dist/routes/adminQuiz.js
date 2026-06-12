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
router.get("/course/:courseId", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const courseId = Number(req.params.courseId);
    const quiz = await prisma_1.default.quiz.findUnique({
        where: { courseId },
        include: { questions: { orderBy: { order: "asc" } } },
    });
    res.json(quiz);
});
router.put("/course/:courseId", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const courseId = Number(req.params.courseId);
    const { title, passingScore } = req.body;
    const existing = await prisma_1.default.quiz.findUnique({ where: { courseId } });
    if (existing) {
        const quiz = await prisma_1.default.quiz.update({
            where: { id: existing.id },
            data: { title, passingScore: passingScore ?? 70 },
        });
        res.json(quiz);
    }
    else {
        const quiz = await prisma_1.default.quiz.create({
            data: { courseId, title, passingScore: passingScore ?? 70 },
        });
        res.json(quiz);
    }
});
router.post("/:quizId/questions", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const quizId = Number(req.params.quizId);
    const { text, options, correctIndex, order } = req.body;
    const question = await prisma_1.default.question.create({
        data: {
            quizId,
            text,
            options: JSON.stringify(options),
            correctIndex,
            order: order ?? 0,
        },
    });
    res.json({ ...question, options: JSON.parse(question.options) });
});
router.put("/questions/:id", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { text, options, correctIndex, order } = req.body;
    const question = await prisma_1.default.question.update({
        where: { id },
        data: { text, options: JSON.stringify(options), correctIndex, order },
    });
    res.json({ ...question, options: JSON.parse(question.options) });
});
router.delete("/questions/:id", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.default.question.delete({ where: { id } });
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=adminQuiz.js.map