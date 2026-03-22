import { watchEffect, type Ref } from "vue";

export function useMeta(meta: {
  title?: Ref<string | undefined> | string;
  description?: Ref<string | undefined> | string;
}) {
  watchEffect(() => {
    const title = typeof meta.title === "string" ? meta.title : meta.title?.value;
    if (title) {
      document.title = title;
    }

    const desc =
      typeof meta.description === "string"
        ? meta.description
        : meta.description?.value;
    if (desc) {
      let el = document.querySelector('meta[name="description"]');
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", "description");
        document.head.appendChild(el);
      }
      el.setAttribute("content", desc);
    }
  });
}
