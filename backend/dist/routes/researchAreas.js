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
    const areas = await prisma_1.default.researchArea.findMany({ orderBy: { order: "asc" } });
    res.json(areas);
});
router.post("/", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const { title, description, icon, order } = req.body;
    const area = await prisma_1.default.researchArea.create({
        data: { title, description, icon, order: order ?? 0 },
    });
    res.json(area);
}));
router.put("/:id", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const id = Number(req.params.id);
    const { title, description, icon, order } = req.body;
    const area = await prisma_1.default.researchArea.update({
        where: { id },
        data: { title, description, icon, order },
    });
    res.json(area);
}));
router.delete("/:id", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.default.researchArea.delete({ where: { id } });
    res.json({ success: true });
}));
exports.default = router;
//# sourceMappingURL=researchAreas.js.map