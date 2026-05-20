<template>
  <div class="max-w-4xl">
    <div class="mb-6">
      <router-link :to="`/admin/courses/${courseId}/lessons`" class="text-sm text-primary-600 hover:underline">&larr; Volver a lecciones</router-link>
      <h2 class="text-2xl font-bold text-gray-900 mt-1">{{ isEdit ? 'Editar lección' : 'Nueva lección' }}</h2>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 p-6">
      <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{{ success }}</div>

      <form @submit.prevent="handleSave">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input v-model="form.title" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Orden</label>
              <input v-model.number="form.order" type="number" min="0" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Duración (min)</label>
              <input v-model.number="form.duration" type="number" min="0" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
            </div>
          </div>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">URL de video (YouTube embed)</label>
          <input v-model="form.videoUrl" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" placeholder="https://www.youtube.com/embed/VIDEO_ID" />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Contenido (editor)</label>
          <div class="border border-gray-200 rounded-xl overflow-hidden">
            <div class="bg-gray-50 px-4 py-2 border-b border-gray-200 flex gap-2">
              <button type="button" @click="exec('bold')" class="px-2 py-1 text-sm font-bold hover:bg-gray-200 rounded" title="Negrita">B</button>
              <button type="button" @click="exec('italic')" class="px-2 py-1 text-sm italic hover:bg-gray-200 rounded" title="Cursiva">I</button>
              <button type="button" @click="exec('heading')" class="px-2 py-1 text-sm hover:bg-gray-200 rounded" title="Título">H2</button>
              <button type="button" @click="exec('bullet')" class="px-2 py-1 text-sm hover:bg-gray-200 rounded" title="Lista">• Lista</button>
              <button type="button" @click="exec('ordered')" class="px-2 py-1 text-sm hover:bg-gray-200 rounded" title="Lista numerada">1. Lista</button>
              <button type="button" @click="exec('link')" class="px-2 py-1 text-sm hover:bg-gray-200 rounded" title="Enlace">Link</button>
            </div>
            <textarea ref="editorRef" v-model="form.content" rows="16"
              class="w-full px-4 py-3 font-mono text-sm border-0 focus:outline-none resize-none"
              placeholder="Escribe el contenido HTML aquí... (puedes pegar HTML directamente)"
            />
          </div>
          <p class="text-xs text-gray-400 mt-1">Editor de texto plano con soporte HTML. Puedes pegar contenido directamente en formato HTML.</p>
        </div>
        <div class="flex gap-3">
          <button type="submit" :disabled="saving" class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl disabled:opacity-50">
            {{ saving ? 'Guardando...' : 'Guardar lección' }}
          </button>
          <router-link :to="`/admin/courses/${courseId}/lessons`" class="px-6 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100">Cancelar</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { lessonsApi } from "../../services/api";

const route = useRoute();
const router = useRouter();
const courseId = Number(route.params.courseId);
const isEdit = computed(() => !!route.params.lessonId);
const saving = ref(false);
const success = ref("");
const editorRef = ref<HTMLTextAreaElement | null>(null);

const form = reactive({
  courseId,
  title: "", content: "", videoUrl: "", order: 0, duration: 0,
});

onMounted(async () => {
  if (isEdit.value) {
    const lesson = await lessonsApi.getById(Number(route.params.lessonId));
    form.title = lesson.lesson.title;
    form.content = lesson.lesson.content;
    form.videoUrl = lesson.lesson.videoUrl || "";
    form.order = lesson.lesson.order;
    form.duration = lesson.lesson.duration || 0;
  }
});

function exec(cmd: string) {
  const ta = editorRef.value;
  if (!ta) return;
  const start = ta.selectionStart;
  const end = ta.selectionEnd;
  const selected = form.content.substring(start, end);

  let insert = "";
  switch (cmd) {
    case "bold": insert = `<strong>${selected}</strong>`; break;
    case "italic": insert = `<em>${selected}</em>`; break;
    case "heading": insert = `<h2>${selected}</h2>`; break;
    case "bullet": insert = `\n<ul>\n  <li>${selected}</li>\n</ul>`; break;
    case "ordered": insert = `\n<ol>\n  <li>${selected}</li>\n</ol>`; break;
    case "link": {
      const url = prompt("URL:");
      if (url) insert = `<a href="${url}">${selected || url}</a>`;
      else return;
      break;
    }
    default: return;
  }

  form.content = form.content.substring(0, start) + insert + form.content.substring(end);
}

async function handleSave() {
  saving.value = true; success.value = "";
  try {
    if (isEdit.value) {
      await lessonsApi.adminUpdate(Number(route.params.lessonId), { ...form });
    } else {
      await lessonsApi.adminCreate({ ...form });
    }
    success.value = "Lección guardada correctamente";
    setTimeout(() => router.push(`/admin/courses/${courseId}/lessons`), 1000);
  } finally { saving.value = false; }
}
</script>
