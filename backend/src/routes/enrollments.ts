import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  const { courseId } = req.body;
  const userId = req.userId!;

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) return res.status(404).json({ error: "Curso no encontrado" });

  const existing = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
  if (existing) return res.status(400).json({ error: "Ya estás inscrito en este curso" });

  const enrollment = await prisma.enrollment.create({
    data: { userId, courseId },
    include: { course: true },
  });
  res.json(enrollment);
});

router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  const userId = req.userId!;
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: { _count: { select: { lessons: true } } },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const result = await Promise.all(
    enrollments.map(async (e) => {
      const completedCount = await prisma.lessonProgress.count({
        where: { userId, lesson: { courseId: e.courseId }, completed: true },
      });
      const totalLessons = e.course._count.lessons;
      return {
        ...e,
        progress: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
        completedLessons: completedCount,
        totalLessons,
      };
    })
  );

  res.json(result);
});

export default router;
