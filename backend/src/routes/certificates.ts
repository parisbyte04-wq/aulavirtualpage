import { Router, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const certs = await prisma.certificate.findMany({
    where: { userId },
    include: { course: true },
    orderBy: { issuedAt: "desc" },
  });
  res.json(certs);
});

router.post("/generate/:courseId", authenticate, async (req: AuthRequest, res: Response) => {
  const courseId = Number(req.params.courseId);
  const userId = req.userId!;

  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return res.json(existing);

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (!enrollment?.completedAt) {
    return res.status(400).json({ error: "Debes completar el curso primero" });
  }

  const submission = await prisma.quizSubmission.findFirst({
    where: { userId, quiz: { courseId }, passed: true },
  });
  if (!submission) {
    return res.status(400).json({ error: "Debes aprobar el examen final" });
  }

  const code = `CERT-${uuidv4().substring(0, 8).toUpperCase()}-${uuidv4().substring(0, 4).toUpperCase()}`;

  const certificate = await prisma.certificate.create({
    data: { userId, courseId, code },
    include: { course: true, user: true },
  });

  res.json(certificate);
});

router.get("/verify/:code", async (req, res: Response) => {
  const { code } = req.params;
  const cert = await prisma.certificate.findUnique({
    where: { code },
    include: { user: true, course: true },
  });
  if (!cert) return res.status(404).json({ valid: false, error: "Certificado no encontrado" });
  res.json({
    valid: true,
    code: cert.code,
    issuedAt: cert.issuedAt,
    studentName: cert.user.name,
    courseName: cert.course.title,
  });
});

export default router;
