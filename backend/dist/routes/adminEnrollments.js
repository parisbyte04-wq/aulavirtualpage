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
router.get("/", auth_1.authenticate, roles_1.requireAdmin, async (req, res) => {
    const enrollments = await prisma_1.default.enrollment.findMany({
        include: {
            user: { select: { id: true, name: true, email: true } },
            course: { select: { id: true, title: true, _count: { select: { lessons: true } } } },
        },
        orderBy: { enrolledAt: "desc" },
    });
    const result = await Promise.all(enrollments.map(async (e) => {
        const completedCount = await prisma_1.default.lessonProgress.count({
            where: { userId: e.userId, lesson: { courseId: e.courseId }, completed: true },
        });
        return {
            ...e,
            completedLessons: completedCount,
            progress: e.course._count.lessons > 0
                ? Math.round((completedCount / e.course._count.lessons) * 100)
                : 0,
        };
    }));
    res.json(result);
});
exports.default = router;
//# sourceMappingURL=adminEnrollments.js.map