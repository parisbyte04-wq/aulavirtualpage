<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-lg">
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-2 mb-4">
          <div class="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
            <span class="text-white font-bold">II</span>
          </div>
        </router-link>
        <h1 class="text-2xl font-bold text-gray-900">Verificar Certificado</h1>
        <p class="text-gray-500 text-sm mt-1">Ingresa el código único del certificado</p>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div class="flex gap-2">
          <input v-model="code" placeholder="CERT-XXXXXXXX-XXXX" class="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none font-mono text-sm uppercase" @keyup.enter="verify" />
          <button @click="verify" :disabled="loading" class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl disabled:opacity-50">
            {{ loading ? 'Verificando...' : 'Verificar' }}
          </button>
        </div>
      </div>

      <div v-if="result !== null" class="rounded-2xl p-6 text-center"
        :class="result ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'"
      >
        <div v-if="result" class="text-green-700">
          <svg class="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-xl font-bold mb-2">Certificado Válido</h2>
          <p class="mb-1"><strong>Estudiante:</strong> {{ certData?.studentName }}</p>
          <p class="mb-1"><strong>Curso:</strong> {{ certData?.courseName }}</p>
          <p class="mb-1"><strong>Emitido:</strong> {{ formatDate(certData?.issuedAt) }}</p>
          <p class="text-xs mt-4 text-green-600"><strong>Código:</strong> {{ certData?.code }}</p>
        </div>
        <div v-else class="text-red-700">
          <svg class="w-16 h-16 mx-auto mb-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-xl font-bold mb-2">Certificado No Válido</h2>
          <p>{{ certData?.error || 'El código ingresado no corresponde a ningún certificado emitido.' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { certificatesApi } from "../../services/api";

const code = ref("");
const loading = ref(false);
const result = ref<boolean | null>(null);
const certData = ref<any>(null);

async function verify() {
  if (!code.value.trim()) return;
  loading.value = true; result.value = null;
  try {
    const data = await certificatesApi.verify(code.value.trim());
    result.value = data.valid;
    certData.value = data;
  } catch {
    result.value = false;
    certData.value = { error: "Error al verificar el certificado" };
  } finally { loading.value = false; }
}

function formatDate(d: string) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
}
</script>
