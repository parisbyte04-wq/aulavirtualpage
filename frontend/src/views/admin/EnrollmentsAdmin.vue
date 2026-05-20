<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Inscripciones</h2>
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="enrollments.length === 0" class="text-gray-400 text-sm py-8 text-center">No hay inscripciones</div>
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
          <tr v-for="e in enrollments" :key="e.id">
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
import { ref, onMounted } from "vue";
import { quizzesApi } from "../../services/api";

// This imports from admin endpoint which we haven't added to api.ts yet
import api from "../../services/api";

const enrollments = ref<any[]>([]);

onMounted(async () => {
  const res = await api.get("/admin/enrollments");
  enrollments.value = res.data;
});

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}
</script>
