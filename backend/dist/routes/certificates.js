"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uuid_1 = require("uuid");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get("/", auth_1.authenticate, async (req, res) => {
    const userId = req.userId;
    const certs = await prisma_1.default.certificate.findMany({
        where: { userId },
        include: { course: true },
        orderBy: { issuedAt: "desc" },
    });
    res.json(certs);
});
router.post("/generate/:courseId", auth_1.authenticate, async (req, res) => {
    const courseId = Number(req.params.courseId);
    const userId = req.userId;
    const course = await prisma_1.default.course.findUnique({ where: { id: courseId } });
    if (!course)
        return res.status(404).json({ error: "Curso no encontrado" });
    if (!course.certificateEnabled) {
        return res.status(400).json({ error: "Este curso no tiene certificado habilitado" });
    }
    const existing = await prisma_1.default.certificate.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });
    if (existing)
        return res.json(existing);
    const enrollment = await prisma_1.default.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment?.completedAt) {
        return res.status(400).json({ error: "Debes completar el curso primero" });
    }
    const submission = await prisma_1.default.quizSubmission.findFirst({
        where: { userId, quiz: { courseId }, passed: true },
    });
    if (!submission) {
        return res.status(400).json({ error: "Debes aprobar el examen final" });
    }
    const code = `CERT-${(0, uuid_1.v4)().substring(0, 8).toUpperCase()}-${(0, uuid_1.v4)().substring(0, 4).toUpperCase()}`;
    const certificate = await prisma_1.default.$transaction(async (tx) => {
        return tx.certificate.create({
            data: { userId, courseId, code },
            include: { course: true, user: true },
        });
    });
    res.json({ ...certificate, course: { ...certificate.course, certificateTitle: course.certificateTitle, certificateBgUrl: course.certificateBgUrl, certificateNameX: course.certificateNameX, certificateNameY: course.certificateNameY, certificateNameSize: course.certificateNameSize, certificateNameFont: course.certificateNameFont, certificateFontUrl: course.certificateFontUrl } });
});
router.get("/verify/:code", async (req, res) => {
    const { code } = req.params;
    const cert = await prisma_1.default.certificate.findUnique({
        where: { code },
        include: { user: true, course: true },
    });
    if (!cert)
        return res.status(404).json({ valid: false, error: "Certificado no encontrado" });
    res.json({
        valid: true,
        code: cert.code,
        issuedAt: cert.issuedAt,
        studentName: cert.user.name,
        courseName: cert.course.title,
    });
});
exports.default = router;
//# sourceMappingURL=certificates.js.map