<template>
  <div>
    <AppHeader />
    <main>
      <HeroSection />
      <AboutSection :about="about" />
      <ResearchAreasSection :areas="areas" />
      <ProjectsSection :projects="researchProjects" />
      <SoftwareSection :projects="softwareProjects" />
      <TeamSection :team="team" />
      <PublicationsSection :publications="publicationsData" />
      <CoursesSection />
      <ContactSection />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { About, ResearchArea, Project, TeamMember, Publication } from "../types";
import { about as aboutApi, researchAreas as areasApi, projects as projectsApi, teamMembers, publications as pubsApi } from "../services/api";
import AppHeader from "../components/layout/AppHeader.vue";
import AppFooter from "../components/layout/AppFooter.vue";
import HeroSection from "../components/sections/HeroSection.vue";
import AboutSection from "../components/sections/AboutSection.vue";
import ResearchAreasSection from "../components/sections/ResearchAreasSection.vue";
import ProjectsSection from "../components/sections/ProjectsSection.vue";
import SoftwareSection from "../components/sections/SoftwareSection.vue";
import TeamSection from "../components/sections/TeamSection.vue";
import PublicationsSection from "../components/sections/PublicationsSection.vue";
import CoursesSection from "../components/sections/CoursesSection.vue";
import ContactSection from "../components/sections/ContactSection.vue";

const about = ref<About | null>(null);
const areas = ref<ResearchArea[]>([]);
const projectsData = ref<Project[]>([]);
const researchProjects = computed(() => projectsData.value.filter((p) => p.type === "research"));
const softwareProjects = computed(() => projectsData.value.filter((p) => p.type === "software"));
const team = ref<TeamMember[]>([]);
const publicationsData = ref<Publication[]>([]);

onMounted(async () => {
  try {
    const [a, ar, p, t, pub] = await Promise.all([
      aboutApi.get(),
      areasApi.getAll(),
      projectsApi.getAll(),
      teamMembers.getAll(),
      pubsApi.getAll(),
    ]);
    about.value = a;
    areas.value = ar;
    projectsData.value = p;
    team.value = t;
    publicationsData.value = pub;
  } catch (err) {
    console.error("Error cargando datos:", err);
  }
});
</script>
