<template>
  <div class="min-h-screen bg-gray-50">
    <AulaHeader />
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Mis Cursos</h1>

      <div v-if="loading" class="text-center py-20 text-gray-400">Cargando tus cursos...</div>

      <div v-else-if="enrollments.length === 0" class="text-center py-20">
        <p class="text-gray-400 text-lg mb-4">No estás inscrito en ningún curso aún.</p>
        <router-link to="/aula" class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl inline-block transition-all">
          Explorar cursos
        </router-link>
      </div>

      <div v-else class="space-y-6">
        <div v-for="enrollment in enrollments" :key="enrollment.id"
          class="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-full">{{ enrollment.course.category || 'General' }}</span>
                <span v-if="enrollment.completedAt" class="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">Completado</span>
              </div>
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ enrollment.course.title }}</h3>
              <div class="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span>{{ enrollment.completedLessons }}/{{ enrollment.totalLessons }} lecciones</span>
                <span>Inscrito {{ formatDate(enrollment.enrolledAt) }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div class="bg-primary-600 h-2.5 rounded-full transition-all" :style="{ width: enrollment.progress + '%' }" />
              </div>
              <div class="flex items-center gap-3">
                <router-link :to="`/aula/${enrollment.courseId}/leccion/${enrollment.course.lessons?.[0]?.id || ''}`"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all">
                  {{ enrollment.completedAt ? 'Repasar' : 'Continuar' }}
                </router-link>
                <button v-if="enrollment.completedAt" @click="generateCert(enrollment.courseId)"
                  class="px-4 py-2 border border-primary-200 text-primary-600 text-sm font-semibold rounded-lg hover:bg-primary-50 transition-all">
                  Obtener certificado
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AulaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { enrollmentsApi, certificatesApi } from "../../services/api";
import { useRouter } from "vue-router";
import AulaHeader from "../../components/layout/AulaHeader.vue";
import AulaFooter from "../../components/layout/AulaFooter.vue";

const router = useRouter();
const enrollments = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try { enrollments.value = await enrollmentsApi.getMyEnrollments(); }
  finally { loading.value = false; }
});

async function generateCert(courseId: number) {
  try {
    await certificatesApi.generate(courseId);
    router.push("/mis-certificados");
  } catch (e: any) {
    alert(e.response?.data?.error || "Error al generar certificado");
  }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}
</script>
