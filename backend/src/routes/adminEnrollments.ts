import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { requireAdmin } from "../middleware/roles";

const router = Router();

router.get("/", authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  const enrollments = await prisma.enrollment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      course: { select: { id: true, title: true, _count: { select: { lessons: true } } } },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const result = await Promise.all(
    enrollments.map(async (e) => {
      const completedCount = await prisma.lessonProgress.count({
        where: { userId: e.userId, lesson: { courseId: e.courseId }, completed: true },
      });
      return {
        ...e,
        completedLessons: completedCount,
        progress: e.course._count.lessons > 0
          ? Math.round((completedCount / e.course._count.lessons) * 100)
          : 0,
      };
    })
  );

  res.json(result);
});

export default router;
