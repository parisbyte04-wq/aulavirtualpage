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
          <input v-model="form.slug" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none font-mono text-sm" placeholder="nombre-del-curso" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea v-model="form.description" required rows="4" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
        </div>
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <input v-model="form.category" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" placeholder="Tecnología" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
            <input v-model="form.imageUrl" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
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
import { coursesApi } from "../../services/api";

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => !!route.params.id && route.params.id !== "crear");
const saving = ref(false);
const success = ref("");
const errorMsg = ref("");

const form = reactive({
  title: "", slug: "", description: "", imageUrl: "", category: "", published: false,
});

onMounted(async () => {
  if (isEdit.value) {
    const course = await coursesApi.getById(Number(route.params.id));
    form.title = course.title;
    form.slug = course.slug;
    form.description = course.description;
    form.imageUrl = course.imageUrl || "";
    form.category = course.category || "";
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
    errorMsg.value = e.response?.data?.error || "Error al guardar";
  } finally { saving.value = false; }
}
</script>
