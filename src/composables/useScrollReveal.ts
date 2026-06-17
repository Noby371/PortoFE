// composables/useScrollReveal.ts
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export function useScrollReveal() {
  let observer: IntersectionObserver | null = null
  const router = useRouter()

  const observeElements = () => {
    // Cleanup observer lama
    if (observer) {
      observer.disconnect()
    }

    // Buat observer baru
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

    // Cari semua elemen dengan class reveal
    const revealElements = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-up'
    )

    // Reset class revealed (biar animasi muncul lagi)
    revealElements.forEach(el => el.classList.remove('revealed'))

    // Observe ulang semua elemen
    revealElements.forEach(el => observer?.observe(el))
  }

  onMounted(() => {
    // Inisialisasi pertama kali
    observeElements()

    // Listener untuk navigasi SPA
    const removeAfterEach = router.afterEach(() => {
      // Tunggu DOM update setelah navigasi selesai
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
  })
}
