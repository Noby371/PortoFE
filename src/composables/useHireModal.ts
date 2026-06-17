import { ref } from 'vue'

const isOpen = ref(false)

export function useHireModal() {
  function openModal() {
    isOpen.value = true
    document.body.style.overflow = 'hidden'
  }

  function closeModal() {
    isOpen.value = false
    document.body.style.overflow = ''
  }

  return { isOpen, openModal, closeModal }
}
