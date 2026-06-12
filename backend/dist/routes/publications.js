"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../middleware/auth");
const roles_1 = require("../middleware/roles");
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    const publications = await prisma_1.default.publication.findMany({
        orderBy: { date: "desc" },
    });
    res.json(publications);
});
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const publication = await prisma_1.default.publication.findUnique({ where: { id } });
    res.json(publication);
});
router.post("/", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const { title, summary, content, imageUrl, date, type, link } = req.body;
    const publication = await prisma_1.default.publication.create({
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
}));
router.put("/:id", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const id = Number(req.params.id);
    const { title, summary, content, imageUrl, date, type, link } = req.body;
    const publication = await prisma_1.default.publication.update({
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
}));
router.delete("/:id", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.default.publication.delete({ where: { id } });
    res.json({ success: true });
}));
exports.default = router;
//# sourceMappingURL=publications.js.map