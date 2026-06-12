import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { requireAdmin, wrapAsync } from "../middleware/roles";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    include: { researchArea: true },
    orderBy: { createdAt: "desc" },
  });
  res.json(projects);
});

router.get("/software", async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    where: { type: "software" },
    orderBy: { createdAt: "desc" },
  });
  res.json(projects);
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const project = await prisma.project.findUnique({
    where: { id },
    include: { researchArea: true },
  });
  res.json(project);
});

router.post("/", authenticate, requireAdmin, wrapAsync(async (req: Request, res: Response) => {
  const { title, description, imageUrl, type, techStack, githubUrl, liveUrl, researchAreaId } = req.body;
  const project = await prisma.project.create({
    data: { title, description, imageUrl, type, techStack, githubUrl, liveUrl, researchAreaId },
  });
  res.json(project);
}));

router.put("/:id", authenticate, requireAdmin, wrapAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, imageUrl, type, techStack, githubUrl, liveUrl, researchAreaId } = req.body;
  const project = await prisma.project.update({
    where: { id },
    data: { title, description, imageUrl, type, techStack, githubUrl, liveUrl, researchAreaId },
  });
  res.json(project);
}));

router.delete("/:id", authenticate, requireAdmin, wrapAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.project.delete({ where: { id } });
  res.json({ success: true });
}));

export default router;
