"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const auth_1 = __importDefault(require("./routes/auth"));
const about_1 = __importDefault(require("./routes/about"));
const researchAreas_1 = __importDefault(require("./routes/researchAreas"));
const projects_1 = __importDefault(require("./routes/projects"));
const teamMembers_1 = __importDefault(require("./routes/teamMembers"));
const publications_1 = __importDefault(require("./routes/publications"));
const contact_1 = __importDefault(require("./routes/contact"));
const uploads_1 = __importDefault(require("./routes/uploads"));
const courses_1 = __importDefault(require("./routes/courses"));
const courses_2 = require("./routes/courses");
const enrollments_1 = __importDefault(require("./routes/enrollments"));
const lessons_1 = __importDefault(require("./routes/lessons"));
const quizzes_1 = __importDefault(require("./routes/quizzes"));
const certificates_1 = __importDefault(require("./routes/certificates"));
const discussions_1 = __importDefault(require("./routes/discussions"));
const adminLessons_1 = __importDefault(require("./routes/adminLessons"));
const adminQuiz_1 = __importDefault(require("./routes/adminQuiz"));
const adminEnrollments_1 = __importDefault(require("./routes/adminEnrollments"));
const adminCertificates_1 = __importDefault(require("./routes/adminCertificates"));
const adminUsers_1 = __importDefault(require("./routes/adminUsers"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express_1.default.json({ limit: "5mb" }));
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: "Demasiados intentos. Intenta en 15 minutos." },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.use("/api/auth", auth_1.default);
app.use("/api/about", about_1.default);
app.use("/api/research-areas", researchAreas_1.default);
app.use("/api/projects", projects_1.default);
app.use("/api/team", teamMembers_1.default);
app.use("/api/publications", publications_1.default);
app.use("/api/contact", contact_1.default);
app.use("/api/uploads", uploads_1.default);
app.use("/api/courses", courses_1.default);
app.use("/api/admin/courses", courses_2.adminCourseRoutes);
app.use("/api/enrollments", enrollments_1.default);
app.use("/api/lessons", lessons_1.default);
app.use("/api/quizzes", quizzes_1.default);
app.use("/api/certificates", certificates_1.default);
app.use("/api/discussions", discussions_1.default);
app.use("/api/admin/lessons", adminLessons_1.default);
app.use("/api/admin/quiz", adminQuiz_1.default);
app.use("/api/admin/enrollments", adminEnrollments_1.default);
app.use("/api/admin/certificates", adminCertificates_1.default);
app.use("/api/admin/users", adminUsers_1.default);
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use((err, _req, res, _next) => {
    console.error(err);
    const message = process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : err.message || "Error interno del servidor";
    res.status(err.status || 500).json({ error: message });
});
app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map