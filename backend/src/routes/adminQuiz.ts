import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/roles";

const router = Router();

router.get("/course/:courseId", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const courseId = Number(req.params.courseId);
  const quiz = await prisma.quiz.findUnique({
    where: { courseId },
    include: { questions: { orderBy: { order: "asc" } } },
  });
  res.json(quiz);
});

router.put("/course/:courseId", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const courseId = Number(req.params.courseId);
  const { title, passingScore } = req.body;

  const existing = await prisma.quiz.findUnique({ where: { courseId } });
  if (existing) {
    const quiz = await prisma.quiz.update({
      where: { id: existing.id },
      data: { title, passingScore: passingScore ?? 70 },
    });
    res.json(quiz);
  } else {
    const quiz = await prisma.quiz.create({
      data: { courseId, title, passingScore: passingScore ?? 70 },
    });
    res.json(quiz);
  }
});

router.post("/:quizId/questions", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const quizId = Number(req.params.quizId);
  const { text, options, correctIndex, order } = req.body;
  const question = await prisma.question.create({
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

router.put("/questions/:id", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const { text, options, correctIndex, order } = req.body;
  const question = await prisma.question.update({
    where: { id },
    data: { text, options: JSON.stringify(options), correctIndex, order },
  });
  res.json({ ...question, options: JSON.parse(question.options) });
});

router.delete("/questions/:id", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  await prisma.question.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
