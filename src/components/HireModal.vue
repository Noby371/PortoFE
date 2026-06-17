<script setup lang="ts">
import { ref } from 'vue'
import { useHireModal } from '../composables/useHireModal'
import {
  XMarkIcon,
  PaperAirplaneIcon,
  BriefcaseIcon,
} from '@heroicons/vue/24/outline'

const { isOpen, closeModal } = useHireModal()

const form = ref({
  name: '',
  email: '',
  budget: '',
  type: '',
  message: '',
})

const isSubmitting = ref(false)
const isSuccess = ref(false)

const projectTypes = [
  'Web Development',
  'Mobile App',
  'IoT System',
  'Konsultasi IT',
  'Lainnya',
]

async function handleSubmit() {
  isSubmitting.value = true
  await new Promise((r) => setTimeout(r, 1500))
  isSubmitting.value = false
  isSuccess.value = true
  form.value = { name: '', email: '', budget: '', type: '', message: '' }
  setTimeout(() => {
    isSuccess.value = false
    closeModal()
  }, 3000)
}

function handleBackdrop(e: MouseEvent) {
  if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
    closeModal()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-backdrop"
        @click="handleBackdrop"
      >
        <div class="modal-box">

          <!-- Header -->
          <div class="modal-header">
            <div class="modal-title-wrap">
              <div class="modal-icon-wrap">
                <BriefcaseIcon class="modal-icon" />
              </div>
              <div>
                <h2 class="modal-title">Hire Me</h2>
                <p class="modal-subtitle">Ceritakan proyek Anda</p>
              </div>
            </div>
            <button class="modal-close" @click="closeModal">
              <XMarkIcon class="close-icon" />
            </button>
          </div>

          <!-- Success -->
          <div v-if="isSuccess" class="success-state">
            <div class="success-emoji">🎉</div>
            <h3 class="success-title">Pesan Terkirim!</h3>
            <p class="success-desc">Saya akan menghubungi Anda secepatnya.</p>
          </div>

          <!-- Form -->
          <form v-else class="modal-form" @submit.prevent="handleSubmit">

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nama Lengkap</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-input"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-input"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Jenis Project</label>
                <select v-model="form.type" class="form-input" required>
                  <option value="" disabled>Pilih jenis project</option>
                  <option
                    v-for="type in projectTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ type }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Budget (opsional)</label>
                <input
                  v-model="form.budget"
                  type="text"
                  class="form-input"
                  placeholder="Rp 1.000.000 — Rp 5.000.000"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Deskripsi Project</label>
              <textarea
                v-model="form.message"
                class="form-input form-textarea"
                placeholder="Jelaskan kebutuhan, timeline, dan detail project Anda..."
                rows="4"
                required
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn-cancel" @click="closeModal">
                Batal
              </button>
              <button type="submit" class="btn-submit" :disabled="isSubmitting">
                <span v-if="isSubmitting" class="spinner"></span>
                <template v-else>
                  <PaperAirplaneIcon class="btn-icon" />
                  Kirim
                </template>
              </button>
            </div>

          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ── Backdrop ── */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(6px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

/* ── Box ── */
.modal-box {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  width: 100%;
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
}

/* ── Header ── */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.75rem;
}

.modal-title-wrap {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.modal-icon-wrap {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 12px;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-icon {
  width: 1.3rem;
  height: 1.3rem;
  color: var(--color-accent);
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.modal-subtitle {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 0.1rem;
}

.modal-close {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
  flex-shrink: 0;
}

.modal-close:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-dim);
}

.close-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--color-text-secondary);
}

/* ── Form ── */
.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.form-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.form-input {
  background: var(--color-bg-hover);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.7rem 1rem;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-family: var(--font-sans);
  transition: all var(--transition);
  outline: none;
  width: 100%;
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

.form-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-dim);
}

select.form-input {
  cursor: pointer;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Actions */
.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.btn-cancel {
  padding: 0.7rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition);
}

.btn-cancel:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text-primary);
}

.btn-submit {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.75rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition);
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

/* Spinner */
.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Success ── */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 2rem;
  text-align: center;
}

.success-emoji {
  font-size: 3rem;
}

.success-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #4ade80;
}

.success-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

/* ── Transition ── */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  transform: scale(0.95) translateY(20px);
}

/* ── Responsive ── */
@media (max-width: 480px) {
  .modal-box {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
