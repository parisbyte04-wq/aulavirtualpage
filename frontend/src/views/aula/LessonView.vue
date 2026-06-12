<template>
  <div class="min-h-screen bg-gray-50">
    <AulaHeader />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div v-if="loading" class="text-center py-20 text-gray-400 animate-pulse">
        <div class="max-w-4xl mx-auto space-y-6">
          <div class="h-6 w-48 bg-gray-200 rounded" />
          <div class="h-8 w-3/4 bg-gray-200 rounded" />
          <div class="h-3 bg-gray-200 rounded-full" />
          <div class="aspect-video bg-gray-200 rounded-2xl" />
          <div class="h-64 bg-gray-100 rounded-2xl" />
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p class="text-red-700">{{ error }}</p>
        <router-link v-if="nextLessonId" :to="`/aula/${$route.params.courseId}/leccion/${nextLessonId}`"
          class="inline-block mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">
          Ir a la lección anterior
        </router-link>
      </div>

      <template v-if="data">
        <div class="flex gap-8">
          <!-- Sidebar with lesson list -->
          <div class="hidden lg:block w-72 shrink-0">
            <div class="bg-white rounded-2xl border border-gray-100 p-4 sticky top-28">
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Lecciones</h3>
              <div class="space-y-1">
                <div v-for="(lesson, i) in allLessons" :key="lesson.id"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors"
                  :class="[
                    lesson.id === data.lesson.id
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : lesson.completed
                        ? 'bg-green-50 text-green-700'
                        : canAccessLesson(i)
                          ? 'text-gray-600 hover:bg-gray-50'
                          : 'text-gray-400 cursor-not-allowed'
                  ]"
                >
                  <router-link v-if="canAccessLesson(i)" :to="`/aula/${$route.params.courseId}/leccion/${lesson.id}`"
                    class="flex items-center gap-3 w-full">
                    <div class="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0"
                      :class="
                        lesson.id === data.lesson.id
                          ? 'bg-primary-600 text-white'
                          : lesson.completed
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 text-gray-500'
                      "
                    >
                      <svg v-if="lesson.completed" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                      </svg>
                      <span v-else>{{ i + 1 }}</span>
                    </div>
                    <span class="truncate">{{ lesson.title }}</span>
                  </router-link>
                  <div v-else class="flex items-center gap-3 w-full">
                    <div class="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0 bg-gray-100 text-gray-400">
                      {{ i + 1 }}
                    </div>
                    <span class="truncate">{{ lesson.title }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1 min-w-0 max-w-4xl">
            <div class="mb-6 flex items-center justify-between">
              <div>
                <router-link :to="`/aula/${$route.params.courseId}`" class="text-sm text-primary-600 hover:underline">&larr; Volver al curso</router-link>
                <h1 class="text-2xl font-bold text-gray-900 mt-2">{{ data.lesson.title }}</h1>
              </div>
              <div class="text-sm text-gray-500">{{ data.courseProgress.completedLessons }}/{{ data.courseProgress.totalLessons }} completadas</div>
            </div>

            <div class="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div class="bg-primary-600 h-2 rounded-full transition-all" :style="{ width: data.courseProgress.progress + '%' }" />
            </div>

            <div v-if="data.lesson.videoUrl" class="aspect-video bg-black rounded-2xl overflow-hidden mb-8">
              <iframe :src="data.lesson.videoUrl" class="w-full h-full" frameborder="0" allowfullscreen />
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 p-8 mb-8 lesson-content max-w-none" v-html="data.lesson.content" />

            <div class="flex items-center justify-between gap-4 mb-12">
              <router-link v-if="prevLesson" :to="`/aula/${$route.params.courseId}/leccion/${prevLesson.id}`"
                class="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium">
                &larr; Anterior
              </router-link>
              <div v-else />

              <div class="flex items-center gap-3">
                <button v-if="!completed" @click="handleComplete" :disabled="completing"
                  class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
                  {{ completing ? 'Completando...' : 'Marcar como completada' }}
                </button>
                <div v-else class="flex items-center gap-3 text-green-600 font-medium">
                  <span class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Completada
                  </span>
                  <button @click="handleReset" :disabled="resetting"
                    class="text-xs text-gray-500 hover:text-red-600 underline underline-offset-2 transition-colors disabled:opacity-50">
                    {{ resetting ? 'Reiniciando...' : 'Reiniciar lección' }}
                  </button>
                </div>
              </div>

              <router-link v-if="nextLesson && completed" :to="`/aula/${$route.params.courseId}/leccion/${nextLesson.id}`"
                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium">
                Siguiente &rarr;
              </router-link>
              <span v-else-if="nextLesson && !completed"
                class="px-4 py-2 bg-gray-200 text-gray-400 rounded-xl text-sm font-medium cursor-not-allowed select-none"
                title="Completa esta lección primero">
                Siguiente &rarr;
              </span>
              <div v-else />
            </div>

            <div v-if="data.canAccessQuiz && completed" class="bg-accent-50 border border-accent-200 rounded-2xl p-6 mb-8">
              <h3 class="font-bold text-gray-900 mb-2">¡Has completado todas las lecciones!</h3>
              <p class="text-gray-600 text-sm mb-4">Ahora puedes realizar el examen final para obtener tu certificado.</p>
              <button @click="showQuiz = !showQuiz" class="px-6 py-2.5 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded-xl transition-all">
                {{ showQuiz ? 'Cerrar examen' : 'Realizar examen final' }}
              </button>
            </div>

            <div v-if="showQuiz" class="bg-white rounded-2xl border border-gray-100 p-8 mb-8">
              <QuizPanel :course-id="Number($route.params.courseId)" @certificate-generated="onCertificate" :key="quizKey" />
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 p-8">
              <h3 class="text-lg font-bold text-gray-900 mb-4">Foro de discusión</h3>
              <div class="mb-4">
                <textarea v-model="newComment" rows="2" placeholder="Escribe un comentario..."
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
                <button @click="postComment" :disabled="!newComment.trim()" class="mt-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl disabled:opacity-50">
                  Publicar
                </button>
              </div>
              <div class="space-y-4" v-if="discussions.length > 0">
                <div v-for="disc in discussions" :key="disc.id" class="border-b border-gray-100 pb-4">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="w-7 h-7 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                      {{ disc.user.name.charAt(0) }}
                    </div>
                    <span class="font-medium text-sm text-gray-900">{{ disc.user.name }}</span>
                    <span class="text-xs text-gray-400">{{ formatDate(disc.createdAt) }}</span>
                  </div>
                  <p class="text-sm text-gray-600 ml-9 whitespace-pre-wrap">{{ disc.content }}</p>
                  <div v-if="disc.replies && disc.replies.length > 0" class="ml-9 mt-3 space-y-2">
                    <div v-for="reply in disc.replies" :key="reply.id" class="flex items-start gap-2">
                      <div class="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-bold shrink-0">
                        {{ reply.user.name.charAt(0) }}
                      </div>
                      <div>
                        <span class="font-medium text-xs text-gray-900">{{ reply.user.name }}</span>
                        <p class="text-sm text-gray-600">{{ reply.content }}</p>
                      </div>
                    </div>
                  </div>
                  <div class="ml-9 mt-2">
                    <input v-model="replyText[disc.id]" placeholder="Responder..." class="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:border-primary-500 outline-none"
                      @keyup.enter="postReply(disc.id)" />
                  </div>
                </div>
              </div>
              <p v-else class="text-sm text-gray-400 py-4 text-center">No hay comentarios aún. ¡Sé el primero!</p>
            </div>
          </div>
        </div>
      </template>
    </main>
    <AulaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { lessonsApi, discussionsApi, certificatesApi, type LessonData } from "../../services/api";
import type { Discussion } from "../../types";
import { useAuthStore } from "../../stores/auth";
import AulaHeader from "../../components/layout/AulaHeader.vue";
import AulaFooter from "../../components/layout/AulaFooter.vue";
import QuizPanel from "../../components/aula/QuizPanel.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const data = ref<LessonData | null>(null);
const loading = ref(true);
const error = ref("");
const nextLessonId = ref<number | null>(null);
const completing = ref(false);
const resetting = ref(false);
const completed = ref(false);
const showQuiz = ref(false);
const newComment = ref("");
const discussions = ref<Discussion[]>([]);
const replyText = reactive<Record<number, string>>({});
const allLessons = ref<{ id: number; title: string; order: number; completed: boolean }[]>([]);
const completedLessonIds = ref<number[]>([]);
const quizKey = ref(0);

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});

watch(() => route.params.lessonId, () => {
  load();
}, { immediate: true });

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "ArrowLeft" && prevLesson.value && !e.ctrlKey && !e.metaKey) {
    router.push(`/aula/${route.params.courseId}/leccion/${prevLesson.value.id}`);
  }
  if (e.key === "ArrowRight" && nextLesson.value && completed.value && !e.ctrlKey && !e.metaKey) {
    router.push(`/aula/${route.params.courseId}/leccion/${nextLesson.value.id}`);
  }
}

const currentLessonIndex = computed(() =>
  allLessons.value.findIndex((l) => l.id === Number(route.params.lessonId))
);

const prevLesson = computed(() =>
  currentLessonIndex.value > 0 ? allLessons.value[currentLessonIndex.value - 1] : null
);

const nextLesson = computed(() =>
  currentLessonIndex.value < allLessons.value.length - 1 ? allLessons.value[currentLessonIndex.value + 1] : null
);

function canAccessLesson(index: number): boolean {
  return index === 0 || allLessons.value[index - 1]?.completed === true;
}

async function load() {
  loading.value = true; error.value = ""; showQuiz.value = false;
  data.value = null; completed.value = false;
  discussions.value = []; newComment.value = "";
  try {
    const res = await lessonsApi.getById(Number(route.params.lessonId));
    data.value = res;
    completed.value = res.completed;
    allLessons.value = res.allLessons || [];
    completedLessonIds.value = res.completedLessonIds || [];
    discussions.value = await discussionsApi.getByLesson(Number(route.params.lessonId));
  } catch (e: any) {
    error.value = e.response?.data?.error || "Error al cargar la lección";
    nextLessonId.value = e.response?.data?.nextLessonId || null;
  } finally { loading.value = false; }
}

async function handleComplete() {
  completing.value = true;
  try {
    const res = await lessonsApi.complete(Number(route.params.lessonId));
    completed.value = true;
    if (data.value) {
      data.value.completed = true;
      data.value.courseProgress.completedLessons++;
      data.value.courseProgress.progress = Math.round((data.value.courseProgress.completedLessons / data.value.courseProgress.totalLessons) * 100);
      if (res.quizAvailable) data.value.canAccessQuiz = true;
    }
    const lessonId = Number(route.params.lessonId);
    if (!completedLessonIds.value.includes(lessonId)) {
      completedLessonIds.value.push(lessonId);
    }
    const lesson = allLessons.value.find((l) => l.id === lessonId);
    if (lesson) lesson.completed = true;
  } finally { completing.value = false; }
}

async function handleReset() {
  resetting.value = true;
  try {
    const lessonId = Number(route.params.lessonId);
    await lessonsApi.resetProgress(lessonId);
    completed.value = false;
    if (data.value) {
      data.value.completed = false;
      data.value.courseProgress.completedLessons--;
      data.value.courseProgress.progress = Math.round((data.value.courseProgress.completedLessons / data.value.courseProgress.totalLessons) * 100);
    }
    const idx = completedLessonIds.value.indexOf(lessonId);
    if (idx !== -1) completedLessonIds.value.splice(idx, 1);
    const lesson = allLessons.value.find((l) => l.id === lessonId);
    if (lesson) lesson.completed = false;
  } finally { resetting.value = false; }
}

async function postComment() {
  if (!newComment.value.trim()) return;
  const comment = await discussionsApi.create(Number(route.params.lessonId), newComment.value) as any;
  discussions.value.unshift(comment);
  newComment.value = "";
}

async function postReply(discId: number) {
  const text = replyText[discId];
  if (!text?.trim()) return;
  const reply = await discussionsApi.reply(discId, text) as any;
  const disc = discussions.value.find((d) => d.id === discId);
  if (disc) {
    if (!disc.replies) disc.replies = [];
    disc.replies.push(reply);
  }
  replyText[discId] = "";
}

function onCertificate() {
  showQuiz.value = false;
  quizKey.value++;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}
</script>

<style>
.lesson-content h2 { font-size: 1.25rem; font-weight: 700; color: #111827; margin-top: 1.5rem; margin-bottom: 0.75rem; }
.lesson-content h3 { font-size: 1.125rem; font-weight: 600; color: #111827; margin-top: 1.25rem; margin-bottom: 0.5rem; }
.lesson-content p { color: #4b5563; line-height: 1.625; margin-bottom: 1rem; }
.lesson-content ul { list-style: disc; list-style-position: inside; color: #4b5563; margin-bottom: 1rem; }
.lesson-content ul li { margin-bottom: 0.25rem; }
.lesson-content ol { list-style: decimal; list-style-position: inside; color: #4b5563; margin-bottom: 1rem; }
.lesson-content ol li { margin-bottom: 0.25rem; }
.lesson-content strong { color: #111827; }
.lesson-content a { color: #2563eb; text-decoration: underline; }
.lesson-content blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; color: #6b7280; font-style: italic; margin: 1rem 0; }
.lesson-content img { max-width: 100%; border-radius: 0.75rem; margin: 1rem 0; }
</style>
