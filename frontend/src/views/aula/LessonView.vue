<template>
  <div class="min-h-screen bg-gray-50">
    <AulaHeader />
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div v-if="loading" class="text-center py-20 text-gray-400">Cargando lección...</div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p class="text-red-700">{{ error }}</p>
        <router-link v-if="nextLessonId" :to="`/aula/${$route.params.courseId}/leccion/${nextLessonId}`"
          class="inline-block mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm">
          Ir a la lección anterior
        </router-link>
      </div>

      <template v-if="data">
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
          <router-link v-if="data.prevLesson" :to="`/aula/${$route.params.courseId}/leccion/${data.prevLesson.id}`"
            class="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-medium">
            &larr; Anterior
          </router-link>
          <div v-else />

          <button v-if="!data.completed" @click="handleComplete" :disabled="completing"
            class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
            {{ completing ? 'Completando...' : 'Marcar como completada' }}
          </button>
          <div v-else class="flex items-center gap-2 text-green-600 font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Completada
          </div>

          <router-link v-if="data.nextLesson" :to="`/aula/${$route.params.courseId}/leccion/${data.nextLesson.id}`"
            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium">
            Siguiente &rarr;
          </router-link>
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
          <QuizPanel :course-id="Number($route.params.courseId)" @certificate-generated="onCertificate" />
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 p-8">
          <h3 class="text-lg font-bold text-gray-900 mb-4">Foro de discusión</h3>
          <div class="mb-4">
            <textarea v-model="newComment" rows="2" placeholder="Escribe un comentario..." class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
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
              <p class="text-sm text-gray-600 ml-9">{{ disc.content }}</p>
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
      </template>
    </main>
    <AulaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed as vComputed } from "vue";
import { useRoute } from "vue-router";
import { lessonsApi, discussionsApi, certificatesApi } from "../../services/api";
import { useAuthStore } from "../../stores/auth";
import AulaHeader from "../../components/layout/AulaHeader.vue";
import AulaFooter from "../../components/layout/AulaFooter.vue";
import QuizPanel from "../../components/aula/QuizPanel.vue";

const route = useRoute();
const authStore = useAuthStore();

const data = ref<any>(null);
const loading = ref(true);
const error = ref("");
const nextLessonId = ref<number | null>(null);
const completing = ref(false);
const completed = ref(false);
const showQuiz = ref(false);
const newComment = ref("");
const discussions = ref<any[]>([]);
const replyText = reactive<Record<number, string>>({});

onMounted(async () => { await load(); });

async function load() {
  loading.value = true; error.value = "";
  try {
    const res = await lessonsApi.getById(Number(route.params.lessonId));
    data.value = res;
    completed.value = res.completed;
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
    data.value.courseProgress.completedLessons++;
    data.value.courseProgress.progress = Math.round((data.value.courseProgress.completedLessons / data.value.courseProgress.totalLessons) * 100);
    if (res.quizAvailable) data.value.canAccessQuiz = true;
  } finally { completing.value = false; }
}

async function postComment() {
  if (!newComment.value.trim()) return;
  const comment = await discussionsApi.create(Number(route.params.lessonId), newComment.value);
  discussions.value.unshift(comment);
  newComment.value = "";
}

async function postReply(discId: number) {
  const text = replyText[discId];
  if (!text?.trim()) return;
  const reply = await discussionsApi.reply(discId, text);
  const disc = discussions.value.find((d) => d.id === discId);
  if (disc) {
    if (!disc.replies) disc.replies = [];
    disc.replies.push(reply);
  }
  replyText[discId] = "";
}

function onCertificate() {
  showQuiz.value = false;
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
