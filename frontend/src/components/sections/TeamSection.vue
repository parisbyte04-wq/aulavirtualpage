<template>
  <section id="equipo" class="py-20 lg:py-28 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="Nuestro <span class='text-primary-600'>Equipo</span>"
        subtitle="Conoce a los investigadores que hacen posible nuestro trabajo."
      />

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="member in team"
          :key="member.id"
          class="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all text-center"
        >
          <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
            <span class="text-3xl font-bold text-primary-600">{{ member.name.charAt(0) }}{{ member.name.split(' ')[1]?.charAt(0) }}</span>
          </div>
          <h3 class="font-bold text-gray-900 mb-1">{{ member.name }}</h3>
          <p class="text-sm text-primary-600 font-medium mb-3">{{ member.role }}</p>
          <p class="text-sm text-gray-500 leading-relaxed" v-if="member.bio">{{ member.bio }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TeamMember } from "../../types";
import SectionTitle from "../ui/SectionTitle.vue";

defineProps<{
  team: TeamMember[];
}>();
</script>
