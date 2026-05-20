<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Publicaciones y Noticias</h2>
      <button @click="openCreate" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        + Nueva publicación
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="items.length === 0" class="text-gray-400 text-sm py-8 text-center">No hay publicaciones registradas</div>
      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Título</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Tipo</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Fecha</th>
            <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in items" :key="item.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.title }}</td>
            <td class="px-6 py-4 text-sm hidden md:table-cell">
              <span class="px-2 py-0.5 rounded-full text-xs font-semibold"
                :class="item.type === 'article' ? 'bg-primary-50 text-primary-700' : 'bg-accent-50 text-accent-700'"
              >{{ item.type === 'article' ? 'Artículo' : 'Noticia' }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{{ formatDate(item.date) }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="edit(item)" class="text-primary-600 hover:text-primary-800 text-sm font-medium mr-3">Editar</button>
              <button @click="remove(item.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="showModal = false">
      <div class="absolute inset-0 bg-black/50" />
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-lg" @click.stop>
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ editing ? 'Editar publicación' : 'Nueva publicación' }}</h3>
        <form @submit.prevent="handleSave">
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input v-model="form.title" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Resumen</label>
            <textarea v-model="form.summary" required rows="2" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
          </div>
          <div class="grid grid-cols-2 gap-3 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select v-model="form.type" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
                <option value="article">Artículo</option>
                <option value="news">Noticia</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input v-model="form.date" type="date" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
            </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { publications } from "../../services/api";
import type { Publication } from "../../types";

const items = ref<Publication[]>([]);
const showModal = ref(false);
const editing = ref<Publication | null>(null);
const saving = ref(false);
const form = reactive({ title: "", summary: "", type: "article", date: new Date().toISOString().split("T")[0] });

onMounted(async () => { items.value = await publications.getAll(); });

function openCreate() {
  editing.value = null;
  form.title = ""; form.summary = ""; form.type = "article";
  form.date = new Date().toISOString().split("T")[0];
  showModal.value = true;
}

function edit(item: Publication) {
  editing.value = item;
  form.title = item.title; form.summary = item.summary; form.type = item.type;
  form.date = new Date(item.date).toISOString().split("T")[0];
  showModal.value = true;
}

async function handleSave() {
  saving.value = true;
  try {
    if (editing.value) await publications.update(editing.value.id, { ...form });
    else await publications.create({ ...form });
    showModal.value = false;
    items.value = await publications.getAll();
  } finally { saving.value = false; }
}

async function remove(id: number) {
  if (confirm("¿Eliminar esta publicación?")) {
    await publications.remove(id);
    items.value = await publications.getAll();
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });
}
</script>
