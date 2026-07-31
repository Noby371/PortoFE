// composables/useScrollReveal.ts
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const REVEAL_SELECTOR = '.reveal, .reveal-left, .reveal-right, .reveal-up'

export function useScrollReveal() {
  let observer: IntersectionObserver | null = null
  let mutationObserver: MutationObserver | null = null
  const router = useRouter()

  const observeElements = () => {
    if (!observer) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      )
    }

    const revealElements = document.querySelectorAll(REVEAL_SELECTOR)
    revealElements.forEach((el) => {
      // Lewati elemen yang sudah ter-reveal, agar animasi tidak diputar ulang
      if (el.classList.contains('revealed')) return
      observer?.observe(el)
    })
  }

  const watchForNewElements = () => {
    if (mutationObserver) return
    // Amati elemen .reveal yang muncul belakangan (hasil render async/API),
    // supaya tidak "hilang" hanya karena belum sempat di-observe.
    mutationObserver = new MutationObserver(() => {
      observeElements()
    })
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  onMounted(() => {
    observeElements()
    watchForNewElements()

    // Listener untuk navigasi SPA
    const removeAfterEach = router.afterEach(() => {
      setTimeout(observeElements, 100)
    })

    // Cleanup router listener
    onUnmounted(() => {
      removeAfterEach()
    })
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
    if (mutationObserver) {
      mutationObserver.disconnect()
    }
  })
}
