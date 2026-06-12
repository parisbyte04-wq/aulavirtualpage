<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ isEdit ? 'Editar curso' : 'Nuevo curso' }}</h2>
    <div class="bg-white rounded-xl border border-gray-100 p-6 max-w-2xl">
      <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{{ success }}</div>
      <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{{ errorMsg }}</div>

      <form @submit.prevent="handleSave">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input v-model="form.title" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
          <input v-model="form.slug" @input="sanitizeSlug" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none font-mono text-sm" placeholder="nombre-del-curso" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea v-model="form.description" required rows="4" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Área de investigación</label>
            <select v-model="form.researchAreaId" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none bg-white text-sm">
              <option :value="null">Sin área</option>
              <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.title }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Imagen de portada</label>
            <div v-if="form.imageUrl" class="flex items-center gap-2 mb-2">
              <img :src="form.imageUrl" class="h-10 w-16 rounded-lg border border-gray-200 object-cover" />
              <span class="text-xs text-gray-400 truncate flex-1">{{ form.imageUrl.split('/').pop() }}</span>
              <button type="button" @click="form.imageUrl = ''" class="text-red-500 hover:text-red-700 text-xs font-medium">Quitar</button>
            </div>
            <label class="cursor-pointer flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary-400 transition-colors text-xs text-gray-500">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              {{ form.imageUrl ? 'Cambiar imagen' : 'Subir imagen' }}
              <input type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="onUploadImage" :disabled="imageUploading" />
            </label>
            <div v-if="imageUploading" class="text-xs text-gray-400 mt-1">Subiendo imagen...</div>
          </div>
        </div>
        <div class="mb-6">
          <label class="flex items-center gap-3">
            <input v-model="form.published" type="checkbox" class="w-4 h-4 text-primary-600 rounded" />
            <span class="text-sm font-medium text-gray-700">Publicado (visible para estudiantes)</span>
          </label>
        </div>
        <div class="flex gap-3">
          <button type="submit" :disabled="saving" class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl disabled:opacity-50">
            {{ saving ? 'Guardando...' : 'Guardar curso' }}
          </button>
          <router-link to="/admin/courses" class="px-6 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100">Cancelar</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { coursesApi, uploadsApi, researchAreas } from "../../services/api";
import type { Course, ResearchArea } from "../../types";

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id && route.params.id !== "crear");
const saving = ref(false);
const success = ref("");
const errorMsg = ref("");
const imageUploading = ref(false);
const areas = ref<ResearchArea[]>([]);

const form = reactive({
  title: "", slug: "", description: "", imageUrl: "", category: "", researchAreaId: null as number | null, published: false,
});

onMounted(async () => {
  const [allAreas] = await Promise.all([researchAreas.getAll()]);
  areas.value = allAreas;
  if (isEdit.value) {
    const course = await coursesApi.getById(Number(route.params.id)) as Course;
    form.title = course.title;
    form.slug = course.slug;
    form.description = course.description;
    form.imageUrl = course.imageUrl || "";
    form.category = course.category || "";
    form.researchAreaId = course.researchAreaId;
    form.published = course.published;
  }
});

async function handleSave() {
  saving.value = true; success.value = ""; errorMsg.value = "";
  try {
    if (isEdit.value) {
      await coursesApi.update(Number(route.params.id), { ...form });
    } else {
      await coursesApi.create({ ...form });
    }
    success.value = "Curso guardado correctamente";
    setTimeout(() => router.push("/admin/courses"), 1000);
  } catch (e: any) {
    const msg = e.response?.data?.error || "";
    if (msg.includes("Unique") || msg.includes("unique") || msg.includes("slug")) {
      errorMsg.value = "Ya existe un curso con ese slug";
    } else {
      errorMsg.value = msg || "Error al guardar";
    }
  } finally { saving.value = false; }
}

function sanitizeSlug() {
  form.slug = form.slug
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function onUploadImage(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  imageUploading.value = true;
  try {
    const { url } = await uploadsApi.uploadCourseImage(file);
    form.imageUrl = url;
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || "Error al subir la imagen";
  } finally {
    imageUploading.value = false;
    target.value = "";
  }
}
</script>
