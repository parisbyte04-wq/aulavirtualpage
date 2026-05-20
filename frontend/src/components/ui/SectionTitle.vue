<template>
  <div class="text-center mb-12 lg:mb-16">
    <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" v-html="title" />
    <p v-if="subtitle" class="text-lg text-gray-600 max-w-2xl mx-auto">{{ subtitle }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>
