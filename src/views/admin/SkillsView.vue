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

interface Skill {
  id: number
  name: string
  category: string
  level: number
  iconSlug: string | null
}

const skills = ref<Skill[]>([])
const isLoading = ref(true)
const successMsg = ref('')
const errorMsg = ref('')

// ── Modal ──────────────────────────────────────────────────────────────────
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)

const emptyForm = {
  id: 0,
  name: '',
  category: 'BACKEND',
  level: 80,
  iconSlug: '',
}

const form = ref({ ...emptyForm })

const categories = [
  'BACKEND', 'FRONTEND', 'MOBILE',
  'DATABASE', 'DEVOPS', 'IOT', 'TOOLS', 'OTHER',
]

// ── Fetch ──────────────────────────────────────────────────────────────────
onMounted(fetchSkills)

async function fetchSkills() {
  isLoading.value = true
  try {
    const res = await api.get('/skills')
    skills.value = res.data
  } catch {
    errorMsg.value = 'Gagal memuat data skills.'
  } finally {
    isLoading.value = false
  }
}

// ── Modal Handlers ─────────────────────────────────────────────────────────
function openCreate() {
  isEditing.value = false
  form.value = { ...emptyForm }
  isModalOpen.value = true
}

function openEdit(skill: Skill) {
  isEditing.value = true
  form.value = { ...skill, iconSlug: skill.iconSlug ?? '' }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

// ── CRUD ───────────────────────────────────────────────────────────────────
async function handleSave() {
  isSaving.value = true
  try {
    if (isEditing.value) {
      await api.patch(`/skills/${form.value.id}`, {
        name: form.value.name,
        category: form.value.category,
        level: form.value.level,
        iconSlug: form.value.iconSlug || null,
      })
      showSuccess('Skill berhasil diperbarui!')
    } else {
      await api.post('/skills', {
        name: form.value.name,
        category: form.value.category,
        level: form.value.level,
        iconSlug: form.value.iconSlug || null,
      })
      showSuccess('Skill berhasil ditambahkan!')
    }
    closeModal()
    await fetchSkills()
  } catch {
    errorMsg.value = 'Gagal menyimpan skill.'
    setTimeout(() => (errorMsg.value = ''), 3000)
  } finally {
    isSaving.value = false
  }
}

async function handleDelete(skill: Skill) {
  if (!confirm(`Hapus skill "${skill.name}"?`)) return
  try {
    await api.delete(`/skills/${skill.id}`)
    showSuccess('Skill berhasil dihapus!')
    await fetchSkills()
  } catch {
    errorMsg.value = 'Gagal menghapus skill.'
    setTimeout(() => (errorMsg.value = ''), 3000)
  }
}

function showSuccess(msg: string) {
  successMsg.value = msg
  setTimeout(() => (successMsg.value = ''), 4000)
}

// ── Group by category ──────────────────────────────────────────────────────
function groupByCategory(skills: Skill[]) {
  return skills.reduce((acc, skill) => {
    const categoryArray = acc[skill.category] ?? []
    categoryArray.push(skill)
    acc[skill.category] = categoryArray
    return acc
  }, {} as Record<string, Skill[]>)
}
</script>

<template>
  <div class="skills-view">

    <!-- Header -->
    <div class="view-header">
      <div>
        <h2 class="view-title">Skills</h2>
        <p class="view-desc">{{ skills.length }} skill terdaftar</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <PlusIcon class="btn-icon" />
        Tambah Skill
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
    <div v-if="isLoading" class="loading">Memuat data skills...</div>

    <!-- Skills grouped by category -->
    <template v-else>
      <div
        v-for="(items, category) in groupByCategory(skills)"
        :key="category"
        class="category-group"
      >
        <h3 class="category-title">{{ category }}</h3>
        <div class="skills-table">
          <div class="table-header">
            <span>Nama</span>
            <span>Level</span>
            <span>Aksi</span>
          </div>
          <div
            v-for="skill in items"
            :key="skill.id"
            class="table-row"
          >
            <span class="skill-name">{{ skill.name }}</span>
            <div class="skill-level-wrap">
              <div class="skill-bar">
                <div class="skill-fill" :style="{ width: skill.level + '%' }"></div>
              </div>
              <span class="skill-pct">{{ skill.level }}%</span>
            </div>
            <div class="row-actions">
              <button class="btn-icon-action edit" @click="openEdit(skill)" title="Edit">
                <PencilSquareIcon class="action-icon" />
              </button>
              <button class="btn-icon-action delete" @click="handleDelete(skill)" title="Hapus">
                <TrashIcon class="action-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

  </div>

  <!-- ── Modal ── -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box">

          <div class="modal-header">
            <h3 class="modal-title">{{ isEditing ? 'Edit Skill' : 'Tambah Skill' }}</h3>
            <button class="modal-close" @click="closeModal">
              <XMarkIcon class="close-icon" />
            </button>
          </div>

          <form class="modal-form" @submit.prevent="handleSave">
            <div class="form-group">
              <label class="form-label">Nama Skill</label>
              <input v-model="form.name" type="text" class="form-input" placeholder="Vue.js" required />
            </div>

            <div class="form-group">
              <label class="form-label">Kategori</label>
              <select v-model="form.category" class="form-input" required>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Level ({{ form.level }}%)</label>
              <input v-model.number="form.level" type="range" min="1" max="100" class="form-range" />
            </div>

            <div class="form-group">
              <label class="form-label">Icon Slug (opsional)</label>
              <input v-model="form.iconSlug" type="text" class="form-input" placeholder="vuedotjs" />
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
.skills-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Header */
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
  transform: translateY(-1px);
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

/* Category Group */
.category-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-title {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Table */
.skills-table {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 1rem;
  padding: 0.65rem 1rem;
  background: var(--color-bg-hover);
  border-bottom: 1px solid var(--color-border);
  font-size: 0.72rem;
  font-family: var(--font-mono);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.table-row {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  align-items: center;
  transition: background var(--transition);
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: var(--color-bg-hover);
}

.skill-name {
  font-size: 0.875rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

.skill-level-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.skill-bar {
  flex: 1;
  height: 4px;
  background: var(--color-bg-primary);
  border-radius: 999px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover));
  border-radius: 999px;
}

.skill-pct {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-accent);
  width: 2.5rem;
  text-align: right;
}

/* Row Actions */
.row-actions {
  display: flex;
  gap: 0.4rem;
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
  color: var(--color-accent);
}

.btn-icon-action.delete:hover {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.action-icon {
  width: 0.9rem;
  height: 0.9rem;
  color: var(--color-text-muted);
}

.btn-icon-action:hover .action-icon {
  color: inherit;
}

/* ── Modal ── */
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
  max-width: 460px;
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
}

.form-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-dim);
}

.form-range {
  width: 100%;
  accent-color: var(--color-accent);
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

/* Transitions */
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
</style>
