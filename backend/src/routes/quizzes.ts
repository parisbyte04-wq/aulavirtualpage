import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/course/:courseId", authenticate, async (req: AuthRequest, res: Response) => {
  const courseId = Number(req.params.courseId);
  const userId = req.userId!;

  const quiz = await prisma.quiz.findUnique({
    where: { courseId },
    include: {
      questions: { orderBy: { order: "asc" } },
    },
  });
  if (!quiz) return res.status(404).json({ error: "Este curso no tiene cuestionario" });

  const totalLessons = await prisma.lesson.count({ where: { courseId } });
  const completedLessons = await prisma.lessonProgress.count({
    where: { userId, lesson: { courseId }, completed: true },
  });
  if (completedLessons < totalLessons) {
    return res.status(403).json({ error: "Debes completar todas las lecciones primero" });
  }

  const existingSubmission = await prisma.quizSubmission.findUnique({
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

router.post("/course/:courseId/submit", authenticate, async (req: AuthRequest, res: Response) => {
  const courseId = Number(req.params.courseId);
  const userId = req.userId!;
  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    return res.status(400).json({ error: "Respuestas inválidas" });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { courseId },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  if (!quiz) return res.status(404).json({ error: "Cuestionario no encontrado" });

  const existing = await prisma.quizSubmission.findUnique({
    where: { quizId_userId: { quizId: quiz.id, userId } },
  });
  if (existing) return res.status(400).json({ error: "Ya has enviado este cuestionario" });

  let score = 0;
  quiz.questions.forEach((q, i) => {
    if (answers[i] === q.correctIndex) score++;
  });

  const total = quiz.questions.length;
  const passed = (score / total) * 100 >= quiz.passingScore;

  const submission = await prisma.quizSubmission.create({
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
    await prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data: { completedAt: new Date() },
    });
  }

  res.json({ score, total, passed, percentage: Math.round((score / total) * 100) });
});

export default router;
