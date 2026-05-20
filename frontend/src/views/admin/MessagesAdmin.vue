<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Bandeja de Mensajes</h2>
    <div class="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div v-if="items.length === 0" class="text-gray-400 text-sm py-8 text-center">No hay mensajes</div>
      <div v-for="msg in items" :key="msg.id" class="px-6 py-4 border-b border-gray-50 last:border-0"
        :class="{ 'bg-primary-50/30': !msg.read }"
      >
        <div class="flex items-start justify-between mb-2">
          <div>
            <span class="font-medium text-gray-900">{{ msg.name }}</span>
            <span class="text-sm text-gray-500 ml-2">{{ msg.email }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span v-if="!msg.read" class="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">Nuevo</span>
            <span class="text-xs text-gray-400">{{ formatDate(msg.createdAt) }}</span>
          </div>
        </div>
        <p class="text-sm font-medium text-gray-700 mb-1">{{ msg.subject }}</p>
        <p class="text-sm text-gray-500 mb-3">{{ msg.message }}</p>
        <div class="flex gap-3">
          <button v-if="!msg.read" @click="markRead(msg.id)" class="text-xs text-primary-600 hover:text-primary-800 font-medium">Marcar como leído</button>
          <button @click="remove(msg.id)" class="text-xs text-red-600 hover:text-red-800 font-medium">Eliminar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { contact } from "../../services/api";
import type { ContactMessage } from "../../types";

const items = ref<ContactMessage[]>([]);

onMounted(load);

async function load() { items.value = await contact.getAll(); }

async function markRead(id: number) {
  await contact.markRead(id);
  await load();
}

async function remove(id: number) {
  if (confirm("¿Eliminar este mensaje?")) {
    await contact.remove(id);
    await load();
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}
</script>
