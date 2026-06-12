<template>
  <div>
    <h3 class="text-lg font-bold text-gray-900 mb-4">Examen Final</h3>

    <div v-if="loading" class="text-center py-8 text-gray-400">
      <div class="animate-pulse space-y-4">
        <div class="h-4 w-48 bg-gray-200 rounded mx-auto" />
        <div class="h-4 w-64 bg-gray-200 rounded mx-auto" />
      </div>
    </div>

    <div v-if="quizError" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{{ quizError }}</div>

    <div v-if="submission" class="text-center py-6">
      <div class="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
        :class="submission.passed ? 'bg-green-100' : 'bg-red-100'"
      >
        <svg v-if="submission.passed" class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <svg v-else class="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h4 class="text-xl font-bold mb-2" :class="submission.passed ? 'text-green-700' : 'text-red-700'">
        {{ submission.passed ? '¡Examen aprobado!' : 'Examen no aprobado' }}
      </h4>
      <p class="text-gray-600 mb-1">Puntaje: {{ submission.score }}/{{ submission.total }} ({{ Math.round(submission.score / submission.total * 100) }}%)</p>

      <!-- Certificate actions when passed -->
      <div v-if="submission.passed && certData" class="mt-6 space-y-4">
        <div class="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
              <svg class="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="text-left">
              <p class="font-semibold text-gray-900">¡Certificado generado!</p>
              <p class="text-xs text-gray-500">Código: <span class="font-mono text-primary-600">{{ certData.code }}</span></p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3 justify-center">
            <button @click="previewCert"
              class="flex items-center gap-1.5 px-4 py-2.5 border border-primary-200 text-primary-700 bg-primary-50 hover:bg-primary-100 text-sm font-semibold rounded-xl transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Vista previa
            </button>
            <button @click="downloadCert"
              class="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar PDF
            </button>
            <a :href="`/verificar?code=${certData.code}`" target="_blank"
              class="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
              Verificar
            </a>
          </div>
          <router-link to="/mis-certificados"
            class="block mt-3 text-xs text-primary-600 hover:underline">
            Ir a Mis Certificados &rarr;
          </router-link>
        </div>
      </div>

      <p v-if="submission.passed && !certData && !certError" class="text-gray-500 text-sm mt-4">Generando certificado...</p>

      <button v-if="!submission.passed && canRetake" @click="retakeQuiz"
        class="mt-4 px-6 py-2.5 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded-xl transition-all">
        Reintentar examen
      </button>
    </div>

    <div v-if="questions.length > 0 && showQuestions">
      <div v-for="(q, i) in questions" :key="q.id" class="mb-6">
        <p class="font-medium text-gray-900 mb-3">{{ i + 1 }}. {{ q.text }}</p>
        <div class="space-y-2">
          <label v-for="(opt, j) in q.options" :key="j"
            class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all"
            :class="selectedAnswers[i] === j ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <input type="radio" :name="'q-' + q.id" :value="j" @change="selectAnswer(i, j)" class="text-primary-600" />
            <span class="text-sm text-gray-700">{{ opt }}</span>
          </label>
        </div>
      </div>
      <button @click="submitQuiz" :disabled="submitting || !allAnswered"
        class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
        {{ submitting ? 'Enviando...' : 'Enviar respuestas' }}
      </button>
      <p v-if="!allAnswered && !submitting" class="text-xs text-gray-400 text-center mt-2">Responde todas las preguntas para enviar.</p>
    </div>

    <div v-if="!loading && !submission && questions.length === 0 && !quizError" class="text-center py-8 text-gray-400">
      Este curso no tiene examen final configurado.
    </div>

    <!-- Preview Modal -->
    <Teleport to="body">
      <div v-if="previewUrl" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click.self="closePreview">
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-bold text-gray-900">Vista previa del certificado</h3>
            <div class="flex items-center gap-2">
              <button @click="downloadCurrentCert"
                class="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar
              </button>
              <button @click="closePreview"
                class="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div v-if="previewError" class="px-6 py-3 bg-red-50 border-b border-red-100 text-red-700 text-sm">
            {{ previewError }}
          </div>
          <div class="flex-1 bg-gray-100 p-4 min-h-0 overflow-auto">
            <iframe :src="previewUrl" class="w-full h-[70vh] rounded-lg shadow-inner" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { quizzesApi, certificatesApi } from "../../services/api";
import { useAuthStore } from "../../stores/auth";
import { downloadCertificatePdf, getCertificateBlobUrl } from "../../utils/certificate";
import type { QuizData, Certificate } from "../../types";

const props = defineProps<{ courseId: number }>();
const emit = defineEmits<{ "certificate-generated": [] }>();

const authStore = useAuthStore();
const loading = ref(true);
const quizError = ref("");
const certError = ref("");
const questions = ref<any[]>([]);
const quizInfo = ref<any>(null);
const submission = ref<any>(null);
const canRetake = ref(false);
const selectedAnswers = ref<number[]>([]);
const submitting = ref(false);
const certData = ref<Certificate | null>(null);
const showQuestions = ref(true);
const previewUrl = ref<string | null>(null);
const previewError = ref("");

const allAnswered = computed(() => {
  return questions.value.length > 0 && selectedAnswers.value.length === questions.value.length
    && selectedAnswers.value.every((a) => a !== undefined && a !== null);
});

onMounted(loadQuiz);

async function loadQuiz() {
  try {
    const data = await quizzesApi.getByCourse(props.courseId) as QuizData & { canRetake?: boolean };
    quizInfo.value = data.quiz;
    questions.value = data.questions;
    submission.value = data.submission;
    canRetake.value = (data as any).canRetake || false;
    showQuestions.value = !data.submission;
    if (data.submission) {
      selectedAnswers.value = data.submission.answers || [];
    }
    if (data.submission?.passed) {
      try {
        const cert = await certificatesApi.generate(props.courseId);
        if (cert) certData.value = cert;
      } catch (_) {}
    }
  } catch (e: any) {
    quizError.value = e.response?.data?.error || "Error al cargar el examen";
  } finally { loading.value = false; }
}

function retakeQuiz() {
  submission.value = null;
  showQuestions.value = true;
  selectedAnswers.value = [];
  canRetake.value = false;
  quizError.value = "";
  certData.value = null;
  certError.value = "";
}

function selectAnswer(questionIndex: number, optionIndex: number) {
  selectedAnswers.value[questionIndex] = optionIndex;
}

async function submitQuiz() {
  if (!allAnswered.value) return;
  submitting.value = true;
  try {
    const result = await quizzesApi.submit(props.courseId, selectedAnswers.value);
    submission.value = { score: result.score, total: result.total, passed: result.passed, answers: selectedAnswers.value, submittedAt: new Date().toISOString() };
    showQuestions.value = false;
    if (result.passed) {
      try {
        const cert = await certificatesApi.generate(props.courseId);
        if (cert) {
          certData.value = cert;
          emit("certificate-generated");
        }
      } catch (certErr: any) {
        certError.value = certErr.response?.data?.error || "Error al generar certificado";
      }
    } else {
      canRetake.value = true;
    }
  } catch (e: any) {
    quizError.value = e.response?.data?.error || "Error al enviar respuestas";
  } finally { submitting.value = false; }
}

function closePreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
  previewError.value = "";
}

async function previewCert() {
  if (!certData.value) return;
  previewError.value = "";
  const name = authStore.user?.name || "Estudiante";
  try {
    const url = await getCertificateBlobUrl(certData.value, name);
    previewUrl.value = url;
  } catch (e: any) {
    previewError.value = e?.message || "Error al generar la vista previa";
  }
}

async function downloadCurrentCert() {
  if (!certData.value) return;
  const name = authStore.user?.name || "Estudiante";
  try {
    await downloadCertificatePdf(certData.value, name);
  } catch (e: any) {
    previewError.value = e?.message || "Error al descargar el certificado";
  }
}

async function downloadCert() {
  if (!certData.value) return;
  const name = authStore.user?.name || "Estudiante";
  try {
    await downloadCertificatePdf(certData.value, name);
  } catch (e: any) {
    console.error("Error al descargar:", e);
  }
}
</script>
