import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import authRoutes from "./routes/auth";
import aboutRoutes from "./routes/about";
import researchAreaRoutes from "./routes/researchAreas";
import projectRoutes from "./routes/projects";
import teamMemberRoutes from "./routes/teamMembers";
import publicationRoutes from "./routes/publications";
import contactRoutes from "./routes/contact";
import uploadRoutes from "./routes/uploads";
import courseRoutes from "./routes/courses";
import { adminCourseRoutes } from "./routes/courses";
import enrollmentRoutes from "./routes/enrollments";
import lessonRoutes from "./routes/lessons";
import quizRoutes from "./routes/quizzes";
import certificateRoutes from "./routes/certificates";
import discussionRoutes from "./routes/discussions";
import adminLessonRoutes from "./routes/adminLessons";
import adminQuizRoutes from "./routes/adminQuiz";
import adminEnrollmentRoutes from "./routes/adminEnrollments";
import adminCertificateRoutes from "./routes/adminCertificates";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "5mb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Demasiados intentos. Intenta en 15 minutos." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/research-areas", researchAreaRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/team", teamMemberRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/uploads", uploadRoutes);

app.use("/api/courses", courseRoutes);
app.use("/api/admin/courses", adminCourseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/discussions", discussionRoutes);
app.use("/api/admin/lessons", adminLessonRoutes);
app.use("/api/admin/quiz", adminQuizRoutes);
app.use("/api/admin/enrollments", adminEnrollmentRoutes);
app.use("/api/admin/certificates", adminCertificateRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  const message = process.env.NODE_ENV === "production"
    ? "Error interno del servidor"
    : err.message || "Error interno del servidor";
  res.status(err.status || 500).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
