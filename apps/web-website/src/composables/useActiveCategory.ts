import { ref, onMounted, onUnmounted } from "vue";
import type { Category } from "../types";

export function useActiveCategory(categories: Category[]) {
  const activeId = ref(categories[0]?.id ?? 0);
  let observer: IntersectionObserver | null = null;

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const slug = entry.target.id.replace("cat-", "");
            const cat = categories.find((c) => c.slug === slug);
            if (cat) activeId.value = cat.id;
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    for (const cat of categories) {
      const el = document.getElementById(`cat-${cat.slug}`);
      if (el) observer.observe(el);
    }
  });

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { activeId };
}
