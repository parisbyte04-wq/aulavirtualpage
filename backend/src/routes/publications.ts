import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  const publications = await prisma.publication.findMany({
    orderBy: { date: "desc" },
  });
  res.json(publications);
});

router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const publication = await prisma.publication.findUnique({ where: { id } });
  res.json(publication);
});

router.post("/", authenticate, async (req: Request, res: Response) => {
  const { title, summary, content, imageUrl, date, type, link } = req.body;
  const publication = await prisma.publication.create({
    data: {
      title,
      summary,
      content,
      imageUrl,
      date: date ? new Date(date) : undefined,
      type,
      link,
    },
  });
  res.json(publication);
});

router.put("/:id", authenticate, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { title, summary, content, imageUrl, date, type, link } = req.body;
  const publication = await prisma.publication.update({
    where: { id },
    data: {
      title,
      summary,
      content,
      imageUrl,
      date: date ? new Date(date) : undefined,
      type,
      link,
    },
  });
  res.json(publication);
});

router.delete("/:id", authenticate, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await prisma.publication.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
