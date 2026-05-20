<template>
  <footer class="bg-primary-800 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div class="flex items-center gap-2 mb-4">
            <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span class="text-primary-600 font-bold text-lg">II</span>
            </div>
            <span class="font-semibold text-lg">Instituto Innovación</span>
          </div>
          <p class="text-gray-300 text-sm leading-relaxed">
            Comprometidos con la excelencia científica y la generación de conocimiento para el desarrollo sostenible.
          </p>
        </div>

        <div>
          <h3 class="font-semibold mb-4">Enlaces rápidos</h3>
          <ul class="space-y-2">
            <li v-for="link in quickLinks" :key="link.href">
              <a :href="link.href" class="text-gray-300 hover:text-accent-400 text-sm transition-colors">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold mb-4">Contacto</h3>
          <ul class="space-y-3 text-sm text-gray-300">
            <li class="flex items-start gap-2">
              <svg class="w-5 h-5 mt-0.5 shrink-0 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>Av. de la Ciencia 123, Ciudad</span>
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 shrink-0 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>contacto@instituto.edu</span>
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 shrink-0 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>+1 234 567 890</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-primary-700 mt-8 pt-8 text-center text-sm text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} Instituto de Investigación Innovación. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const quickLinks = [
  { href: "#inicio", label: "Inicio" },
  { href: "#nosotros", label: "Sobre nosotros" },
  { href: "#areas", label: "Áreas de investigación" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#software", label: "Software Científico" },
  { href: "#cursos", label: "Cursos" },
  { href: "/aula", label: "Aula Virtual" },
  { href: "#contacto", label: "Contacto" },
];
</script>
