<template>
  <div>
    <h3 class="text-lg font-bold text-gray-900 mb-4">Examen Final</h3>

    <div v-if="loading" class="text-center py-8 text-gray-400">Cargando examen...</div>

    <div v-if="quizError" class="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{{ quizError }}</div>

    <!-- Show existing submission result -->
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
      <p v-if="submission.passed && !certGenerated" class="text-gray-500 text-sm mt-4">Puedes generar tu certificado desde "Mis Cursos".</p>
      <p v-if="certGenerated" class="text-green-600 font-medium text-sm mt-4">¡Certificado generado! Revísalo en "Mis Certificados".</p>
    </div>

    <!-- Quiz questions -->
    <div v-if="questions.length > 0 && !submission">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { quizzesApi, certificatesApi } from "../../services/api";

const props = defineProps<{ courseId: number }>();
const emit = defineEmits<{ "certificate-generated": [] }>();

const loading = ref(true);
const quizError = ref("");
const questions = ref<any[]>([]);
const quizInfo = ref<any>(null);
const submission = ref<any>(null);
const selectedAnswers = ref<number[]>([]);
const submitting = ref(false);
const certGenerated = ref(false);

const allAnswered = computed(() => {
  return questions.value.length > 0 && selectedAnswers.value.length === questions.value.length
    && selectedAnswers.value.every((a) => a !== undefined && a !== null);
});

onMounted(loadQuiz);

async function loadQuiz() {
  try {
    const data = await quizzesApi.getByCourse(props.courseId);
    quizInfo.value = data.quiz;
    questions.value = data.questions;
    submission.value = data.submission;
    if (data.submission) {
      selectedAnswers.value = data.submission.answers || [];
    }
  } catch (e: any) {
    quizError.value = e.response?.data?.error || "Error al cargar el examen";
  } finally { loading.value = false; }
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
    if (result.passed) {
      const cert = await certificatesApi.generate(props.courseId);
      if (cert) {
        certGenerated.value = true;
        emit("certificate-generated");
      }
    }
  } catch (e: any) {
    quizError.value = e.response?.data?.error || "Error al enviar respuestas";
  } finally { submitting.value = false; }
}
</script>
