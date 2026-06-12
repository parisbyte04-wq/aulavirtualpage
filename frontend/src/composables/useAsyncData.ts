import { ref, type Ref } from "vue";

export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const data = ref<T | null>(null) as Ref<T | null>;
  const loading = ref(true);
  const error = ref("");

  async function execute() {
    loading.value = true;
    error.value = "";
    try {
      data.value = await fetcher();
    } catch (e: any) {
      error.value = e.response?.data?.error || e.message || "Error inesperado";
    } finally {
      loading.value = false;
    }
  }

  return { data, loading, error, execute };
}
