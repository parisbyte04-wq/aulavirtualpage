<template>
  <div class="max-w-4xl">
    <div class="mb-6">
      <router-link :to="`/admin/courses/${courseId}/lessons`" class="text-sm text-primary-600 hover:underline">&larr; Volver a lecciones</router-link>
      <h2 class="text-2xl font-bold text-gray-900 mt-1">{{ isEdit ? 'Editar lección' : 'Nueva lección' }}</h2>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 p-6">
      <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{{ success }}</div>
      <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{{ errorMsg }}</div>

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
          <label class="block text-sm font-medium text-gray-700 mb-1">Contenido</label>
          <div class="border border-gray-200 rounded-xl overflow-hidden">
            <div class="bg-gray-50 px-4 py-2 border-b border-gray-200 flex gap-1 flex-wrap">
              <button type="button" @click="editor?.chain().focus().toggleBold().run()" class="px-2.5 py-1 text-sm font-bold rounded hover:bg-gray-200 transition-colors" :class="{ 'bg-gray-200': editor?.isActive('bold') }" title="Negrita">B</button>
              <button type="button" @click="editor?.chain().focus().toggleItalic().run()" class="px-2.5 py-1 text-sm italic rounded hover:bg-gray-200 transition-colors" :class="{ 'bg-gray-200': editor?.isActive('italic') }" title="Cursiva">I</button>
              <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()" class="px-2.5 py-1 text-sm rounded hover:bg-gray-200 transition-colors" :class="{ 'bg-gray-200': editor?.isActive('heading', { level: 2 }) }" title="Título H2">H2</button>
              <button type="button" @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()" class="px-2.5 py-1 text-sm rounded hover:bg-gray-200 transition-colors" :class="{ 'bg-gray-200': editor?.isActive('heading', { level: 3 }) }" title="Subtítulo H3">H3</button>
              <button type="button" @click="editor?.chain().focus().toggleBulletList().run()" class="px-2.5 py-1 text-sm rounded hover:bg-gray-200 transition-colors" :class="{ 'bg-gray-200': editor?.isActive('bulletList') }" title="Lista">• Lista</button>
              <button type="button" @click="editor?.chain().focus().toggleOrderedList().run()" class="px-2.5 py-1 text-sm rounded hover:bg-gray-200 transition-colors" :class="{ 'bg-gray-200': editor?.isActive('orderedList') }" title="Lista numerada">1. Lista</button>
              <button type="button" @click="setLink" class="px-2.5 py-1 text-sm rounded hover:bg-gray-200 transition-colors" :class="{ 'bg-gray-200': editor?.isActive('link') }" title="Enlace">🔗 Link</button>
              <button type="button" @click="addImage" class="px-2.5 py-1 text-sm rounded hover:bg-gray-200 transition-colors" title="Imagen">🖼 Img</button>
              <button type="button" @click="editor?.chain().focus().toggleBlockquote().run()" class="px-2.5 py-1 text-sm rounded hover:bg-gray-200 transition-colors" :class="{ 'bg-gray-200': editor?.isActive('blockquote') }" title="Cita">❝ Cita</button>
              <button type="button" @click="editor?.chain().focus().toggleCode().run()" class="px-2.5 py-1 text-sm font-mono rounded hover:bg-gray-200 transition-colors" :class="{ 'bg-gray-200': editor?.isActive('code') }" title="Código">&lt;/&gt;</button>
            </div>
            <editor-content :editor="editor" class="px-4 py-3 min-h-[300px] prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:outline-none" />
          </div>
          <p class="text-xs text-gray-400 mt-1">Editor visual. Usa los botones de formato para dar estilo al contenido.</p>
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
import { reactive, ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { lessonsApi } from "../../services/api";

const route = useRoute();
const router = useRouter();
const courseId = Number(route.params.courseId);
const isEdit = computed(() => !!route.params.lessonId);
const saving = ref(false);
const success = ref("");
const errorMsg = ref("");

const form = reactive({
  courseId,
  title: "", content: "", videoUrl: "", order: 0, duration: 0,
});

const editor = useEditor({
  content: "",
  extensions: [
    StarterKit,
    Link.configure({ openOnClick: false }),
    Image,
  ],
  editorProps: {
    attributes: { class: "outline-none" },
  },
});

onMounted(async () => {
  if (isEdit.value) {
    const lesson = await lessonsApi.getById(Number(route.params.lessonId));
    form.title = lesson.lesson.title;
    form.content = lesson.lesson.content;
    form.videoUrl = lesson.lesson.videoUrl || "";
    form.order = lesson.lesson.order;
    form.duration = lesson.lesson.duration || 0;
    editor.value?.commands.setContent(lesson.lesson.content || "");
  }
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

function setLink() {
  if (!editor.value) return;
  const previousUrl = editor.value.getAttributes("link").href;
  const url = window.prompt("URL:", previousUrl || "https://");
  if (url === null) return;
  if (url === "") {
    editor.value.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }
  editor.value.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
}

function addImage() {
  const url = window.prompt("URL de la imagen:");
  if (url) {
    editor.value?.chain().focus().setImage({ src: url }).run();
  }
}

async function handleSave() {
  saving.value = true; success.value = ""; errorMsg.value = "";
  const content = editor.value?.getHTML() || "";
  try {
    if (isEdit.value) {
      await lessonsApi.adminUpdate(Number(route.params.lessonId), { ...form, content });
    } else {
      await lessonsApi.adminCreate({ ...form, content });
    }
    success.value = "Lección guardada correctamente";
    setTimeout(() => router.push(`/admin/courses/${courseId}/lessons`), 1000);
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || "Error al guardar";
  } finally { saving.value = false; }
}
</script>
