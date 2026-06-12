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
    const members = await prisma_1.default.teamMember.findMany({ orderBy: { order: "asc" } });
    res.json(members);
});
router.post("/", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const { name, role, bio, photoUrl, email, linkedin, order } = req.body;
    const member = await prisma_1.default.teamMember.create({
        data: { name, role, bio, photoUrl, email, linkedin, order: order ?? 0 },
    });
    res.json(member);
}));
router.put("/:id", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const id = Number(req.params.id);
    const { name, role, bio, photoUrl, email, linkedin, order } = req.body;
    const member = await prisma_1.default.teamMember.update({
        where: { id },
        data: { name, role, bio, photoUrl, email, linkedin, order },
    });
    res.json(member);
}));
router.delete("/:id", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const id = Number(req.params.id);
    await prisma_1.default.teamMember.delete({ where: { id } });
    res.json({ success: true });
}));
exports.default = router;
//# sourceMappingURL=teamMembers.js.map