<template>
  <div class="max-w-2xl">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h2>

    <div class="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Información personal</h3>
      <form @submit.prevent="saveProfile">
        <div class="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input v-model="profile.name" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input v-model="profile.email" type="email" required class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" />
          </div>
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input v-model="profile.phone" type="tel" class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="Opcional" />
        </div>
        <div v-if="profileMsg" class="mb-4 p-3 rounded-xl text-sm" :class="profileMsgType === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
          {{ profileMsg }}
        </div>
        <button type="submit" :disabled="profileSaving" class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
          {{ profileSaving ? 'Guardando...' : 'Guardar cambios' }}
        </button>
      </form>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Cambiar contraseña</h3>
      <form @submit.prevent="savePassword">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña actual</label>
          <div class="relative">
            <input v-model="password.current" :type="showPw.current ? 'text' : 'password'" required class="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="••••••••" />
            <button type="button" @click="showPw.current = !showPw.current" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg v-if="showPw.current" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Nueva contraseña</label>
          <div class="relative">
            <input v-model="password.new" :type="showPw.new ? 'text' : 'password'" required minlength="6" class="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="Mínimo 6 caracteres" />
            <button type="button" @click="showPw.new = !showPw.new" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg v-if="showPw.new" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
        <div v-if="pwMsg" class="mb-4 p-3 rounded-xl text-sm" :class="pwMsgType === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'">
          {{ pwMsg }}
        </div>
        <button type="submit" :disabled="pwSaving" class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
          {{ pwSaving ? 'Cambiando...' : 'Cambiar contraseña' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { auth as authApi } from "../../services/api";

const profile = reactive({ name: "", email: "", phone: "" });
const profileSaving = ref(false);
const profileMsg = ref("");
const profileMsgType = ref<"ok" | "err">("ok");

const password = reactive({ current: "", new: "" });
const showPw = reactive({ current: false, new: false });
const pwSaving = ref(false);
const pwMsg = ref("");
const pwMsgType = ref<"ok" | "err">("ok");

onMounted(async () => {
  const p = await authApi.getProfile();
  profile.name = p.name;
  profile.email = p.email;
  profile.phone = p.phone || "";
});

async function saveProfile() {
  profileSaving.value = true;
  profileMsg.value = "";
  try {
    await authApi.updateProfile({ name: profile.name, email: profile.email, phone: profile.phone });
    profileMsg.value = "Perfil actualizado correctamente";
    profileMsgType.value = "ok";
  } catch (e: any) {
    profileMsg.value = e.response?.data?.error || "Error al guardar";
    profileMsgType.value = "err";
  } finally {
    profileSaving.value = false;
  }
}

async function savePassword() {
  pwSaving.value = true;
  pwMsg.value = "";
  try {
    await authApi.changePassword(password.current, password.new);
    pwMsg.value = "Contraseña cambiada correctamente";
    pwMsgType.value = "ok";
    password.current = "";
    password.new = "";
  } catch (e: any) {
    pwMsg.value = e.response?.data?.error || "Error al cambiar contraseña";
    pwMsgType.value = "err";
  } finally {
    pwSaving.value = false;
  }
}
</script>
