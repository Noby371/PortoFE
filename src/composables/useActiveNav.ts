import { ref, onMounted, onUnmounted } from 'vue'

export function useActiveNav() {
  const activeSection = ref('hero')

  let observer: IntersectionObserver | null = null

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            activeSection.value = entry.target.id
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '-80px 0px 0px 0px',
      }
    )

    document
      .querySelectorAll('section[id]')
      .forEach((el) => observer?.observe(el))
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { activeSection }
}
