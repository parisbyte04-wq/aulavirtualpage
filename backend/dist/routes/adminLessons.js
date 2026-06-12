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
    const lessons = await prisma_1.default.lesson.findMany({
        where: { courseId },
        orderBy: { order: "asc" },
    });
    res.json(lessons);
});
router.post("/", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const { courseId, title, content, videoUrl, order, duration } = req.body;
    const lesson = await prisma_1.default.lesson.create({
        data: { courseId, title, content, videoUrl, order: order ?? 0, duration },
    });
    res.json(lesson);
});
router.put("/:id", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    const { title, content, videoUrl, order, duration } = req.body;
    const lesson = await prisma_1.default.lesson.update({
        where: { id },
        data: { title, content, videoUrl, order, duration },
    });
    res.json(lesson);
});
router.delete("/:id", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.default.lesson.delete({ where: { id } });
    res.json({ success: true });
});
exports.default = router;
//# sourceMappingURL=adminLessons.js.map