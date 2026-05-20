import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/roles";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: { _count: { select: { lessons: true, enrollments: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(courses);
});

router.get("/all", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const courses = await prisma.course.findMany({
    include: { _count: { select: { lessons: true, enrollments: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(courses);
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { order: "asc" } },
      _count: { select: { enrollments: true } },
    },
  });
  if (!course) return res.status(404).json({ error: "Curso no encontrado" });
  res.json(course);
});

router.get("/:id/progress", authenticate, async (req: AuthRequest, res: Response) => {
  const courseId = Number(req.params.id);
  const userId = req.userId!;

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  const lessons = await prisma.lesson.findMany({ where: { courseId }, orderBy: { order: "asc" } });
  const progress = await prisma.lessonProgress.findMany({
    where: { userId, lesson: { courseId } },
  });

  const completedCount = progress.filter((p) => p.completed).length;
  const totalLessons = lessons.length;

  res.json({
    enrolled: !!enrollment,
    completedAt: enrollment?.completedAt || null,
    totalLessons,
    completedLessons: completedCount,
    progress: Math.round((completedCount / totalLessons) * 100),
    lessonProgress: lessons.map((l) => ({
      lessonId: l.id,
      completed: progress.some((p) => p.lessonId === l.id && p.completed),
      order: l.order,
    })),
  });
});

export default router;

export const adminCourseRoutes = Router();

adminCourseRoutes.get("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const courses = await prisma.course.findMany({
    include: { _count: { select: { lessons: true, enrollments: true } } },
    orderBy: { createdAt: "desc" },
  });
  res.json(courses);
});

adminCourseRoutes.post("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const { title, slug, description, imageUrl, category, published } = req.body;
  const course = await prisma.course.create({
    data: { title, slug, description, imageUrl, category, published: published ?? false },
  });
  res.json(course);
});

adminCourseRoutes.put("/:id", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const { title, slug, description, imageUrl, category, published } = req.body;
  const course = await prisma.course.update({ where: { id }, data: { title, slug, description, imageUrl, category, published } });
  res.json(course);
});

adminCourseRoutes.delete("/:id", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  await prisma.course.delete({ where: { id } });
  res.json({ success: true });
});
