<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Administradores</h2>
      <button @click="openCreate" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        + Nuevo admin
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400">Cargando administradores...</div>
    <div v-else class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="items.length === 0" class="text-gray-400 text-sm py-8 text-center">No hay administradores registrados</div>
      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Nombre</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Email</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Teléfono</th>
            <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="item in items" :key="item.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ item.name }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 hidden sm:table-cell">{{ item.email }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{{ item.phone || '—' }}</td>
            <td class="px-6 py-4 text-right">
              <template v-if="item.isSuperAdmin">
                <span class="text-xs text-gray-400 italic">Super admin</span>
              </template>
              <template v-else>
                <button @click="edit(item)" class="text-primary-600 hover:text-primary-800 text-sm font-medium mr-3">Editar</button>
                <button @click="remove(item.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{{ errorMsg }}</div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click="showModal = false">
      <div class="relative bg-white rounded-2xl p-6 w-full max-w-lg" @click.stop>
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ editing ? 'Editar administrador' : 'Nuevo administrador' }}</h3>
        <form @submit.prevent="handleSave">
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input v-model="form.name" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="form.email" type="email" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
            </div>
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input v-model="form.phone" type="tel" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" placeholder="Opcional" />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {{ editing ? '(dejar vacío para mantener actual)' : '' }}
            </label>
            <input v-model="form.password" :type="showPassword ? 'text' : 'password'" :required="!editing" minlength="6" class="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" placeholder="Mínimo 6 caracteres" />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" style="margin-top: -18px; position: relative; float: right; margin-right: 12px;">
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
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
import { adminUsers } from "../../services/api";
import type { User } from "../../types";

const items = ref<User[]>([]);
const showModal = ref(false);
const editing = ref<User | null>(null);
const saving = ref(false);
const showPassword = ref(false);
const errorMsg = ref("");
const loading = ref(true);
const form = reactive({ name: "", email: "", password: "", phone: "" });

onMounted(async () => {
  try { items.value = await adminUsers.getAll(); }
  catch (e: any) { errorMsg.value = e.response?.data?.error || "Error al cargar admins"; }
  finally { loading.value = false; }
});

function openCreate() {
  editing.value = null;
  form.name = ""; form.email = ""; form.password = ""; form.phone = "";
  showPassword.value = false;
  showModal.value = true;
}

function edit(item: User) {
  editing.value = item;
  form.name = item.name; form.email = item.email; form.password = ""; form.phone = item.phone || "";
  showPassword.value = false;
  showModal.value = true;
}

async function handleSave() {
  saving.value = true;
  errorMsg.value = "";
  try {
    if (editing.value) {
      const payload: any = { name: form.name, email: form.email, phone: form.phone };
      if (form.password) payload.password = form.password;
      await adminUsers.update(editing.value.id, payload);
    } else {
      await adminUsers.create({ ...form });
    }
    showModal.value = false;
    items.value = await adminUsers.getAll();
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || "Error al guardar";
  } finally { saving.value = false; }
}

async function remove(id: number) {
  if (confirm("¿Eliminar este administrador?")) {
    errorMsg.value = "";
    try {
      await adminUsers.remove(id);
      items.value = await adminUsers.getAll();
    } catch (e: any) {
      errorMsg.value = e.response?.data?.error || "Error al eliminar";
    }
  }
}
</script>
