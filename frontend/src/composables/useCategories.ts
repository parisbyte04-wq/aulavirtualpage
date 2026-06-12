import { ref } from "vue";
import { coursesApi } from "../services/api";

const categories = ref<string[]>([]);
let loaded = false;

export function useCategories() {
  async function loadCategories() {
    if (loaded) return;
    try {
      const all = await coursesApi.getAll();
      const cats = new Set(all.map((c) => c.category).filter((c): c is string => c !== null));
      categories.value = [...cats].sort();
      loaded = true;
    } catch { /* silently fail */ }
  }

  return { categories, loadCategories };
}

export function addCategory(cat: string) {
  if (cat && !categories.value.includes(cat)) {
    categories.value.push(cat);
    categories.value.sort();
  }
}
