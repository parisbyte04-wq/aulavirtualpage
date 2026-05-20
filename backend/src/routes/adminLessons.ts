import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/roles";

const router = Router();

router.get("/course/:courseId", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const courseId = Number(req.params.courseId);
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: "asc" },
  });
  res.json(lessons);
});

router.post("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { courseId, title, content, videoUrl, order, duration } = req.body;
  const lesson = await prisma.lesson.create({
    data: { courseId, title, content, videoUrl, order: order ?? 0, duration },
  });
  res.json(lesson);
});

router.put("/:id", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const { title, content, videoUrl, order, duration } = req.body;
  const lesson = await prisma.lesson.update({
    where: { id },
    data: { title, content, videoUrl, order, duration },
  });
  res.json(lesson);
});

router.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  await prisma.lesson.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
