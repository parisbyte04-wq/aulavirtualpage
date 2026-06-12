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
    const projects = await prisma_1.default.project.findMany({
        include: { researchArea: true },
        orderBy: { createdAt: "desc" },
    });
    res.json(projects);
});
router.get("/software", async (_req, res) => {
    const projects = await prisma_1.default.project.findMany({
        where: { type: "software" },
        orderBy: { createdAt: "desc" },
    });
    res.json(projects);
});
router.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const project = await prisma_1.default.project.findUnique({
        where: { id },
        include: { researchArea: true },
    });
    res.json(project);
});
router.post("/", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const { title, description, imageUrl, type, techStack, githubUrl, liveUrl, researchAreaId } = req.body;
    const project = await prisma_1.default.project.create({
        data: { title, description, imageUrl, type, techStack, githubUrl, liveUrl, researchAreaId },
    });
    res.json(project);
}));
router.put("/:id", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const id = Number(req.params.id);
    const { title, description, imageUrl, type, techStack, githubUrl, liveUrl, researchAreaId } = req.body;
    const project = await prisma_1.default.project.update({
        where: { id },
        data: { title, description, imageUrl, type, techStack, githubUrl, liveUrl, researchAreaId },
    });
    res.json(project);
}));
router.delete("/:id", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.default.project.delete({ where: { id } });
    res.json({ success: true });
}));
exports.default = router;
//# sourceMappingURL=projects.js.map