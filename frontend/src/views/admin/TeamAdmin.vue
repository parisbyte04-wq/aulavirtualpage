<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Equipo</h2>
      <button @click="openCreate" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        + Nuevo miembro
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400">Cargando equipo...</div>
    <template v-else>
    <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{{ errorMsg }}</div>
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="items.length === 0" class="text-gray-400 text-sm py-8 text-center">No hay miembros registrados</div>
      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Rol</th>
            <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in items" :key="item.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{{ item.role }}</td>
            <td class="px-6 py-4 text-right">
              <button @click="edit(item)" class="text-primary-600 hover:text-primary-800 text-sm font-medium mr-3">Editar</button>
              <button @click="remove(item.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click="showModal = false">
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-lg" @click.stop>
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ editing ? 'Editar miembro' : 'Nuevo miembro' }}</h3>
        <form @submit.prevent="handleSave">
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input v-model="form.name" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <input v-model="form.role" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
            </div>
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea v-model="form.bio" rows="3" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none resize-none" />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
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
import { teamMembers } from "../../services/api";
import type { TeamMember } from "../../types";

const items = ref<TeamMember[]>([]);
const showModal = ref(false);
const editing = ref<TeamMember | null>(null);
const saving = ref(false);
const loading = ref(true);
const errorMsg = ref("");
const form = reactive({ name: "", role: "", bio: "", email: "" });

onMounted(async () => {
  try { items.value = await teamMembers.getAll(); }
  finally { loading.value = false; }
});

function openCreate() {
  editing.value = null;
  form.name = ""; form.role = ""; form.bio = ""; form.email = "";
  showModal.value = true;
}

function edit(item: TeamMember) {
  editing.value = item;
  form.name = item.name; form.role = item.role; form.bio = item.bio || ""; form.email = item.email || "";
  showModal.value = true;
}

async function handleSave() {
  saving.value = true;
  errorMsg.value = "";
  try {
    if (editing.value) await teamMembers.update(editing.value.id, { ...form });
    else await teamMembers.create({ ...form });
    showModal.value = false;
    items.value = await teamMembers.getAll();
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || "Error al guardar";
  } finally { saving.value = false; }
}

async function remove(id: number) {
  if (confirm("¿Eliminar este miembro?")) {
    errorMsg.value = "";
    try {
      await teamMembers.remove(id);
      items.value = await teamMembers.getAll();
    } catch (e: any) {
      errorMsg.value = e.response?.data?.error || "Error al eliminar";
    }
  }
}
</script>
