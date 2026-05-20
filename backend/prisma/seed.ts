import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@instituto.com" },
    update: {},
    create: {
      email: "admin@instituto.com",
      password: adminPassword,
      name: "Administrador",
      role: "admin",
    },
  });

  // Demo student
  const studentPassword = await bcrypt.hash("student123", 10);
  await prisma.user.upsert({
    where: { email: "estudiante@instituto.com" },
    update: {},
    create: {
      email: "estudiante@instituto.com",
      password: studentPassword,
      name: "María García",
      role: "student",
    },
  });

  // About
  await prisma.about.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Instituto de Investigación Innovación",
      mission: "Impulsar el conocimiento científico y tecnológico para contribuir al desarrollo sostenible de la sociedad.",
      vision: "Ser un referente internacional en investigación e innovación, generando soluciones transformadoras.",
      history: "Fundado en 2020, el Instituto de Investigación Innovación nació con la misión de promover la excelencia académica y la transferencia de conocimiento.",
    },
  });

  // Research areas
  await prisma.project.deleteMany();
  await prisma.researchArea.deleteMany();
  const areas = [
    { title: "Inteligencia Artificial", description: "Desarrollo de algoritmos de machine learning y deep learning para soluciones industriales y sociales.", icon: "cpu", order: 0 },
    { title: "Biotecnología", description: "Investigación en biología molecular, genómica y bioinformática para aplicaciones médicas y agrícolas.", icon: "dna", order: 1 },
    { title: "Energías Renovables", description: "Estudio de nuevas fuentes de energía limpia y sistemas de almacenamiento eficiente.", icon: "zap", order: 2 },
    { title: "Ciencias de Datos", description: "Análisis de grandes volúmenes de datos para la toma de decisiones en organizaciones públicas y privadas.", icon: "bar-chart", order: 3 },
  ];
  for (const area of areas) {
    await prisma.researchArea.create({ data: area });
  }

  // Team
  const team = [
    { name: "Dr. Carlos Mendoza", role: "Director del Instituto", bio: "PhD en Física Computacional con más de 20 años de experiencia.", order: 0 },
    { name: "Dra. Ana Lucía Reyes", role: "Investigadora Senior - IA", bio: "Especialista en visión por computadora y PLN.", order: 1 },
    { name: "Dr. Miguel Ángel Torres", role: "Investigador - Biotecnología", bio: "Experto en edición genética CRISPR.", order: 2 },
    { name: "Mtra. Laura Jiménez", role: "Investigadora - Datos", bio: "Científica de datos especializada en analytics.", order: 3 },
  ];
  for (const member of team) {
    await prisma.teamMember.create({ data: member });
  }

  // Projects
  await prisma.project.deleteMany();
  const projects = [
    { title: "Plataforma de Diagnóstico con IA", description: "Sistema de inteligencia artificial para detección temprana de enfermedades.", type: "research" },
    { title: "Biofertilizantes Sostenibles", description: "Desarrollo de fertilizantes biológicos a partir de microorganismos nativos.", type: "research" },
    { title: "Optimización de Redes Eléctricas", description: "Algoritmos de optimización para distribución eficiente de energía.", type: "research" },
    { title: "Gestor de Aulas Virtuales", description: "Plataforma web para gestión de cursos en línea con soporte multimedia y evaluación automática.", type: "software", techStack: JSON.stringify(["Vue 3", "TypeScript", "Node.js", "PostgreSQL"]), githubUrl: "https://github.com/instituto/aula-virtual", liveUrl: "https://aula.instituto.edu" },
    { title: "Sistema de Análisis de Datos Científicos", description: "Herramienta de visualización y análisis de datos para laboratorios de investigación.", type: "software", techStack: JSON.stringify(["Python", "Django", "React", "D3.js"]), githubUrl: "https://github.com/instituto/ciencia-datos" },
    { title: "Plataforma de Colaboración Científica", description: "Red social académica para investigadores con publicación de papers y revisión por pares.", type: "software", techStack: JSON.stringify(["Next.js", "TypeScript", "GraphQL", "MongoDB"]), githubUrl: "https://github.com/instituto/colabora-cientifica", liveUrl: "https://colabora.instituto.edu" },
  ];
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  // Publications
  const publications = [
    { title: "Avances en Deep Learning para Diagnóstico Médico", summary: "Revisión sistemática de técnicas de deep learning.", type: "article", date: new Date("2025-12-15") },
    { title: "Nuevo Instituto de Investigación Abre sus Puertas", summary: "El Instituto anuncia el inicio de sus operaciones.", type: "news", date: new Date("2025-01-20") },
    { title: "Convocatoria de Proyectos 2026", summary: "Se abre la convocatoria para proyectos interdisciplinarios.", type: "news", date: new Date("2026-01-10") },
  ];
  for (const pub of publications) {
    await prisma.publication.create({ data: pub });
  }

  // Demo course: "Introducción a la Inteligencia Artificial"
  const course = await prisma.course.upsert({
    where: { slug: "introduccion-ia" },
    update: {},
    create: {
      title: "Introducción a la Inteligencia Artificial",
      slug: "introduccion-ia",
      description: "Curso completo que cubre los fundamentos de la Inteligencia Artificial: desde historia y conceptos básicos hasta machine learning, redes neuronales y aplicaciones prácticas. Ideal para principiantes.",
      category: "Tecnología",
      published: true,
    },
  });

  const lessonsData = [
    { title: "¿Qué es la Inteligencia Artificial?", content: `<h2>¿Qué es la Inteligencia Artificial?</h2>
<p>La Inteligencia Artificial (IA) es una rama de la informática que busca crear sistemas capaces de realizar tareas que normalmente requieren inteligencia humana. Estas tareas incluyen el aprendizaje, el razonamiento, la percepción, el reconocimiento de voz y la toma de decisiones.</p>
<h3>Breve historia</h3>
<p>El término "Inteligencia Artificial" fue acuñado por John McCarthy en 1956 durante la Conferencia de Dartmouth. Desde entonces, la IA ha pasado por varias etapas:</p>
<ul>
<li><strong>1950s-1960s:</strong> Nacimiento de la IA y primeros programas inteligentes</li>
<li><strong>1970s-1980s:</strong> Invierno de la IA, disminución del financiamiento</li>
<li><strong>1990s-2000s:</strong> Resurgimiento con machine learning y data mining</li>
<li><strong>2010s-presente:</strong> Deep learning, GPTs y democratización de la IA</li>
</ul>
<h3>Aplicaciones actuales</h3>
<p>La IA está presente en múltiples aspectos de nuestra vida cotidiana: asistentes virtuales, recomendaciones de contenido, vehículos autónomos, diagnóstico médico, traducción automática, entre muchos otros.</p>`, videoUrl: "https://www.youtube.com/embed/2ePf9rue1Ao", order: 0, duration: 20 },
    { title: "Machine Learning: Aprendizaje Automático", content: `<h2>Machine Learning</h2>
<p>El Machine Learning (ML) es una subdisciplina de la IA que permite a las máquinas aprender patrones a partir de datos sin ser programadas explícitamente para cada tarea.</p>
<h3>Tipos de aprendizaje</h3>
<p>Existen tres categorías principales de aprendizaje automático:</p>
<ul>
<li><strong>Aprendizaje supervisado:</strong> El modelo se entrena con datos etiquetados, aprendiendo a mapear entradas a salidas.</li>
<li><strong>Aprendizaje no supervisado:</strong> El modelo encuentra patrones en datos sin etiquetar.</li>
<li><strong>Aprendizaje por refuerzo:</strong> El modelo aprende mediante prueba y error, recibiendo recompensas o penalizaciones.</li>
</ul>
<h3>Algoritmos comunes</h3>
<p>Entre los algoritmos más utilizados se encuentran: Regresión Lineal, Árboles de Decisión, Random Forest, SVM (Máquinas de Soporte Vectorial), K-Means y Redes Neuronales.</p>`, videoUrl: "https://www.youtube.com/embed/ukzFI9rgwfU", order: 1, duration: 25 },
    { title: "Redes Neuronales y Deep Learning", content: `<h2>Redes Neuronales Artificiales</h2>
<p>Las redes neuronales artificiales están inspiradas en la estructura y funcionamiento del cerebro humano. Están compuestas por capas de nodos (neuronas) interconectados que procesan información.</p>
<h3>Deep Learning</h3>
<p>El Deep Learning es una subdisciplina del ML que utiliza redes neuronales con múltiples capas ocultas (redes profundas) para modelar patrones complejos en grandes volúmenes de datos.</p>
<h3>Aplicaciones del Deep Learning</h3>
<ul>
<li>Visión por computadora (reconocimiento facial, detección de objetos)</li>
<li>Procesamiento de lenguaje natural (traducción, chatbots)</li>
<li>Generación de contenido (imágenes, texto, música)</li>
<li>Sistemas de recomendación</li>
</ul>
<p>Frameworks populares: TensorFlow, PyTorch, Keras.</p>`, videoUrl: "https://www.youtube.com/embed/6M5VXKLf4D4", order: 2, duration: 30 },
    { title: "Ética y Futuro de la IA", content: `<h2>Ética en Inteligencia Artificial</h2>
<p>El rápido avance de la IA plantea importantes desafíos éticos que debemos considerar:</p>
<h3>Desafíos éticos</h3>
<ul>
<li><strong>Sesgo algorítmico:</strong> Los modelos pueden perpetuar o amplificar sesgos presentes en los datos de entrenamiento.</li>
<li><strong>Privacidad:</strong> La recolección masiva de datos para entrenar modelos puede comprometer la privacidad individual.</li>
<li><strong>Desplazamiento laboral:</strong> La automatización basada en IA puede afectar ciertos sectores del empleo.</li>
<li><strong>Transparencia:</strong> Muchos modelos de deep learning son "cajas negras" difíciles de interpretar.</li>
</ul>
<h3>Hacia una IA responsable</h3>
<p>Es fundamental desarrollar una IA que sea ética, transparente, inclusiva y alineada con los valores humanos. La colaboración entre científicos, legisladores y la sociedad es clave para lograr este objetivo.</p>
<p>El futuro de la IA promete avances extraordinarios en medicina, educación, sostenibilidad y calidad de vida, siempre que se desarrolle de manera responsable.</p>`, videoUrl: "https://www.youtube.com/embed/2xTkZ7wJ5wM", order: 3, duration: 20 },
  ];

  await prisma.lesson.deleteMany({ where: { courseId: course.id } });
  for (const lesson of lessonsData) {
    await prisma.lesson.create({
      data: { courseId: course.id, ...lesson },
    });
  }

  // Quiz for the course
  const quiz = await prisma.quiz.upsert({
    where: { courseId: course.id },
    update: {},
    create: {
      courseId: course.id,
      title: "Examen Final - Introducción a la IA",
      passingScore: 70,
    },
  });

  const questions = [
    { text: "¿Quién acuñó el término 'Inteligencia Artificial'?", options: JSON.stringify(["Alan Turing", "John McCarthy", "Marvin Minsky", "Arthur C. Clarke"]), correctIndex: 1, order: 0 },
    { text: "¿Cuál de los siguientes NO es un tipo de aprendizaje automático?", options: JSON.stringify(["Supervisado", "No supervisado", "Por refuerzo", "Por deducción"]), correctIndex: 3, order: 1 },
    { text: "¿Qué es una red neuronal profunda?", options: JSON.stringify(["Una red con una sola capa oculta", "Una red con múltiples capas ocultas", "Una red sin capas ocultas", "Un algoritmo de búsqueda"]), correctIndex: 1, order: 2 },
    { text: "¿Cuál es un desafío ético importante en IA?", options: JSON.stringify(["Velocidad de procesamiento", "Sesgo algorítmico", "Costo del hardware", "Consumo energético"]), correctIndex: 1, order: 3 },
    { text: "¿Qué framework NO es popular para Deep Learning?", options: JSON.stringify(["TensorFlow", "PyTorch", "Keras", "Laravel"]), correctIndex: 3, order: 4 },
  ];

  await prisma.question.deleteMany({ where: { quizId: quiz.id } });
  for (const q of questions) {
    await prisma.question.create({ data: { quizId: quiz.id, ...q } });
  }

  console.log("Seed completado exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
