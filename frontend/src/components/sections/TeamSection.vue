<template>
  <section id="equipo" class="py-20 lg:py-28 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="Nuestro <span class='text-primary-600'>Equipo</span>"
        subtitle="Conoce a los investigadores que hacen posible nuestro trabajo."
      />

      <div class="relative">
        <button
          @click="prev"
          :disabled="atStart"
          class="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-3 lg:-translate-x-6 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:border-primary-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>

        <div class="overflow-hidden mx-2">
          <div
            class="flex transition-transform duration-400 ease-in-out"
            :style="{ transform: `translateX(-${currentSlide * (100 / visibleCount)}%)` }"
          >
            <div
              v-for="member in team"
              :key="member.id"
              class="flex-shrink-0 px-3"
              :style="{ width: `${100 / visibleCount}%` }"
            >
              <div class="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all text-center h-full">
                <div class="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center">
                  <span class="text-3xl font-bold text-primary-600">{{ member.name.charAt(0) }}{{ member.name.split(' ')[1]?.charAt(0) }}</span>
                </div>
                <h3 class="font-bold text-gray-900 mb-1">{{ member.name }}</h3>
                <p class="text-sm text-primary-600 font-medium mb-3">{{ member.role }}</p>
                <p class="text-sm text-gray-500 leading-relaxed" v-if="member.bio">{{ member.bio }}</p>
              </div>
            </div>
          </div>
        </div>

        <button
          @click="next"
          :disabled="atEnd"
          class="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-3 lg:translate-x-6 w-10 h-10 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:border-primary-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </div>

      <div class="flex justify-center gap-2 mt-6">
        <button
          v-for="(_, i) in totalPages"
          :key="i"
          @click="currentSlide = i * visibleCount"
          class="w-2.5 h-2.5 rounded-full transition-all"
          :class="pageIndex === i ? 'bg-primary-600 w-6' : 'bg-gray-300 hover:bg-gray-400'"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import type { TeamMember } from "../../types";
import SectionTitle from "../ui/SectionTitle.vue";

const props = defineProps<{
  team: TeamMember[];
}>();

const visibleCount = ref(4);
const currentSlide = ref(0);

function updateVisible() {
  const w = window.innerWidth;
  if (w < 640) visibleCount.value = 1;
  else if (w < 1024) visibleCount.value = 2;
  else visibleCount.value = 4;
}

onMounted(() => {
  updateVisible();
  window.addEventListener("resize", updateVisible);
});
onUnmounted(() => window.removeEventListener("resize", updateVisible));

const maxSlide = computed(() => Math.max(0, props.team.length - visibleCount.value));
const atStart = computed(() => currentSlide.value <= 0);
const atEnd = computed(() => currentSlide.value >= maxSlide.value);
const totalPages = computed(() => Math.ceil(props.team.length / visibleCount.value));
const pageIndex = computed(() => Math.floor(currentSlide.value / visibleCount.value));

function next() {
  if (!atEnd.value) currentSlide.value += visibleCount.value;
}

function prev() {
  if (!atStart.value) currentSlide.value -= visibleCount.value;
}
</script>
