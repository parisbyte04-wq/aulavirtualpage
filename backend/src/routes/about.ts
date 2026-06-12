import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { requireAdmin, wrapAsync } from "../middleware/roles";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const about = await prisma.about.findFirst();
  res.json(about || {});
});

router.put("/", authenticate, requireAdmin, wrapAsync(async (req: Request, res: Response) => {
  const { title, mission, vision, history } = req.body;
  const existing = await prisma.about.findFirst();
  if (existing) {
    const updated = await prisma.about.update({
      where: { id: existing.id },
      data: { title, mission, vision, history },
    });
    res.json(updated);
  } else {
    const created = await prisma.about.create({
      data: { title, mission, vision, history },
    });
    res.json(created);
  }
}));

export default router;
