<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Proyectos</h2>
      <button @click="openCreate" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        + Nuevo proyecto
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="items.length === 0" class="text-gray-400 text-sm py-8 text-center">No hay proyectos registrados</div>
      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Título</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Tipo</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Área</th>
            <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in items" :key="item.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.title }}</td>
            <td class="px-6 py-4 text-sm hidden md:table-cell">
              <span class="text-xs font-medium px-2.5 py-1 rounded-full" :class="item.type === 'software' ? 'text-accent-700 bg-accent-50' : 'text-primary-600 bg-primary-50'">
                {{ item.type === 'software' ? 'Software' : 'Investigación' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{{ item.researchArea?.title || '—' }}</td>
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
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ editing ? 'Editar proyecto' : 'Nuevo proyecto' }}</h3>
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <select v-model="form.type" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
              <option value="research">Investigación</option>
              <option value="software">Software</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
            <input v-model="form.imageUrl" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <template v-if="form.type === 'software'">
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">Tecnologías (JSON array)</label>
              <input v-model="form.techStack" placeholder='["Vue","Node","Python"]' class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">URL del repositorio (GitHub)</label>
              <input v-model="form.githubUrl" placeholder="https://github.com/..." class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
            </div>
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">URL del demo / sitio en vivo</label>
              <input v-model="form.liveUrl" placeholder="https://..." class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
            </div>
          </template>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Área de investigación</label>
            <select v-model="form.researchAreaId" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none">
              <option :value="null">Sin área</option>
              <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.title }}</option>
            </select>
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
import { projects, researchAreas } from "../../services/api";
import type { Project, ResearchArea } from "../../types";

const items = ref<Project[]>([]);
const areas = ref<ResearchArea[]>([]);
const showModal = ref(false);
const editing = ref<Project | null>(null);
const saving = ref(false);
const form = reactive({ title: "", description: "", imageUrl: "", type: "research", techStack: "", githubUrl: "", liveUrl: "", researchAreaId: null as number | null });

onMounted(async () => {
  const [p, a] = await Promise.all([projects.getAll(), researchAreas.getAll()]);
  items.value = p;
  areas.value = a;
});

function openCreate() {
  editing.value = null;
  form.title = "";
  form.description = "";
  form.imageUrl = "";
  form.type = "research";
  form.techStack = "";
  form.githubUrl = "";
  form.liveUrl = "";
  form.researchAreaId = null;
  showModal.value = true;
}

function edit(item: Project) {
  editing.value = item;
  form.title = item.title;
  form.description = item.description;
  form.imageUrl = item.imageUrl || "";
  form.type = item.type || "research";
  form.techStack = item.techStack || "";
  form.githubUrl = item.githubUrl || "";
  form.liveUrl = item.liveUrl || "";
  form.researchAreaId = item.researchAreaId;
  showModal.value = true;
}

async function handleSave() {
  saving.value = true;
  try {
    if (editing.value) {
      await projects.update(editing.value.id, { ...form });
    } else {
      await projects.create({ ...form });
    }
    showModal.value = false;
    items.value = await projects.getAll();
  } finally {
    saving.value = false;
  }
}

async function remove(id: number) {
  if (confirm("¿Eliminar este proyecto?")) {
    await projects.remove(id);
    items.value = await projects.getAll();
  }
}
</script>
