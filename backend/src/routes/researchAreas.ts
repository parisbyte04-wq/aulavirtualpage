import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const areas = await prisma.researchArea.findMany({ orderBy: { order: "asc" } });
  res.json(areas);
});

router.post("/", authenticate, async (req: Request, res: Response) => {
  const { title, description, icon, order } = req.body;
  const area = await prisma.researchArea.create({
    data: { title, description, icon, order: order ?? 0 },
  });
  res.json(area);
});

router.put("/:id", authenticate, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, description, icon, order } = req.body;
  const area = await prisma.researchArea.update({
    where: { id },
    data: { title, description, icon, order },
  });
  res.json(area);
});

router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.researchArea.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
