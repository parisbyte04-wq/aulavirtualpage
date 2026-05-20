<template>
  <div class="min-h-screen bg-gray-50">
    <AulaHeader />
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Mis Certificados</h1>

      <div v-if="loading" class="text-center py-20 text-gray-400">Cargando certificados...</div>

      <div v-else-if="certificates.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg mb-4">No tienes certificados aún. Completa un curso y aprueba el examen final para obtenerlo.</p>
        <router-link to="/aula" class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl inline-block transition-all">
          Explorar cursos
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div v-for="cert in certificates" :key="cert.id"
          class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="font-bold text-gray-900">Certificado de finalización</span>
              </div>
              <p class="text-gray-600 mb-1">{{ cert.course.title }}</p>
              <p class="text-sm text-gray-400">Código: <span class="font-mono font-medium text-primary-600">{{ cert.code }}</span></p>
              <p class="text-xs text-gray-400 mt-1">Emitido el {{ formatDate(cert.issuedAt) }}</p>
            </div>
            <button @click="downloadPdf(cert)" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all shrink-0">
              Descargar PDF
            </button>
          </div>
        </div>
      </div>
    </main>
    <AulaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { certificatesApi } from "../../services/api";
import { useAuthStore } from "../../stores/auth";
import AulaHeader from "../../components/layout/AulaHeader.vue";
import AulaFooter from "../../components/layout/AulaFooter.vue";
import type { Certificate } from "../../types";

const authStore = useAuthStore();
const certificates = ref<Certificate[]>([]);
const loading = ref(true);

onMounted(async () => {
  try { certificates.value = await certificatesApi.getMine(); }
  finally { loading.value = false; }
});

async function downloadPdf(cert: Certificate) {
  const pdfMake = (await import("pdfmake/build/pdfmake")).default;
  const pdfFonts = (await import("pdfmake/build/vfs_fonts")).default;
  pdfMake.vfs = pdfFonts.vfs;

  const docDefinition: any = {
    pageSize: "LETTER",
    pageMargins: [60, 60, 60, 60],
    content: [
      { text: "INSTITUTO DE INVESTIGACIÓN INNOVACIÓN", style: "header" },
      { text: "\n\n" },
      { text: "CERTIFICA QUE", style: "subheader" },
      { text: "\n" },
      { text: authStore.user?.name || "Estudiante", style: "name" },
      { text: "\n" },
      { text: "Ha completado satisfactoriamente el curso", style: "body" },
      { text: "\n" },
      { text: cert.course.title, style: "courseName" },
      { text: "\n\n" },
      { text: `Fecha de emisión: ${new Date(cert.issuedAt).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}`, style: "body" },
      { text: "\n" },
      { text: `Código de verificación: ${cert.code}`, style: "code" },
      { text: "\n\n" },
      { text: "Verificar autenticidad en: instituto.edu/verificar", style: "footer" },
    ],
    styles: {
      header: { fontSize: 20, bold: true, alignment: "center", color: "#1e3a5f", margin: [0, 20, 0, 0] },
      subheader: { fontSize: 12, alignment: "center", color: "#666", italics: true },
      name: { fontSize: 28, bold: true, alignment: "center", color: "#1e3a5f", margin: [0, 10, 0, 10] },
      body: { fontSize: 13, alignment: "center", color: "#444" },
      courseName: { fontSize: 18, bold: true, alignment: "center", color: "#0ea5e9", margin: [0, 5, 0, 5] },
      code: { fontSize: 11, alignment: "center", color: "#888", margin: [0, 10, 0, 0], font: "Courier" },
      footer: { fontSize: 10, alignment: "center", color: "#aaa", margin: [0, 30, 0, 0] },
    },
    defaultStyle: { font: "Roboto" },
  };

  pdfMake.createPdf(docDefinition).download(`certificado-${cert.code}.pdf`);
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
}
</script>
