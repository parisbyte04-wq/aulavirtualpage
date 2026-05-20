<template>
  <section id="contacto" class="py-20 lg:py-28 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <SectionTitle
        title="Contáctanos"
        subtitle="Estamos interesados en conocer tu proyecto o responder tus preguntas."
      />

      <div class="max-w-2xl mx-auto">
        <form @submit.prevent="handleSubmit" class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div v-if="success" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
            {{ success }}
          </div>
          <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {{ error }}
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                v-model="form.name"
                type="text"
                required
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                placeholder="tu@email.com"
              />
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
            <input
              v-model="form.subject"
              type="text"
              required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
              placeholder="Asunto del mensaje"
            />
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea
              v-model="form.message"
              required
              rows="5"
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all resize-none"
              placeholder="Escribe tu mensaje aquí..."
            />
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {{ loading ? 'Enviando...' : 'Enviar mensaje' }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { contact } from "../../services/api";
import SectionTitle from "../ui/SectionTitle.vue";

const form = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
});

const loading = ref(false);
const success = ref("");
const error = ref("");

async function handleSubmit() {
  loading.value = true;
  success.value = "";
  error.value = "";
  try {
    await contact.send({ ...form });
    success.value = "Mensaje enviado correctamente. Te contactaremos pronto.";
    form.name = "";
    form.email = "";
    form.subject = "";
    form.message = "";
  } catch (e: any) {
    error.value = e.response?.data?.error || "Error al enviar el mensaje. Intenta de nuevo.";
  } finally {
    loading.value = false;
  }
}
</script>
