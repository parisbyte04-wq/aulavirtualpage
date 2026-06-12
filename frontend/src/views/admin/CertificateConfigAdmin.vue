<template>
  <div>
    <div class="flex items-center gap-3 mb-6">
      <router-link to="/admin/courses" class="text-gray-400 hover:text-gray-600 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
      </router-link>
      <h2 class="text-2xl font-bold text-gray-900">Certificado: {{ courseTitle }}</h2>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">Cargando...</div>

    <template v-else>
      <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{{ success }}</div>
      <div v-if="errorMsg" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{{ errorMsg }}</div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div class="lg:col-span-3">
          <div class="bg-white rounded-xl border border-gray-100 p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Vista previa</h3>
              <span class="text-xs text-gray-400">Arrastra el nombre para ajustar su posición</span>
            </div>
            <div
              ref="previewEl"
              class="relative mx-auto rounded-lg border-2 border-gray-300 bg-gray-50 shadow-[0_4px_24px_rgba(0,0,0,0.12)]"
              :style="previewStyle"
            >
              <div v-if="!form.certificateBgUrl" class="absolute inset-0 flex items-center justify-center text-gray-300 text-sm">
                Sin imagen de fondo
              </div>
              <img
                v-if="form.certificateBgUrl"
                :src="form.certificateBgUrl"
                class="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />
              <div
                v-if="form.certificateEnabled"
                class="absolute select-none"
                :style="nameStyle"
              >
                {{ previewName }}
              </div>
              <div
                v-if="form.certificateEnabled"
                class="absolute inset-0 z-10 cursor-grab active:cursor-grabbing"
                @mousedown.prevent="startDrag"
              ></div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Configuración</h3>

            <label class="flex items-center gap-3">
              <input v-model="form.certificateEnabled" type="checkbox" class="w-4 h-4 text-primary-600 rounded" />
              <span class="text-sm font-medium text-gray-700">Habilitar certificado</span>
            </label>

            <div v-if="form.certificateEnabled">
              <div>
                <label class="block text-xs font-medium text-gray-600 mb-1">Título</label>
                <input v-model="form.certificateTitle" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" placeholder="Certificado de finalización" />
              </div>

              <div class="mt-3">
                <label class="block text-xs font-medium text-gray-600 mb-1">Texto de prueba</label>
                <input v-model="testName" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" placeholder="Nombre del Estudiante" />
              </div>

              <div class="mt-3">
                <label class="block text-xs font-medium text-gray-600 mb-1">Imagen de fondo</label>
                <div v-if="form.certificateBgUrl" class="flex items-center gap-2 mb-2">
                  <img :src="form.certificateBgUrl" class="h-10 w-16 rounded-lg border border-gray-200 object-cover" />
                  <span class="text-xs text-gray-400 truncate flex-1">{{ form.certificateBgUrl.split('/').pop() }}</span>
                  <button type="button" @click="form.certificateBgUrl = ''; imgWidth = 0; imgHeight = 0" class="text-red-500 hover:text-red-700 text-xs font-medium">Quitar</button>
                </div>
                <label class="cursor-pointer flex items-center justify-center px-3 py-2 border-2 border-dashed border-gray-200 rounded-lg hover:border-primary-400 transition-colors text-xs text-gray-500">
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                  {{ form.certificateBgUrl ? 'Cambiar imagen' : 'Seleccionar imagen' }}
                  <input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" class="hidden" @change="onUploadBg" :disabled="bgUploading" />
                </label>
              </div>

              <div class="mt-3">
                <label class="block text-xs font-medium text-gray-600 mb-1">Fuente del nombre</label>
                <div class="flex gap-2">
                  <select v-model="form.certificateNameFont" @change="onFontChange" class="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm bg-white">
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times">Times</option>
                    <option value="Courier">Courier</option>
                    <option v-if="customFontName" :value="customFontName">{{ customFontName }}</option>
                  </select>
                  <label class="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-600 transition-colors shrink-0 flex items-center" title="Subir fuente personalizada">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    <input type="file" accept=".ttf,.otf,.woff,.woff2" class="hidden" @change="onUploadFont" :disabled="fontUploading" />
                  </label>
                </div>
                <div v-if="fontUploading" class="text-xs text-gray-400 mt-1">Subiendo fuente...</div>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Tamaño</label>
                  <input v-model.number="form.certificateNameSize" type="number" min="8" max="120" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Posición X</label>
                  <input v-model.number="form.certificateNameX" type="number" min="0" max="612" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1">Posición Y</label>
                  <input v-model.number="form.certificateNameY" type="number" min="0" max="792" class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-primary-500 outline-none text-sm" />
                </div>
                <div class="flex items-end">
                  <button @click="onCenter" class="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-600 transition-colors">
                    Centrar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button @click="handleSave" :disabled="saving" class="w-full px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl disabled:opacity-50 transition-colors">
            {{ saving ? 'Guardando...' : 'Guardar configuración' }}
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { coursesApi, uploadsApi } from "../../services/api";
import { useAuthStore } from "../../stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const courseId = Number(route.params.courseId);

const PAGE_W = 612;
const PAGE_H = 792;
const imgWidth = ref(0);
const imgHeight = ref(0);

const courseTitle = ref("");
const loading = ref(true);
const saving = ref(false);
const success = ref("");
const errorMsg = ref("");
const bgUploading = ref(false);
const fontUploading = ref(false);
const customFontName = ref("");

const previewEl = ref<HTMLElement | null>(null);

const testName = ref(authStore.user?.name || "Nombre del Estudiante");

function getImageDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = url;
  });
}

async function updateImgDims(url: string) {
  const dims = await getImageDimensions(url);
  imgWidth.value = dims.width;
  imgHeight.value = dims.height;
}

const form = reactive({
  certificateEnabled: true,
  certificateTitle: "",
  certificateBgUrl: "",
  certificateNameX: 100,
  certificateNameY: 100,
  certificateNameSize: 28,
  certificateNameFont: "Helvetica",
  certificateFontUrl: null as string | null,
});

const previewName = computed(() => testName.value || "Nombre del Estudiante");

const scaleX = computed(() => {
  if (!previewEl.value) return 1;
  return previewEl.value.clientWidth / PAGE_W;
});
const scaleY = computed(() => {
  if (!previewEl.value) return 1;
  return previewEl.value.clientHeight / PAGE_H;
});

const previewStyle = computed(() => ({
  width: "100%",
  aspectRatio: imgWidth.value ? `${imgWidth.value} / ${imgHeight.value}` : `${PAGE_W} / ${PAGE_H}`,
}));

const nameStyle = computed(() => {
  const fs = form.certificateNameSize * scaleX.value;
  let fontFamily = "Helvetica, Arial, sans-serif";
  if (form.certificateNameFont === "Times") fontFamily = "Times New Roman, serif";
  else if (form.certificateNameFont === "Courier") fontFamily = "Courier New, monospace";
  else if (customFontName.value && form.certificateNameFont === customFontName.value) fontFamily = `"CertFont", ${form.certificateNameFont}`;

  return {
    left: `${form.certificateNameX * scaleX.value}px`,
    top: `${form.certificateNameY * scaleY.value}px`,
    fontSize: `${fs}px`,
    fontFamily,
    fontWeight: "bold" as const,
    color: "#1e3a5f",
    textShadow: "0 1px 4px rgba(255,255,255,0.9), 0 0 8px rgba(255,255,255,0.6)",
    whiteSpace: "nowrap" as const,
    lineHeight: "1" as const,
  };
});

let dragging = false;
let dragStartX = 0;
let dragStartY = 0;
let origX = 0;
let origY = 0;

function startDrag(e: MouseEvent) {
  if (!form.certificateEnabled) return;
  dragging = true;
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  origX = form.certificateNameX;
  origY = form.certificateNameY;
  document.addEventListener("mousemove", onDrag);
  document.addEventListener("mouseup", stopDrag);
}

function onDrag(e: MouseEvent) {
  if (!dragging) return;
  const dx = (e.clientX - dragStartX) / scaleX.value;
  const dy = (e.clientY - dragStartY) / scaleY.value;
  form.certificateNameX = Math.round(Math.max(0, Math.min(PAGE_W, origX + dx)));
  form.certificateNameY = Math.round(Math.max(0, Math.min(PAGE_H, origY + dy)));
}

function stopDrag() {
  dragging = false;
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
}

function onCenter() {
  form.certificateNameX = Math.round(PAGE_W / 2 - 100);
  form.certificateNameY = Math.round(PAGE_H / 2);
}

function onFontChange() {
  if (form.certificateNameFont === customFontName.value && form.certificateFontUrl) {
    loadCustomFont(form.certificateFontUrl, customFontName.value);
  }
}

function loadCustomFont(url: string, name: string) {
  const existing = document.getElementById("cert-font-face");
  if (existing) existing.remove();
  const style = document.createElement("style");
  style.id = "cert-font-face";
  style.textContent = `@font-face { font-family: "CertFont"; src: url("${url}"); font-display: swap; }`;
  document.head.appendChild(style);
}

onBeforeUnmount(() => {
  document.removeEventListener("mousemove", onDrag);
  document.removeEventListener("mouseup", stopDrag);
});

onMounted(async () => {
  try {
    const course = await coursesApi.getById(courseId);
    courseTitle.value = course.title;
    form.certificateEnabled = course.certificateEnabled;
    form.certificateTitle = course.certificateTitle || "";
    form.certificateBgUrl = course.certificateBgUrl || "";
    form.certificateNameX = course.certificateNameX;
    form.certificateNameY = course.certificateNameY;
    form.certificateNameSize = course.certificateNameSize;
    form.certificateNameFont = course.certificateNameFont;
    form.certificateFontUrl = course.certificateFontUrl;

    if (form.certificateFontUrl) {
      const name = form.certificateFontUrl.split("/").pop()?.replace(/\.[^.]+$/, "") || "Custom";
      customFontName.value = name;
      if (form.certificateNameFont === name || !["Helvetica", "Times", "Courier"].includes(form.certificateNameFont)) {
        form.certificateNameFont = name;
      }
      loadCustomFont(form.certificateFontUrl, name);
    }

    if (form.certificateBgUrl) {
      await updateImgDims(form.certificateBgUrl);
    }
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || "Error al cargar el curso";
  } finally {
    loading.value = false;
  }
});

async function onUploadBg(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  bgUploading.value = true;
  try {
    const { url } = await uploadsApi.uploadCertificateBg(file);
    form.certificateBgUrl = url;
    await updateImgDims(url);
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || "Error al subir la imagen";
  } finally {
    bgUploading.value = false;
    target.value = "";
  }
}

async function onUploadFont(e: Event) {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  fontUploading.value = true;
  try {
    const { url, name } = await uploadsApi.uploadCertificateFont(file);
    form.certificateFontUrl = url;
    customFontName.value = name;
    form.certificateNameFont = name;
    loadCustomFont(url, name);
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || "Error al subir la fuente";
  } finally {
    fontUploading.value = false;
    target.value = "";
  }
}

async function handleSave() {
  saving.value = true;
  success.value = "";
  errorMsg.value = "";
  try {
    await coursesApi.update(courseId, { ...form });
    success.value = "Redirigiendo...";
    setTimeout(() => router.push("/admin/courses"), 800);
  } catch (e: any) {
    errorMsg.value = e.response?.data?.error || "Error al guardar";
  } finally {
    saving.value = false;
  }
}
</script>
