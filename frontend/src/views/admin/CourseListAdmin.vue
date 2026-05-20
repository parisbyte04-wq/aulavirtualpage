<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Cursos</h2>
      <router-link to="/admin/courses/crear" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-colors">
        + Nuevo curso
      </router-link>
    </div>

    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="courses.length === 0" class="text-gray-400 text-sm py-8 text-center">No hay cursos registrados</div>
      <table v-else class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Título</th>
            <th class="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Slug</th>
            <th class="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Lecciones</th>
            <th class="text-center px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Publicado</th>
            <th class="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="course in courses" :key="course.id">
            <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ course.title }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 hidden md:table-cell font-mono">{{ course.slug }}</td>
            <td class="px-6 py-4 text-sm text-gray-500 text-center hidden md:table-cell">{{ course._count?.lessons || 0 }}</td>
            <td class="px-6 py-4 text-center">
              <span class="px-2 py-0.5 text-xs font-semibold rounded-full"
                :class="course.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'">
                {{ course.published ? 'Sí' : 'No' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <router-link :to="`/admin/courses/${course.id}/lessons`" class="text-primary-600 hover:text-primary-800 text-sm font-medium">Lecciones</router-link>
              <router-link :to="`/admin/courses/${course.id}/quiz`" class="text-accent-600 hover:text-accent-800 text-sm font-medium">Quiz</router-link>
              <router-link :to="`/admin/courses/${course.id}`" class="text-primary-600 hover:text-primary-800 text-sm font-medium">Editar</router-link>
              <button @click="remove(course.id)" class="text-red-600 hover:text-red-800 text-sm font-medium">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { coursesApi } from "../../services/api";

const router = useRouter();
const courses = ref<any[]>([]);

onMounted(async () => { courses.value = await coursesApi.getAllAdmin(); });

async function remove(id: number) {
  if (confirm("¿Eliminar este curso y todo su contenido?")) {
    await coursesApi.remove(id);
    courses.value = await coursesApi.getAllAdmin();
  }
}
</script>
