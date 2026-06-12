<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Inscripciones</h2>

    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <div class="relative flex-1">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input v-model="search" placeholder="Buscar por estudiante o curso..."
          class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm" />
      </div>
      <select v-model="statusFilter"
        class="px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm bg-white">
        <option value="all">Todos</option>
        <option value="active">En curso</option>
        <option value="completed">Completados</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400">Cargando inscripciones...</div>
    <div v-else class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="filteredEnrollments.length === 0" class="text-gray-400 text-sm py-8 text-center">
        {{ enrollments.length === 0 ? 'No hay inscripciones' : 'Ninguna inscripción coincide con los filtros' }}
      </div>
      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estudiante</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Curso</th>
            <th class="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Progreso</th>
            <th class="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Estado</th>
            <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Inscrito</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="e in paginatedEnrollments" :key="e.id">
            <td class="px-6 py-4"><div class="text-sm font-medium text-gray-900">{{ e.user.name }}</div><div class="text-xs text-gray-400">{{ e.user.email }}</div></td>
            <td class="px-6 py-4 text-sm text-gray-700">{{ e.course.title }}</td>
            <td class="px-6 py-4 text-center hidden md:table-cell">
              <div class="flex items-center gap-2 justify-center">
                <div class="w-24 bg-gray-200 rounded-full h-2"><div class="bg-primary-600 h-2 rounded-full" :style="{ width: e.progress + '%' }" /></div>
                <span class="text-xs text-gray-500">{{ e.progress }}%</span>
              </div>
            </td>
            <td class="px-6 py-4 text-center">
              <span class="px-2 py-0.5 text-xs font-semibold rounded-full"
                :class="e.completedAt ? 'bg-green-50 text-green-700' : 'bg-accent-50 text-accent-700'">
                {{ e.completedAt ? 'Completado' : 'En curso' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right text-sm text-gray-500">{{ formatDate(e.enrolledAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import api from "../../services/api";

const enrollments = ref<any[]>([]);
const loading = ref(true);
const search = ref("");
const statusFilter = ref("all");

const filteredEnrollments = computed(() =>
  enrollments.value.filter((e) => {
    const q = search.value.toLowerCase();
    const matchesSearch = !q
      || e.user.name.toLowerCase().includes(q)
      || e.user.email.toLowerCase().includes(q)
      || e.course.title.toLowerCase().includes(q);
    const matchesStatus = statusFilter.value === "all"
      || (statusFilter.value === "completed" && e.completedAt)
      || (statusFilter.value === "active" && !e.completedAt);
    return matchesSearch && matchesStatus;
  })
);

const paginatedEnrollments = computed(() => filteredEnrollments.value);

onMounted(async () => {
  try {
    const res = await api.get("/admin/enrollments");
    enrollments.value = res.data;
  } finally { loading.value = false; }
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}
</script>
