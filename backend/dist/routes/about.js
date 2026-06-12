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
    const about = await prisma_1.default.about.findFirst();
    res.json(about || {});
});
router.put("/", auth_1.authenticate, roles_1.requireAdmin, (0, roles_1.wrapAsync)(async (req, res) => {
    const { title, mission, vision, history } = req.body;
    const existing = await prisma_1.default.about.findFirst();
    if (existing) {
        const updated = await prisma_1.default.about.update({
            where: { id: existing.id },
            data: { title, mission, vision, history },
        });
        res.json(updated);
    }
    else {
        const created = await prisma_1.default.about.create({
            data: { title, mission, vision, history },
        });
        res.json(created);
    }
}));
exports.default = router;
//# sourceMappingURL=about.js.map