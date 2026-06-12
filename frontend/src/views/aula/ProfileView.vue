<template>
  <div class="min-h-screen bg-gray-50">
    <AulaHeader />
    <main class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Mi Perfil</h1>

      <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{{ success }}</div>
      <div v-if="errorMsg" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{{ errorMsg }}</div>

      <div class="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Avatar</h2>
        <div class="flex items-center gap-6">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden">
            <img v-if="previewUrl" :src="previewUrl" class="w-full h-full object-cover" />
            <span v-else class="text-3xl font-bold text-primary-600">{{ authStore.user?.name?.charAt(0) }}</span>
          </div>
          <div>
            <input type="file" accept="image/*" @change="handleFile" class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-600 hover:file:bg-primary-100" />
            <p class="text-xs text-gray-400 mt-1">JPG, PNG o WebP. Máx 2MB.</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-8 mb-6">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Datos personales</h2>
        <form @submit.prevent="updateProfile">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="form.name" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="form.email" type="email" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <button type="submit" :disabled="saving" class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl disabled:opacity-50">
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </form>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-8">
        <h2 class="text-lg font-bold text-gray-900 mb-6">Cambiar contraseña</h2>
        <form @submit.prevent="changePassword">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
            <input v-model="pwForm.current" type="password" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
            <input v-model="pwForm.newPassword" type="password" required minlength="6" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none" />
          </div>
          <button type="submit" :disabled="pwSaving" class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl disabled:opacity-50">
            {{ pwSaving ? 'Cambiando...' : 'Cambiar contraseña' }}
          </button>
        </form>
      </div>
    </main>
    <AulaFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { auth as authApi, uploadsApi } from "../../services/api";
import AulaHeader from "../../components/layout/AulaHeader.vue";
import AulaFooter from "../../components/layout/AulaFooter.vue";

const authStore = useAuthStore();
const form = reactive({ name: "", email: "" });
const pwForm = reactive({ current: "", newPassword: "" });
const saving = ref(false);
const pwSaving = ref(false);
const success = ref("");
const errorMsg = ref("");
const previewUrl = ref("");

onMounted(async () => {
  if (!authStore.user?.email) {
    await authStore.fetchProfile();
  }
  if (authStore.user) {
    form.name = authStore.user.name;
    form.email = authStore.user.email;
    previewUrl.value = authStore.user.avatarUrl || "";
  }
});

async function handleFile(e: Event) {
  const input = e.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  try {
    const res = await uploadsApi.uploadAvatar(file);
    previewUrl.value = res.avatarUrl;
    authStore.setAvatar(res.avatarUrl);
    success.value = "Avatar actualizado";
  } catch (e: any) {
    errorMsg.value = "Error al subir avatar";
  }
}

async function updateProfile() {
  saving.value = true; success.value = ""; errorMsg.value = "";
  try {
    const user = await authApi.updateProfile({ name: form.name, email: form.email });
    authStore.user = user as any;
    success.value = "Datos actualizados correctamente";
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || "Error al actualizar";
  } finally { saving.value = false; }
}

async function changePassword() {
  pwSaving.value = true; success.value = ""; errorMsg.value = "";
  try {
    await authApi.changePassword(pwForm.current, pwForm.newPassword);
    success.value = "Contraseña cambiada correctamente";
    pwForm.current = ""; pwForm.newPassword = "";
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || "Error al cambiar contraseña";
  } finally { pwSaving.value = false; }
}
</script>
