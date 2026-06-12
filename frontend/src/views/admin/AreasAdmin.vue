<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Áreas de Investigación</h2>
      <button @click="openCreate" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        + Nueva área
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400">Cargando áreas...</div>
    <template v-else>
    <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{{ errorMsg }}</div>
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="areas.length === 0" class="text-gray-400 text-sm py-8 text-center">No hay áreas registradas</div>
      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Título</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Descripción</th>
            <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="area in areas" :key="area.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ area.title }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell max-w-xs truncate">{{ area.description }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="edit(area)" class="text-primary-600 hover:text-primary-800 text-sm font-medium mr-3">Editar</button>
              <button @click="remove(area.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="showModal = false">
      <div class="absolute inset-0 bg-black/50" />
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-lg" @click.stop>
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ editing ? 'Editar área' : 'Nueva área' }}</h3>
        <form @submit.prevent="handleSave">
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input v-model="form.title" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea v-model="form.description" required rows="3" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Icono</label>
            <select v-model="form.icon" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
              <option value="cpu">CPU</option>
              <option value="dna">ADN</option>
              <option value="zap">Rayo</option>
              <option value="bar-chart">Gráfico</option>
              <option value="flask">Matraz</option>
            </select>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Orden</label>
            <input v-model.number="form.order" type="number" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div class="flex gap-3 justify-end">
            <button type="button" @click="showModal = false" class="px-4 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100">Cancelar</button>
            <button type="submit" :disabled="saving" class="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl disabled:opacity-50">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { researchAreas } from "../../services/api";
import type { ResearchArea } from "../../types";

const areas = ref<ResearchArea[]>([]);
const showModal = ref(false);
const editing = ref<ResearchArea | null>(null);
const saving = ref(false);
const loading = ref(true);
const errorMsg = ref("");
const form = reactive({ title: "", description: "", icon: "flask", order: 0 });

onMounted(load);

async function load() {
  try { areas.value = await researchAreas.getAll(); }
  finally { loading.value = false; }
}

function openCreate() {
  editing.value = null;
  form.title = "";
  form.description = "";
  form.icon = "flask";
  form.order = 0;
  showModal.value = true;
}

function edit(area: ResearchArea) {
  editing.value = area;
  form.title = area.title;
  form.description = area.description;
  form.icon = area.icon;
  form.order = area.order;
  showModal.value = true;
}

async function handleSave() {
  saving.value = true;
  errorMsg.value = "";
  try {
    if (editing.value) {
      await researchAreas.update(editing.value.id, { ...form });
    } else {
      await researchAreas.create({ ...form });
    }
    showModal.value = false;
    await load();
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || "Error al guardar";
  } finally {
    saving.value = false;
  }
}

async function remove(id: number) {
  if (confirm("¿Eliminar esta área?")) {
    errorMsg.value = "";
    try {
      await researchAreas.remove(id);
      await load();
    } catch (e: any) {
      errorMsg.value = e.response?.data?.error || "Error al eliminar";
    }
  }
}
</script>
