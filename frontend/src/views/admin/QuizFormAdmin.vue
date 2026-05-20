<template>
  <div class="max-w-3xl">
    <div class="mb-6">
      <router-link :to="`/admin/courses/${courseId}/lessons`" class="text-sm text-primary-600 hover:underline">&larr; Volver al curso</router-link>
      <h2 class="text-2xl font-bold text-gray-900 mt-1">Cuestionario del curso</h2>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <h3 class="font-bold text-gray-900 mb-4">Configuración</h3>
      <div class="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Título del examen</label>
          <input v-model="quizForm.title" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Puntaje mínimo (%)</label>
          <input v-model.number="quizForm.passingScore" type="number" min="0" max="100"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
        </div>
      </div>
      <button @click="saveQuiz" :disabled="savingQuiz" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50">
        {{ savingQuiz ? 'Guardando...' : 'Guardar configuración' }}
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="font-bold text-gray-900">Preguntas ({{ questions.length }})</h3>
        <button @click="addQuestion" class="px-4 py-2 bg-accent-500 hover:bg-accent-400 text-white text-sm font-semibold rounded-xl transition-colors">
          + Agregar pregunta
        </button>
      </div>

      <div v-if="questions.length === 0" class="text-gray-400 text-sm py-8 text-center">
        No hay preguntas. Agrega la primera pregunta.
      </div>

      <div v-for="(q, i) in questions" :key="q._key" class="mb-6 p-4 rounded-xl border border-gray-100 bg-gray-50">
        <div class="flex items-center justify-between mb-3">
          <span class="text-sm font-bold text-gray-700">Pregunta {{ i + 1 }}</span>
          <button @click="removeQuestion(i)" class="text-red-600 hover:text-red-800 text-sm">Eliminar</button>
        </div>
        <div class="mb-3">
          <label class="block text-xs font-medium text-gray-600 mb-1">Texto de la pregunta</label>
          <input v-model="q.text" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" />
        </div>
        <div class="mb-2">
          <label class="block text-xs font-medium text-gray-600 mb-1">Opciones (una por línea)</label>
          <textarea v-model="q.optionsText" rows="4" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm font-mono resize-none"
            placeholder="Opción 1&#10;Opción 2&#10;Opción 3&#10;Opción 4" />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-600 mb-1">Índice de respuesta correcta (0 basado)</label>
          <input v-model.number="q.correctIndex" type="number" min="0"
            class="w-20 px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" />
        </div>
      </div>

      <button v-if="questions.length > 0" @click="saveAll" :disabled="saving"
        class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl disabled:opacity-50">
        {{ saving ? 'Guardando preguntas...' : 'Guardar todas las preguntas' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { quizzesApi } from "../../services/api";

const route = useRoute();
const courseId = Number(route.params.courseId);

const quizForm = reactive({ title: "Examen Final", passingScore: 70 });
const questions = ref<any[]>([]);
const saving = ref(false);
const savingQuiz = ref(false);
let keyCounter = 0;

onMounted(async () => {
  const data = await quizzesApi.adminGetByCourse(courseId);
  if (data) {
    quizForm.title = data.title;
    quizForm.passingScore = data.passingScore;
    questions.value = (data.questions || []).map((q: any) => ({
      _key: keyCounter++,
      id: q.id,
      text: q.text,
      optionsText: (q.options || []).join("\n"),
      correctIndex: q.correctIndex,
      _existing: true,
    }));
  }
});

function addQuestion() {
  questions.value.push({
    _key: keyCounter++,
    id: null,
    text: "",
    optionsText: "",
    correctIndex: 0,
    _existing: false,
  });
}

function removeQuestion(index: number) {
  questions.value.splice(index, 1);
}

async function saveQuiz() {
  savingQuiz.value = true;
  try {
    await quizzesApi.adminSave(courseId, { title: quizForm.title, passingScore: quizForm.passingScore });
    alert("Configuración guardada");
  } finally { savingQuiz.value = false; }
}

async function saveAll() {
  saving.value = true;
  try {
    await quizzesApi.adminSave(courseId, { title: quizForm.title, passingScore: quizForm.passingScore });

    for (const q of questions.value) {
      const options = q.optionsText.split("\n").filter((o: string) => o.trim());
      const data = { text: q.text, options, correctIndex: q.correctIndex, order: questions.value.indexOf(q) };
      if (q._existing && q.id) {
        await quizzesApi.adminUpdateQuestion(q.id, data);
      } else {
        const quizData = await quizzesApi.adminGetByCourse(courseId);
        await quizzesApi.adminCreateQuestion(quizData.id, data);
      }
    }
    alert("Preguntas guardadas correctamente");
  } finally { saving.value = false; }
}
</script>
