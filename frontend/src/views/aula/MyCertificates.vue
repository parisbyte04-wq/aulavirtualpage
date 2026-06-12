<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-amber-50/20">
    <AulaHeader />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
      <div class="flex gap-8">
        <aside class="hidden lg:block w-72 shrink-0">
          <div class="bg-white rounded-2xl border border-gray-100 p-5 sticky top-28 shadow-sm space-y-6">
            <div>
              <h3 class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Resumen</h3>
              <div class="space-y-2">
                <div class="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <span class="text-sm font-medium text-amber-700">Total certificados</span>
                  <span class="text-lg font-bold text-amber-600">{{ certificates.length }}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-primary-50 border border-primary-100">
                  <span class="text-sm font-medium text-primary-700">Este mes</span>
                  <span class="text-lg font-bold text-primary-600">{{ thisMonthCount }}</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                  <span class="text-sm font-medium text-green-700">Este año</span>
                  <span class="text-lg font-bold text-green-600">{{ thisYearCount }}</span>
                </div>
              </div>
            </div>
            <hr class="border-gray-100" />
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Buscar</label>
              <div class="relative">
                <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input v-model="search" placeholder="Buscar certificado..."
                  class="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm bg-gray-50" />
              </div>
            </div>
            <hr class="border-gray-100" />
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Período</label>
              <div class="space-y-1">
                <button v-for="opt in periodOptions" :key="opt.value" @click="periodFilter = opt.value"
                  class="w-full text-left px-3 py-2 rounded-xl text-sm transition-all"
                  :class="periodFilter === opt.value ? 'bg-amber-100 text-amber-700 font-medium' : 'text-gray-600 hover:bg-gray-50'">
                  {{ opt.label }}
                </button>
              </div>
            </div>
            <div>
              <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Ordenar</label>
              <select v-model="sortBy"
                class="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-primary-500 outline-none text-sm bg-gray-50">
                <option value="newest">Más recientes</option>
                <option value="oldest">Más antiguos</option>
                <option value="az">A-Z</option>
              </select>
            </div>
            <router-link to="/aula"
              class="flex items-center gap-2 w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Seguir aprendiendo
            </router-link>
          </div>
        </aside>

        <div class="flex-1 min-w-0">
          <div class="lg:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
            <button v-for="opt in periodOptions" :key="opt.value" @click="periodFilter = opt.value"
              class="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all"
              :class="periodFilter === opt.value ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'">
              {{ opt.label }}
            </button>
          </div>

          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Mis Certificados</h1>
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <span class="flex items-center gap-1">
                <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {{ certificates.length }} certificados emitidos
              </span>
            </div>
          </div>

          <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div v-for="i in 4" :key="i" class="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div class="h-2 bg-gradient-to-r from-amber-300 to-amber-400" />
              <div class="p-6 space-y-3">
                <div class="h-5 w-3/4 bg-gray-200 rounded" />
                <div class="h-4 w-1/2 bg-gray-200 rounded" />
                <div class="h-4 w-1/3 bg-gray-200 rounded" />
                <div class="h-9 w-36 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>

          <div v-else-if="filteredCertificates.length === 0" class="text-center py-20">
            <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
              <svg class="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p class="text-gray-500 text-lg mb-2" v-if="search || periodFilter !== 'all'">
              Ningún certificado coincide con los filtros.
            </p>
            <p class="text-gray-400 text-lg mb-4" v-else>
              No tienes certificados aún. Completa un curso y aprueba el examen final para obtenerlo.
            </p>
            <router-link to="/mis-cursos"
              class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-md">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ver mis cursos
            </router-link>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div v-for="cert in filteredCertificates" :key="cert.id"
              class="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group relative">
              <div class="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400" />
              <div class="p-6">
                <div class="flex items-start gap-4">
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center shrink-0 border border-amber-200">
                    <svg class="w-7 h-7 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-900 mb-1 truncate">{{ cert.course.title }}</h3>
                    <p class="text-xs text-gray-400 mb-2">Certificado de finalización</p>
                    <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Código:
                        <span class="font-mono font-medium text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{{ cert.code }}</span>
                      </span>
                      <span class="flex items-center gap-1">
                        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {{ formatDate(cert.issuedAt) }}
                      </span>
                    </div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <button @click="previewPdf(cert)"
                        class="flex items-center gap-1.5 px-4 py-2.5 border border-primary-200 text-primary-700 bg-primary-50 hover:bg-primary-100 text-sm font-semibold rounded-xl transition-all">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Vista previa
                      </button>
                      <button @click="downloadPdf(cert)"
                        class="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Descargar PDF
                      </button>
                      <button @click="verifyCert(cert.code)"
                        class="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-all">
                        Verificar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <AulaFooter />

    <!-- Preview error toast -->
    <Teleport to="body">
      <div v-if="previewError && !previewUrl"
        class="fixed top-4 right-4 z-50 bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-sm text-red-700 shadow-lg flex items-center gap-3 max-w-sm">
        <svg class="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ previewError }}</span>
        <button @click="previewError = ''" class="ml-auto shrink-0 text-red-400 hover:text-red-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Teleport>

    <!-- Preview Modal -->
    <Teleport to="body">
      <div v-if="previewUrl" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" @click.self="closePreview">
        <div class="bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h3 class="font-bold text-gray-900">Vista previa del certificado</h3>
            <div class="flex items-center gap-2">
              <button @click="downloadCurrentPdf"
                class="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Descargar
              </button>
              <button @click="closePreview"
                class="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div v-if="previewError" class="px-6 py-3 bg-red-50 border-b border-red-100 text-red-700 text-sm">
            {{ previewError }}
          </div>
          <div class="flex-1 bg-gray-100 p-4 min-h-0 overflow-auto">
            <iframe :src="previewUrl" class="w-full h-[70vh] rounded-lg shadow-inner" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { certificatesApi } from "../../services/api";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { downloadCertificatePdf, getCertificateBlobUrl } from "../../utils/certificate";
import AulaHeader from "../../components/layout/AulaHeader.vue";
import AulaFooter from "../../components/layout/AulaFooter.vue";
import type { Certificate } from "../../types";

const router = useRouter();
const authStore = useAuthStore();
const certificates = ref<Certificate[]>([]);
const loading = ref(true);
const search = ref("");
const periodFilter = ref("all");
const sortBy = ref("newest");
const previewUrl = ref<string | null>(null);
const previewTarget = ref<Certificate | null>(null);
const previewError = ref("");

const periodOptions = [
  { value: "all", label: "Todos" },
  { value: "month", label: "Este mes" },
  { value: "quarter", label: "Últimos 3 meses" },
  { value: "year", label: "Este año" },
];

const thisMonthCount = computed(() =>
  certificates.value.filter((c) => {
    const d = new Date(c.issuedAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length
);

const thisYearCount = computed(() =>
  certificates.value.filter((c) => {
    return new Date(c.issuedAt).getFullYear() === new Date().getFullYear();
  }).length
);

const filteredCertificates = computed(() => {
  let result = certificates.value.filter((c) => {
    const q = search.value.toLowerCase();
    const matchesSearch = !q
      || c.course.title.toLowerCase().includes(q)
      || c.code.toLowerCase().includes(q);
    const now = new Date();
    let matchesPeriod = true;
    if (periodFilter.value === "month") {
      const d = new Date(c.issuedAt);
      matchesPeriod = d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    } else if (periodFilter.value === "quarter") {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      matchesPeriod = new Date(c.issuedAt) >= threeMonthsAgo;
    } else if (periodFilter.value === "year") {
      matchesPeriod = new Date(c.issuedAt).getFullYear() === now.getFullYear();
    }
    return matchesSearch && matchesPeriod;
  });
  if (sortBy.value === "newest") {
    result = [...result].sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime());
  } else if (sortBy.value === "oldest") {
    result = [...result].sort((a, b) => new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime());
  } else if (sortBy.value === "az") {
    result = [...result].sort((a, b) => a.course.title.localeCompare(b.course.title));
  }
  return result;
});

onMounted(async () => {
  try { certificates.value = await certificatesApi.getMine(); }
  finally { loading.value = false; }
});

function closePreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value);
  previewUrl.value = null;
  previewTarget.value = null;
  previewError.value = "";
}

async function previewPdf(cert: Certificate) {
  previewTarget.value = cert;
  previewError.value = "";
  const name = authStore.user?.name || "Estudiante";
  try {
    const url = await getCertificateBlobUrl(cert, name);
    previewUrl.value = url;
  } catch (e: any) {
    previewError.value = e?.message || "Error al generar la vista previa";
  }
}

async function downloadCurrentPdf() {
  if (!previewTarget.value) return;
  const name = authStore.user?.name || "Estudiante";
  try {
    await downloadCertificatePdf(previewTarget.value, name);
  } catch (e: any) {
    previewError.value = e?.message || "Error al descargar el certificado";
  }
}

async function downloadPdf(cert: Certificate) {
  const name = authStore.user?.name || "Estudiante";
  try {
    await downloadCertificatePdf(cert, name);
  } catch (e: any) {
    console.error("Error al descargar:", e);
  }
}

function verifyCert(code: string) {
  window.open(`/verificar?code=${code}`, "_blank");
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("es-ES", { day: "2-digit", month: "long", year: "numeric" });
}
</script>
