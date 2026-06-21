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

interface Project {
  id: number
  title: string
  slug: string
  description: string
  longDesc: string | null
  type: string
  status: string
  techStack: string[]
  imageUrl: string | null
  repoUrl: string | null
  demoUrl: string | null
  featured: boolean
  startDate: string
  endDate: string | null
}

const projects = ref<Project[]>([])
const isLoading = ref(true)
const successMsg = ref('')
const errorMsg = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const techInput = ref('')

const projectTypes = ['THESIS', 'FREELANCE', 'STARTUP', 'PERSONAL', 'ACADEMIC']
const projectStatuses = ['IN_PROGRESS', 'COMPLETED', 'ARCHIVED']

const emptyForm = {
  id: 0,
  title: '',
  slug: '',
  description: '',
  longDesc: '',
  type: 'PERSONAL',
  status: 'IN_PROGRESS',
  techStack: [] as string[],
  imageUrl: '',
  repoUrl: '',
  demoUrl: '',
  featured: false,
  startDate: '',
  endDate: '',
}

const form = ref({ ...emptyForm })

const statusColor: Record<string, string> = {
  IN_PROGRESS: '#f59e0b',
  COMPLETED:   '#4ade80',
  ARCHIVED:    '#6b7280',
}

const statusLabel: Record<string, string> = {
  IN_PROGRESS: 'On Going',
  COMPLETED:   'Selesai',
  ARCHIVED:    'Arsip',
}

onMounted(fetchProjects)

async function fetchProjects() {
  isLoading.value = true
  try {
    const res = await api.get('/projects?limit=100')
    projects.value = res.data.data
  } catch {
    errorMsg.value = 'Gagal memuat data projects.'
  } finally {
    isLoading.value = false
  }
}

function openCreate() {
  isEditing.value = false
  form.value = { ...emptyForm, techStack: [] }
  techInput.value = ''
  isModalOpen.value = true
}

function openEdit(project: Project) {
  isEditing.value = true
  form.value = {
    ...project,
    longDesc: project.longDesc ?? '',
    imageUrl: project.imageUrl ?? '',
    repoUrl: project.repoUrl ?? '',
    demoUrl: project.demoUrl ?? '',
    endDate: project.endDate ? project.endDate.slice(0, 10) : '',
    startDate: project.startDate.slice(0, 10),
  }
  techInput.value = ''
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function addTech() {
  const val = techInput.value.trim()
  if (val && !form.value.techStack.includes(val)) {
    form.value.techStack.push(val)
  }
  techInput.value = ''
}

function removeTech(tech: string) {
  form.value.techStack = form.value.techStack.filter((t) => t !== tech)
}

function generateSlug() {
  form.value.slug = form.value.title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function handleSave() {
  isSaving.value = true
  try {
    const payload = {
      ...form.value,
      longDesc:  form.value.longDesc  || null,
      imageUrl:  form.value.imageUrl  || null,
      repoUrl:   form.value.repoUrl   || null,
      demoUrl:   form.value.demoUrl   || null,
      endDate:   form.value.endDate   ? new Date(form.value.endDate).toISOString()  : null,
      startDate: new Date(form.value.startDate).toISOString(),
    }

    if (isEditing.value) {
      await api.patch(`/projects/${form.value.id}`, payload)
      showSuccess('Project berhasil diperbarui!')
    } else {
      await api.post('/projects', payload)
      showSuccess('Project berhasil ditambahkan!')
    }
    closeModal()
    await fetchProjects()
  } catch {
    errorMsg.value = 'Gagal menyimpan project.'
    setTimeout(() => (errorMsg.value = ''), 3000)
  } finally {
    isSaving.value = false
  }
}

async function handleDelete(project: Project) {
  if (!confirm(`Hapus project "${project.title}"?`)) return
  try {
    await api.delete(`/projects/${project.id}`)
    showSuccess('Project berhasil dihapus!')
    await fetchProjects()
  } catch {
    errorMsg.value = 'Gagal menghapus project.'
    setTimeout(() => (errorMsg.value = ''), 3000)
  }
}

function showSuccess(msg: string) {
  successMsg.value = msg
  setTimeout(() => (successMsg.value = ''), 4000)
}
</script>

<template>
  <div class="projects-view">

    <!-- Header -->
    <div class="view-header">
      <div>
        <h2 class="view-title">Projects</h2>
        <p class="view-desc">{{ projects.length }} project terdaftar</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <PlusIcon class="btn-icon" />
        Tambah Project
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
    <div v-if="isLoading" class="loading">Memuat data projects...</div>

    <!-- Project List -->
    <div v-else class="project-list">
      <div
        v-for="project in projects"
        :key="project.id"
        class="project-card"
      >
        <div class="project-card-left">
          <div class="project-meta">
            <span class="type-badge">{{ project.type }}</span>
            <span
              class="status-badge"
              :style="{
                color: statusColor[project.status],
                borderColor: statusColor[project.status] + '44',
                background: statusColor[project.status] + '11',
              }"
            >
              {{ statusLabel[project.status] }}
            </span>
            <span v-if="project.featured" class="featured-badge">⭐ Featured</span>
          </div>
          <h3 class="project-title">{{ project.title }}</h3>
          <p class="project-desc">{{ project.description }}</p>
          <div class="tech-list">
            <span
              v-for="tech in project.techStack.slice(0, 4)"
              :key="tech"
              class="tech-tag"
            >{{ tech }}</span>
            <span v-if="project.techStack.length > 4" class="tech-more">
              +{{ project.techStack.length - 4 }}
            </span>
          </div>
        </div>
        <div class="project-card-right">
          <button class="btn-icon-action edit" @click="openEdit(project)">
            <PencilSquareIcon class="action-icon" />
          </button>
          <button class="btn-icon-action delete" @click="handleDelete(project)">
            <TrashIcon class="action-icon" />
          </button>
        </div>
      </div>
    </div>

  </div>

  <!-- ── Modal ── -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box">

          <div class="modal-header">
            <h3 class="modal-title">{{ isEditing ? 'Edit Project' : 'Tambah Project' }}</h3>
            <button class="modal-close" @click="closeModal">
              <XMarkIcon class="close-icon" />
            </button>
          </div>

          <form class="modal-form" @submit.prevent="handleSave">

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Judul</label>
                <input
                  v-model="form.title"
                  type="text"
                  class="form-input"
                  placeholder="Nama project"
                  required
                  @input="generateSlug"
                />
              </div>
              <div class="form-group">
                <label class="form-label">Slug</label>
                <input v-model="form.slug" type="text" class="form-input" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Deskripsi Singkat</label>
              <textarea v-model="form.description" class="form-input form-textarea" rows="2" required></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Tipe</label>
                <select v-model="form.type" class="form-input">
                  <option v-for="t in projectTypes" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Status</label>
                <select v-model="form.status" class="form-input">
                  <option v-for="s in projectStatuses" :key="s" :value="s">{{ statusLabel[s] }}</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Tanggal Mulai</label>
                <input v-model="form.startDate" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Tanggal Selesai</label>
                <input v-model="form.endDate" type="date" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Tech Stack</label>
              <div class="tech-input-wrap">
                <input
                  v-model="techInput"
                  type="text"
                  class="form-input"
                  placeholder="Ketik lalu tekan Enter"
                  @keydown.enter.prevent="addTech"
                />
                <button type="button" class="btn-add-tech" @click="addTech">
                  <PlusIcon class="btn-icon" />
                </button>
              </div>
              <div v-if="form.techStack.length" class="tech-tags">
                <span
                  v-for="tech in form.techStack"
                  :key="tech"
                  class="tech-tag-removable"
                >
                  {{ tech }}
                  <button type="button" @click="removeTech(tech)">
                    <XMarkIcon class="remove-icon" />
                  </button>
                </span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Repo URL</label>
                <input v-model="form.repoUrl" type="url" class="form-input" placeholder="https://github.com/..." />
              </div>
              <div class="form-group">
                <label class="form-label">Demo URL</label>
                <input v-model="form.demoUrl" type="url" class="form-input" placeholder="https://..." />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Image URL</label>
              <input v-model="form.imageUrl" type="url" class="form-input" placeholder="https://..." />
            </div>

            <div class="form-group-inline">
              <input v-model="form.featured" type="checkbox" id="featured" class="form-checkbox" />
              <label for="featured" class="form-label-inline">Tampilkan sebagai Featured Project</label>
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
.projects-view {
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

/* Alert */
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

/* Project List */
.project-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.project-card {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: all var(--transition);
}

.project-card:hover {
  border-color: var(--color-border-hover);
}

.project-card-left {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: var(--color-accent-dim);
}

.status-badge {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  border: 1px solid;
}

.featured-badge {
  font-size: 0.68rem;
  color: #f59e0b;
}

.project-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.project-desc {
  font-size: 0.825rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  overflow: hidden;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.tech-tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-text-muted);
  background: var(--color-bg-hover);
  border: 1px solid var(--color-border);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.tech-more {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--color-accent);
}

.project-card-right {
  display: flex;
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
  max-width: 620px;
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

.form-textarea {
  resize: vertical;
  min-height: 70px;
}

/* Tech Stack Input */
.tech-input-wrap {
  display: flex;
  gap: 0.5rem;
}

.btn-add-tech {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  flex-shrink: 0;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  border-radius: 8px;
  cursor: pointer;
  transition: all var(--transition);
  color: var(--color-accent);
}

.btn-add-tech:hover {
  background: var(--color-accent);
  color: #fff;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.5rem;
}

.tech-tag-removable {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-accent);
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.tech-tag-removable button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  color: var(--color-accent);
}

.remove-icon {
  width: 0.7rem;
  height: 0.7rem;
}

/* Featured Checkbox */
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

/* Modal Actions */
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
