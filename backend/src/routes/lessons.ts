import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  const lessonId = Number(req.params.id);
  const userId = req.userId!;

  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { course: { include: { lessons: { orderBy: { order: "asc" } } } } },
  });
  if (!lesson) return res.status(404).json({ error: "Lección no encontrada" });

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
  });
  if (!enrollment) return res.status(403).json({ error: "No estás inscrito en este curso" });

  const lessons = lesson.course.lessons;
  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  if (currentIndex > 0) {
    const prevLesson = lessons[currentIndex - 1];
    const prevProgress = await prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId: prevLesson.id } },
    });
    if (!prevProgress?.completed) {
      return res.status(403).json({
        error: "Debes completar la lección anterior primero",
        nextLessonId: prevLesson.id,
      });
    }
  }

  const progress = await prisma.lessonProgress.findUnique({
    where: { userId_lessonId: { userId, lessonId } },
  });

  const totalLessons = lessons.length;
  const completedCount = await prisma.lessonProgress.count({
    where: { userId, lesson: { courseId: lesson.courseId }, completed: true },
  });

  const canAccessQuiz = completedCount >= totalLessons - 1 && currentIndex === lessons.length - 1;

  res.json({
    lesson,
    completed: progress?.completed ?? false,
    nextLesson: lessons[currentIndex + 1] || null,
    prevLesson: lessons[currentIndex - 1] || null,
    courseProgress: {
      totalLessons,
      completedLessons: completedCount,
      progress: Math.round((completedCount / totalLessons) * 100),
    },
    canAccessQuiz,
  });
});

router.put("/:id/complete", authenticate, async (req: AuthRequest, res: Response) => {
  const lessonId = Number(req.params.id);
  const userId = req.userId!;

  const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
  if (!lesson) return res.status(404).json({ error: "Lección no encontrada" });

  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
  });
  if (!enrollment) return res.status(403).json({ error: "No estás inscrito en este curso" });

  const progress = await prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed: true, completedAt: new Date() },
    create: { userId, lessonId, completed: true, completedAt: new Date() },
  });

  const totalLessons = await prisma.lesson.count({ where: { courseId: lesson.courseId } });
  const completedCount = await prisma.lessonProgress.count({
    where: { userId, lesson: { courseId: lesson.courseId }, completed: true },
  });

  let quizAvailable = false;
  if (completedCount >= totalLessons) {
    quizAvailable = true;
  }

  res.json({ progress, courseCompleted: completedCount >= totalLessons, quizAvailable });
});

export default router;
