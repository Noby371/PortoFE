<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import api from '../../services/api'

interface Education {
  id: number
  institution: string
  degree: string
  field: string
  startYear: number
  endYear: number | null
  isCurrent: boolean
  gpa: number | null
  description: string | null
}

const educations = ref<Education[]>([])
const isLoading = ref(true)
const successMsg = ref('')
const errorMsg = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const emptyForm = {
  id: 0,
  institution: '',
  degree: '',
  field: '',
  startYear: new Date().getFullYear(),
  endYear: null as number | null,
  isCurrent: false,
  gpa: null as number | null,
  description: '',
}

const form = ref({ ...emptyForm })

onMounted(fetchEducations)

async function fetchEducations() {
  isLoading.value = true
  try {
    const res = await api.get('/education')
    educations.value = res.data
  } catch {
    errorMsg.value = 'Gagal memuat data pendidikan.'
  } finally {
    isLoading.value = false
  }
}

function openCreate() {
  isEditing.value = false
  form.value = { ...emptyForm }
  isModalOpen.value = true
}

function openEdit(edu: Education) {
  isEditing.value = true
  form.value = {
    ...edu,
    description: edu.description ?? '',
    endYear: edu.endYear ?? null,
    gpa: edu.gpa ?? null,
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

async function handleSave() {
  isSaving.value = true
  try {
    const payload = {
      ...form.value,
      gpa:         form.value.gpa ? Number(form.value.gpa) : null,
      endYear:     form.value.isCurrent ? null : form.value.endYear ? Number(form.value.endYear) : null,
      description: form.value.description || null,
    }

    if (isEditing.value) {
      await api.patch(`/education/${form.value.id}`, payload)
      showSuccess('Pendidikan berhasil diperbarui!')
    } else {
      await api.post('/education', payload)
      showSuccess('Pendidikan berhasil ditambahkan!')
    }
    closeModal()
    await fetchEducations()
  } catch {
    errorMsg.value = 'Gagal menyimpan data pendidikan.'
    setTimeout(() => (errorMsg.value = ''), 3000)
  } finally {
    isSaving.value = false
  }
}

async function handleDelete(edu: Education) {
  if (!confirm(`Hapus data pendidikan "${edu.institution}"?`)) return
  try {
    await api.delete(`/education/${edu.id}`)
    showSuccess('Pendidikan berhasil dihapus!')
    await fetchEducations()
  } catch {
    errorMsg.value = 'Gagal menghapus data pendidikan.'
    setTimeout(() => (errorMsg.value = ''), 3000)
  }
}

function showSuccess(msg: string) {
  successMsg.value = msg
  setTimeout(() => (successMsg.value = ''), 4000)
}
</script>

<template>
  <div class="education-view">

    <!-- Header -->
    <div class="view-header">
      <div>
        <h2 class="view-title">Education</h2>
        <p class="view-desc">{{ educations.length }} entri terdaftar</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <PlusIcon class="btn-icon" />
        Tambah Pendidikan
      </button>
    </div>

    <!-- Alert -->
    <Transition name="fade">
      <div v-if="successMsg" class="alert alert-success">
        <CheckCircleIcon class="alert-icon" />
        {{ successMsg }}
      </div>
      <div v-else-if="errorMsg" class="alert alert-error">
        <ExclamationTriangleIcon class="alert-icon" />
        {{ errorMsg }}
      </div>
    </Transition>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">Memuat data pendidikan...</div>

    <!-- List -->
    <div v-else class="edu-list">
      <div
        v-for="edu in educations"
        :key="edu.id"
        class="edu-card"
      >
        <div class="edu-icon-wrap">
          <span class="edu-icon">🎓</span>
        </div>

        <div class="edu-body">
          <div class="edu-meta">
            <span v-if="edu.isCurrent" class="current-badge">● Sedang Berjalan</span>
            <span v-if="edu.gpa" class="gpa-badge">IPK {{ edu.gpa.toFixed(2) }}</span>
          </div>
          <h3 class="edu-institution">{{ edu.institution }}</h3>
          <p class="edu-degree">{{ edu.degree }} — {{ edu.field }}</p>
          <p class="edu-year">
            {{ edu.startYear }} —
            {{ edu.isCurrent ? 'Sekarang' : edu.endYear ?? '-' }}
          </p>
          <p v-if="edu.description" class="edu-desc">{{ edu.description }}</p>
        </div>

        <div class="edu-actions">
          <button class="btn-icon-action edit" @click="openEdit(edu)">
            <PencilSquareIcon class="action-icon" />
          </button>
          <button class="btn-icon-action delete" @click="handleDelete(edu)">
            <TrashIcon class="action-icon" />
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="educations.length === 0" class="empty-state">
        <p>Belum ada data pendidikan. Klik "Tambah Pendidikan" untuk memulai.</p>
      </div>
    </div>

  </div>

  <!-- Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box">

          <div class="modal-header">
            <h3 class="modal-title">{{ isEditing ? 'Edit Pendidikan' : 'Tambah Pendidikan' }}</h3>
            <button class="modal-close" @click="closeModal">
              <XMarkIcon class="close-icon" />
            </button>
          </div>

          <form class="modal-form" @submit.prevent="handleSave">

            <div class="form-group">
              <label class="form-label">Nama Institusi</label>
              <input
                v-model="form.institution"
                type="text"
                class="form-input"
                placeholder="Universitas Wiraraja Madura"
                required
              />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Gelar</label>
                <input
                  v-model="form.degree"
                  type="text"
                  class="form-input"
                  placeholder="Sarjana Komputer (S.Kom)"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Bidang Studi</label>
                <input
                  v-model="form.field"
                  type="text"
                  class="form-input"
                  placeholder="Teknik Informatika"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Tahun Masuk</label>
                <input
                  v-model.number="form.startYear"
                  type="number"
                  class="form-input"
                  placeholder="2021"
                  min="1900"
                  max="2100"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">Tahun Lulus</label>
                <input
                  v-model.number="form.endYear"
                  type="number"
                  class="form-input"
                  placeholder="2025"
                  min="1900"
                  max="2100"
                  :disabled="form.isCurrent"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">IPK (opsional)</label>
                <input
                  v-model.number="form.gpa"
                  type="number"
                  class="form-input"
                  placeholder="3.75"
                  min="0"
                  max="4"
                  step="0.01"
                />
              </div>
              <div class="form-group" style="justify-content: flex-end; padding-bottom: 0.2rem;">
                <div class="form-group-inline">
                  <input
                    v-model="form.isCurrent"
                    type="checkbox"
                    id="isCurrent"
                    class="form-checkbox"
                  />
                  <label for="isCurrent" class="form-label-inline">Masih berjalan</label>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Deskripsi (opsional)</label>
              <textarea
                v-model="form.description"
                class="form-input form-textarea"
                placeholder="Fokus riset, aktivitas, prestasi..."
                rows="3"
              ></textarea>
            </div>

            <div class="modal-actions">
              <button type="button" class="btn-cancel" @click="closeModal">Batal</button>
              <button type="submit" class="btn-submit" :disabled="isSaving">
                <span v-if="isSaving" class="spinner"></span>
                <span v-else>{{ isEditing ? 'Simpan' : 'Tambah' }}</span>
              </button>
            </div>

          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.education-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.view-desc {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  margin-top: 0.2rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
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

.btn-primary:hover {
  background: var(--color-accent-hover);
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.alert-success {
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  color: #4ade80;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.alert-icon {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
}

.loading {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

/* List */
.edu-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edu-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: all var(--transition);
}

.edu-card:hover {
  border-color: var(--color-border-hover);
}

.edu-icon-wrap {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 10px;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.edu-icon {
  font-size: 1.25rem;
}

.edu-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.edu-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.current-badge {
  font-size: 0.72rem;
  color: #4ade80;
  font-family: var(--font-mono);
}

.gpa-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: var(--color-accent-dim);
}

.edu-institution {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.edu-degree {
  font-size: 0.825rem;
  color: var(--color-accent);
  font-weight: 500;
}

.edu-year {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.edu-desc {
  font-size: 0.825rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-top: 0.25rem;
}

.edu-actions {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex-shrink: 0;
}

.btn-icon-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  transition: all var(--transition);
}

.btn-icon-action.edit:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-dim);
}

.btn-icon-action.delete:hover {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.action-icon {
  width: 0.9rem;
  height: 0.9rem;
  color: var(--color-text-muted);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  background: var(--color-bg-card);
  border: 1px dashed var(--color-border);
  border-radius: 12px;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-box {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1.75rem;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.modal-close {
  width: 2rem;
  height: 2rem;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}

.modal-close:hover {
  border-color: var(--color-accent);
  background: var(--color-accent-dim);
}

.close-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-text-secondary);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
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
  padding: 0.65rem 0.9rem;
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-family: var(--font-sans);
  transition: all var(--transition);
  outline: none;
}

.form-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-dim);
}

.form-input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-group-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-accent);
  cursor: pointer;
}

.form-label-inline {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  padding: 0.65rem 1.25rem;
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
  padding: 0.65rem 1.5rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition);
  min-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-accent-hover);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
