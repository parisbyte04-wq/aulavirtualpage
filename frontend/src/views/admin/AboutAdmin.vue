<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Sobre nosotros</h2>
    <div class="bg-white rounded-xl border border-gray-100 p-6 max-w-2xl">
      <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{{ success }}</div>
      <form @submit.prevent="handleSave">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input v-model="form.title" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Misión</label>
          <textarea v-model="form.mission" rows="3" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Visión</label>
          <textarea v-model="form.vision" rows="3" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Historia</label>
          <textarea v-model="form.history" rows="4" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
        </div>
        <button type="submit" :disabled="loading" class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl disabled:opacity-50">
          {{ loading ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { about as aboutApi } from "../../services/api";

const form = reactive({ title: "", mission: "", vision: "", history: "" });
const loading = ref(false);
const success = ref("");

onMounted(async () => {
  const data = await aboutApi.get();
  if (data) {
    form.title = data.title || "";
    form.mission = data.mission || "";
    form.vision = data.vision || "";
    form.history = data.history || "";
  }
});

async function handleSave() {
  loading.value = true;
  success.value = "";
  try {
    await aboutApi.update({ ...form });
    success.value = "Cambios guardados correctamente";
  } catch {
    success.value = "Error al guardar";
  } finally {
    loading.value = false;
  }
}
</script>
