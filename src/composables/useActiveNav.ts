import { ref, onMounted, onUnmounted } from 'vue'

export function useActiveNav() {
  const activeSection = ref('hero')

  let sections: HTMLElement[] = []
  let mutationObserver: MutationObserver | null = null

  function collectSections() {
    sections = [...document.querySelectorAll<HTMLElement>('section[id]')]
  }

  function updateActive() {
    if (sections.length === 0) return

    // Garis referensi: di tengah viewport. Section aktif = section terakhir
    // (urutan DOM) yang puncaknya masih berada di atas garis ini.
    const referenceLine = window.scrollY + window.innerHeight * 0.5

    let current = 'hero'
    for (const el of sections) {
      const top = el.getBoundingClientRect().top + window.scrollY
      if (top <= referenceLine) {
        current = el.id
      } else {
        break
      }
    }
    activeSection.value = current
  }

  onMounted(() => {
    collectSections()
    updateActive()

    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)

    // Amati penambahan/penghapusan section (mis. section yang dirender
    // setelah data async selesai dimuat), supaya tetap terdeteksi.
    mutationObserver = new MutationObserver(() => {
      collectSections()
      updateActive()
    })
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', updateActive)
    window.removeEventListener('resize', updateActive)
    mutationObserver?.disconnect()
  })

  return { activeSection }
}
