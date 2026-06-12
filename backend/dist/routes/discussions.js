"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/lesson/:lessonId", auth_1.authenticate, async (req, res) => {
    const lessonId = Number(req.params.lessonId);
    const comments = await prisma_1.default.discussion.findMany({
        where: { lessonId, parentId: null },
        include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
            replies: {
                include: { user: { select: { id: true, name: true, avatarUrl: true } } },
                orderBy: { createdAt: "asc" },
            },
        },
        orderBy: { createdAt: "desc" },
    });
    res.json(comments);
});
router.post("/lesson/:lessonId", auth_1.authenticate, async (req, res) => {
    const lessonId = Number(req.params.lessonId);
    const userId = req.userId;
    const { content } = req.body;
    if (!content)
        return res.status(400).json({ error: "El contenido es requerido" });
    const lesson = await prisma_1.default.lesson.findUnique({
        where: { id: lessonId },
        include: { course: true },
    });
    if (!lesson)
        return res.status(404).json({ error: "Lección no encontrada" });
    const enrollment = await prisma_1.default.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: lesson.courseId } },
    });
    if (!enrollment)
        return res.status(403).json({ error: "No estás inscrito en este curso" });
    const comment = await prisma_1.default.discussion.create({
        data: { lessonId, userId, content },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });
    res.json(comment);
});
router.post("/:id/reply", auth_1.authenticate, async (req, res) => {
    const parentId = Number(req.params.id);
    const userId = req.userId;
    const { content } = req.body;
    if (!content)
        return res.status(400).json({ error: "El contenido es requerido" });
    const parent = await prisma_1.default.discussion.findUnique({ where: { id: parentId } });
    if (!parent)
        return res.status(404).json({ error: "Comentario no encontrado" });
    const reply = await prisma_1.default.discussion.create({
        data: { lessonId: parent.lessonId, userId, content, parentId },
        include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });
    res.json(reply);
});
exports.default = router;
//# sourceMappingURL=discussions.js.map