import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/lesson/:lessonId", authenticate, async (req: AuthRequest, res: Response) => {
  const lessonId = Number(req.params.lessonId);
  const comments = await prisma.discussion.findMany({
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

router.post("/lesson/:lessonId", authenticate, async (req: AuthRequest, res: Response) => {
  const lessonId = Number(req.params.lessonId);
  const userId = req.userId!;
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "El contenido es requerido" });

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: true },
  });
  if (!lesson) return res.status(404).json({ error: "Lección no encontrada" });

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
  });
  if (!enrollment) return res.status(403).json({ error: "No estás inscrito en este curso" });

  const comment = await prisma.discussion.create({
    data: { lessonId, userId, content },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  });
  res.json(comment);
});

router.post("/:id/reply", authenticate, async (req: AuthRequest, res: Response) => {
  const parentId = Number(req.params.id);
  const userId = req.userId!;
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: "El contenido es requerido" });

  const parent = await prisma.discussion.findUnique({ where: { id: parentId } });
  if (!parent) return res.status(404).json({ error: "Comentario no encontrado" });

  const reply = await prisma.discussion.create({
    data: { lessonId: parent.lessonId, userId, content, parentId },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
  });
  res.json(reply);
});

export default router;
