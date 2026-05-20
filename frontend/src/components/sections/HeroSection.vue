<template>
  <section id="inicio" class="relative min-h-screen flex items-center bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 overflow-hidden">
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-20 left-10 w-72 h-72 bg-accent-400 rounded-full blur-3xl" />
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-accent-500 rounded-full blur-3xl" />
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
      <div class="max-w-3xl">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white/80 text-sm mb-8">
          <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Excelencia en Investigación
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
          Investigación e<br />
          <span class="text-accent-400">Innovación</span> para<br />
          el Futuro
        </h1>
        <p class="text-lg lg:text-xl text-white/70 max-w-2xl mb-10 leading-relaxed">
          Somos un instituto dedicado a la generación de conocimiento científico y tecnológico, formando talento y creando soluciones que transforman la sociedad.
        </p>
        <div class="flex flex-wrap gap-4">
          <a
            href="#nosotros"
            class="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded-lg transition-all"
          >
            Conoce más
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
          <a
            href="#contacto"
            class="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 hover:border-white/50 text-white font-semibold rounded-lg transition-all"
          >
            Contáctanos
          </a>
        </div>
      </div>
    </div>

    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <svg class="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7" />
      </svg>
    </div>
  </section>
</template>
