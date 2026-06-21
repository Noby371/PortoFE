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

interface Experience {
  id: number
  company: string
  role: string
  description: string
  startDate: string
  endDate: string | null
  isCurrent: boolean
  location: string | null
  type: string
}

const experiences = ref<Experience[]>([])
const isLoading = ref(true)
const successMsg = ref('')
const errorMsg = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const experienceTypes = ['WORK', 'INTERNSHIP', 'ORGANIZATION', 'FREELANCE']

const typeLabel: Record<string, string> = {
  WORK:         'Pekerjaan',
  INTERNSHIP:   'Magang',
  ORGANIZATION: 'Organisasi',
  FREELANCE:    'Freelance',
}

const typeColor: Record<string, string> = {
  WORK:         '#6c63ff',
  INTERNSHIP:   '#f59e0b',
  ORGANIZATION: '#10b981',
  FREELANCE:    '#3b82f6',
}

const emptyForm = {
  id: 0,
  company: '',
  role: '',
  description: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  location: '',
  type: 'WORK',
}

const form = ref({ ...emptyForm })

onMounted(fetchExperiences)

async function fetchExperiences() {
  isLoading.value = true
  try {
    const res = await api.get('/experience')
    experiences.value = res.data
  } catch {
    errorMsg.value = 'Gagal memuat data experience.'
  } finally {
    isLoading.value = false
  }
}

function openCreate() {
  isEditing.value = false
  form.value = { ...emptyForm }
  isModalOpen.value = true
}

function openEdit(exp: Experience) {
  isEditing.value = true
  form.value = {
    ...exp,
    location: exp.location ?? '',
    startDate: exp.startDate.slice(0, 10),
    endDate: exp.endDate ? exp.endDate.slice(0, 10) : '',
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
      location: form.value.location || null,
      endDate:  form.value.endDate ? new Date(form.value.endDate).toISOString() : null,
      startDate: new Date(form.value.startDate).toISOString(),
    }

    if (isEditing.value) {
      await api.patch(`/experience/${form.value.id}`, payload)
      showSuccess('Experience berhasil diperbarui!')
    } else {
      await api.post('/experience', payload)
      showSuccess('Experience berhasil ditambahkan!')
    }
    closeModal()
    await fetchExperiences()
  } catch {
    errorMsg.value = 'Gagal menyimpan experience.'
    setTimeout(() => (errorMsg.value = ''), 3000)
  } finally {
    isSaving.value = false
  }
}

async function handleDelete(exp: Experience) {
  if (!confirm(`Hapus experience "${exp.role} di ${exp.company}"?`)) return
  try {
    await api.delete(`/experience/${exp.id}`)
    showSuccess('Experience berhasil dihapus!')
    await fetchExperiences()
  } catch {
    errorMsg.value = 'Gagal menghapus experience.'
    setTimeout(() => (errorMsg.value = ''), 3000)
  }
}

function showSuccess(msg: string) {
  successMsg.value = msg
  setTimeout(() => (successMsg.value = ''), 4000)
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
}
</script>

<template>
  <div class="experience-view">

    <!-- Header -->
    <div class="view-header">
      <div>
        <h2 class="view-title">Experience</h2>
        <p class="view-desc">{{ experiences.length }} entri terdaftar</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <PlusIcon class="btn-icon" />
        Tambah Experience
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
    <div v-if="isLoading" class="loading">Memuat data experience...</div>

    <!-- List -->
    <div v-else class="exp-list">
      <div
        v-for="exp in experiences"
        :key="exp.id"
        class="exp-card"
      >
        <div class="exp-left">
          <div class="exp-dot" :style="{ background: typeColor[exp.type] }"></div>
        </div>
        <div class="exp-body">
          <div class="exp-meta">
            <span
              class="type-badge"
              :style="{
                color: typeColor[exp.type],
                borderColor: typeColor[exp.type] + '44',
                background: typeColor[exp.type] + '11',
              }"
            >
              {{ typeLabel[exp.type] }}
            </span>
            <span v-if="exp.isCurrent" class="current-badge">● Saat ini</span>
          </div>
          <h3 class="exp-role">{{ exp.role }}</h3>
          <p class="exp-company">{{ exp.company }} · {{ exp.location }}</p>
          <p class="exp-date">
            {{ formatDate(exp.startDate) }} —
            {{ exp.isCurrent ? 'Sekarang' : exp.endDate ? formatDate(exp.endDate) : '-' }}
          </p>
          <p class="exp-desc">{{ exp.description }}</p>
        </div>
        <div class="exp-actions">
          <button class="btn-icon-action edit" @click="openEdit(exp)">
            <PencilSquareIcon class="action-icon" />
          </button>
          <button class="btn-icon-action delete" @click="handleDelete(exp)">
            <TrashIcon class="action-icon" />
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box">

          <div class="modal-header">
            <h3 class="modal-title">{{ isEditing ? 'Edit Experience' : 'Tambah Experience' }}</h3>
            <button class="modal-close" @click="closeModal">
              <XMarkIcon class="close-icon" />
            </button>
          </div>

          <form class="modal-form" @submit.prevent="handleSave">

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Perusahaan / Institusi</label>
                <input v-model="form.company" type="text" class="form-input" placeholder="InnoTech" required />
              </div>
              <div class="form-group">
                <label class="form-label">Posisi / Role</label>
                <input v-model="form.role" type="text" class="form-input" placeholder="Fullstack Developer" required />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Tipe</label>
                <select v-model="form.type" class="form-input">
                  <option v-for="t in experienceTypes" :key="t" :value="t">{{ typeLabel[t] }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Lokasi</label>
                <input v-model="form.location" type="text" class="form-input" placeholder="Sumenep, Madura" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Tanggal Mulai</label>
                <input v-model="form.startDate" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Tanggal Selesai</label>
                <input v-model="form.endDate" type="date" class="form-input" :disabled="form.isCurrent" />
              </div>
            </div>

            <div class="form-group-inline">
              <input v-model="form.isCurrent" type="checkbox" id="isCurrent" class="form-checkbox" />
              <label for="isCurrent" class="form-label-inline">Masih berlangsung saat ini</label>
            </div>

            <div class="form-group">
              <label class="form-label">Deskripsi</label>
              <textarea v-model="form.description" class="form-input form-textarea" rows="3" required></textarea>
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
.experience-view {
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
.exp-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.exp-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: all var(--transition);
}

.exp-card:hover {
  border-color: var(--color-border-hover);
}

.exp-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.3rem;
}

.exp-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.exp-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

.exp-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  border: 1px solid;
}

.current-badge {
  font-size: 0.72rem;
  color: #4ade80;
  font-family: var(--font-mono);
}

.exp-role {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.exp-company {
  font-size: 0.825rem;
  color: var(--color-accent);
  font-weight: 500;
}

.exp-date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.exp-desc {
  font-size: 0.825rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-top: 0.25rem;
}

.exp-actions {
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
  max-width: 560px;
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
