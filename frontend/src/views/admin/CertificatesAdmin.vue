<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Certificados emitidos</h2>
    <div v-if="loading" class="text-center py-12 text-gray-400">Cargando certificados...</div>
    <div v-else class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="certificates.length === 0" class="text-gray-400 text-sm py-8 text-center">No hay certificados emitidos</div>
      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estudiante</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Curso</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Código</th>
            <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Emitido</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="cert in certificates" :key="cert.id">
            <td class="px-6 py-4"><div class="text-sm font-medium text-gray-900">{{ cert.user.name }}</div><div class="text-xs text-gray-400">{{ cert.user.email }}</div></td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ cert.course.title }}</td>
            <td class="px-6 py-4 text-sm font-mono text-primary-600 hidden md:table-cell">{{ cert.code }}</td>
            <td class="px-6 py-4 text-right text-sm text-gray-500">{{ formatDate(cert.issuedAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import api from "../../services/api";

const certificates = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const res = await api.get("/admin/certificates");
    certificates.value = res.data;
  } finally { loading.value = false; }
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" });
}
</script>
