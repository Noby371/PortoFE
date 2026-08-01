<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  CloudArrowUpIcon,
  PhotoIcon,
} from '@heroicons/vue/24/outline'
import api, { resolveAssetUrl } from '../../services/api'

interface Certificate {
  id: number
  title: string
  issuer: string
  issuedAt: string
  expiredAt: string | null
  credentialUrl: string | null
  imageUrl: string | null
}

const certificates = ref<Certificate[]>([])
const isLoading = ref(true)
const successMsg = ref('')
const errorMsg = ref('')
const isModalOpen = ref(false)
const isEditing = ref(false)
const isSaving = ref(false)
const brokenImages = ref<Set<number>>(new Set())

function markBrokenImage(id: number) {
  brokenImages.value.add(id)
}

// ── Upload gambar sertifikat ────────────────────────────
const certImageFile = ref<File | null>(null)
const isUploadingImage = ref(false)
const imageMsg = ref('')
const imageError = ref('')

const certImagePreview = computed(() => {
  if (certImageFile.value) {
    return URL.createObjectURL(certImageFile.value)
  }
  return resolveAssetUrl(form.value.imageUrl)
})

const emptyForm = {
  id: 0,
  title: '',
  issuer: '',
  issuedAt: '',
  expiredAt: '',
  credentialUrl: '',
  imageUrl: '',
}

const form = ref({ ...emptyForm })

onMounted(fetchCertificates)

async function fetchCertificates() {
  isLoading.value = true
  try {
    const res = await api.get('/certificates')
    certificates.value = res.data
  } catch {
    errorMsg.value = 'Gagal memuat data sertifikat.'
  } finally {
    isLoading.value = false
  }
}

function openCreate() {
  isEditing.value = false
  form.value = { ...emptyForm }
  isModalOpen.value = true
}

function openEdit(cert: Certificate) {
  isEditing.value = true
  form.value = {
    ...cert,
    issuedAt:      cert.issuedAt ? cert.issuedAt.slice(0, 10) : '',
    expiredAt:     cert.expiredAt ? cert.expiredAt.slice(0, 10) : '',
    credentialUrl: cert.credentialUrl ?? '',
    imageUrl:      cert.imageUrl ?? '',
  }
  isModalOpen.value = true
}

function closeModal() {
  isModalOpen.value = false
}

function handleImageSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  certImageFile.value = file
  imageError.value = ''
  imageMsg.value = 'Klik "Ganti Gambar" untuk menyimpan ke server.'
}

async function handleImageUpload() {
  if (!certImageFile.value) return
  isUploadingImage.value = true
  imageMsg.value = ''
  imageError.value = ''

  try {
    const fd = new FormData()
    fd.append('image', certImageFile.value)
    const res = await api.post('/uploads/certificate', fd)
    form.value.imageUrl = res.data.url
    certImageFile.value = null
    imageMsg.value = 'Gambar berhasil diunggah!'
  } catch (err) {
    imageError.value =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'Gagal mengunggah gambar. Pastikan file JPG/PNG/WebP maks 5MB.'
  } finally {
    isUploadingImage.value = false
  }
}

async function handleSave() {
  isSaving.value = true
  try {
    const payload = {
      ...form.value,
      issuedAt:      new Date(form.value.issuedAt).toISOString(),
      expiredAt:     form.value.expiredAt ? new Date(form.value.expiredAt).toISOString() : null,
      credentialUrl: form.value.credentialUrl || null,
      imageUrl:      form.value.imageUrl || null,
    }

    if (isEditing.value) {
      await api.patch(`/certificates/${form.value.id}`, payload)
      showSuccess('Sertifikat berhasil diperbarui!')
    } else {
      await api.post('/certificates', payload)
      showSuccess('Sertifikat berhasil ditambahkan!')
    }
    closeModal()
    await fetchCertificates()
  } catch {
    errorMsg.value = 'Gagal menyimpan sertifikat.'
    setTimeout(() => (errorMsg.value = ''), 3000)
  } finally {
    isSaving.value = false
  }
}

async function handleDelete(cert: Certificate) {
  if (!confirm(`Hapus sertifikat "${cert.title}"?`)) return
  try {
    await api.delete(`/certificates/${cert.id}`)
    showSuccess('Sertifikat berhasil dihapus!')
    await fetchCertificates()
  } catch {
    errorMsg.value = 'Gagal menghapus sertifikat.'
    setTimeout(() => (errorMsg.value = ''), 3000)
  }
}

function showSuccess(msg: string) {
  successMsg.value = msg
  setTimeout(() => (successMsg.value = ''), 4000)
}

function formatDate(date: string | null) {
  if (!date) return '—'
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}
</script>

<template>
  <div class="certificates-view">

    <!-- Header -->
    <div class="view-header">
      <div>
        <h2 class="view-title">Certificates</h2>
        <p class="view-desc">{{ certificates.length }} sertifikat terdaftar</p>
      </div>
      <button class="btn-primary" @click="openCreate">
        <PlusIcon class="btn-icon" />
        Tambah Sertifikat
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
    <div v-if="isLoading" class="loading">Memuat data sertifikat...</div>

    <!-- List -->
    <div v-else class="cert-grid">
      <div
        v-for="cert in certificates"
        :key="cert.id"
        class="cert-card"
      >
        <!-- Image -->
        <div class="cert-image">
          <img
            v-if="cert.imageUrl && !brokenImages.has(cert.id)"
            :src="resolveAssetUrl(cert.imageUrl) ?? undefined"
            :alt="cert.title"
            loading="lazy"
            @error="markBrokenImage(cert.id)"
          />
          <div v-else class="cert-image-placeholder">🏆</div>
        </div>

        <!-- Body -->
        <div class="cert-body">
          <h3 class="cert-title">{{ cert.title }}</h3>
          <p class="cert-issuer">{{ cert.issuer }}</p>
          <div class="cert-dates">
            <span class="cert-date">Diterbitkan: {{ formatDate(cert.issuedAt) }}</span>
            <span v-if="cert.expiredAt" class="cert-date expired">
              Kedaluwarsa: {{ formatDate(cert.expiredAt) }}
            </span>
            <span v-else class="cert-date no-expire">Tidak kedaluwarsa</span>
          </div>

          <a
            v-if="cert.credentialUrl"
            :href="cert.credentialUrl"
            target="_blank"
            class="cert-link"
          >
            Lihat Kredensial ↗
          </a>
        </div>

        <!-- Actions -->
        <div class="cert-actions">
          <button class="btn-icon-action edit" @click="openEdit(cert)">
            <PencilSquareIcon class="action-icon" />
          </button>
          <button class="btn-icon-action delete" @click="handleDelete(cert)">
            <TrashIcon class="action-icon" />
          </button>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="certificates.length === 0" class="empty-state">
        <p>Belum ada sertifikat. Klik "Tambah Sertifikat" untuk memulai.</p>
      </div>
    </div>

  </div>

  <!-- Modal -->
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-backdrop" @click.self="closeModal">
        <div class="modal-box">

          <div class="modal-header">
            <h3 class="modal-title">{{ isEditing ? 'Edit Sertifikat' : 'Tambah Sertifikat' }}</h3>
            <button class="modal-close" @click="closeModal">
              <XMarkIcon class="close-icon" />
            </button>
          </div>

          <form class="modal-form" @submit.prevent="handleSave">

            <div class="form-group">
              <label class="form-label">Judul Sertifikat</label>
              <input v-model="form.title" type="text" class="form-input" placeholder="IoT Fundamentals" required />
            </div>

            <div class="form-group">
              <label class="form-label">Penerbit</label>
              <input v-model="form.issuer" type="text" class="form-input" placeholder="Cisco Networking Academy" required />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Tanggal Terbit</label>
                <input v-model="form.issuedAt" type="date" class="form-input" required />
              </div>
              <div class="form-group">
                <label class="form-label">Tanggal Kedaluwarsa</label>
                <input v-model="form.expiredAt" type="date" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">URL Kredensial</label>
              <input v-model="form.credentialUrl" type="url" class="form-input" placeholder="https://..." />
            </div>

            <div class="form-group">
              <label class="form-label">Gambar Sertifikat</label>

              <div class="cert-image-upload">
                <div class="cert-upload-preview">
                  <img
                    v-if="certImagePreview"
                    :src="certImagePreview"
                    alt="Preview sertifikat"
                    class="cert-upload-img"
                  />
                  <PhotoIcon v-else class="cert-upload-placeholder" />
                </div>

                <div class="cert-upload-controls">
                  <label class="cert-upload-btn">
                    <ArrowUpTrayIcon class="btn-icon" />
                    Pilih Gambar
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      class="cert-upload-input"
                      @change="handleImageSelect"
                    />
                  </label>

                  <button
                    type="button"
                    class="btn-submit cert-upload-btn"
                    :disabled="!certImageFile || isUploadingImage"
                    @click="handleImageUpload"
                  >
                    <span v-if="isUploadingImage" class="spinner"></span>
                    <template v-else>
                      <CloudArrowUpIcon class="btn-icon" />
                      {{ certImageFile ? 'Ganti Gambar' : 'Ganti Gambar' }}
                    </template>
                  </button>

                  <p v-if="imageMsg" class="cert-upload-msg success">{{ imageMsg }}</p>
                  <p v-else-if="imageError" class="cert-upload-msg error">{{ imageError }}</p>
                </div>
              </div>
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
.certificates-view {
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

/* Grid */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Card */
.cert-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: all var(--transition);
  position: relative;
}

.cert-card:hover {
  border-color: var(--color-border-hover);
}

.cert-image {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 8px;
  background: var(--color-bg-hover);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  overflow: hidden;
}

.cert-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cert-image-placeholder {
  font-size: 1.5rem;
}

.cert-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  min-width: 0;
}

.cert-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.cert-issuer {
  font-size: 0.8rem;
  color: var(--color-accent);
  font-weight: 500;
}

.cert-dates {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.cert-date {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.cert-date.expired {
  color: #f59e0b;
}

.cert-date.no-expire {
  color: #4ade80;
}

.cert-link {
  font-size: 0.75rem;
  color: var(--color-accent);
  margin-top: 0.25rem;
  width: fit-content;
}

.cert-link:hover {
  color: var(--color-accent-hover);
}

.cert-actions {
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
  grid-column: 1 / -1;
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
  max-width: 500px;
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

/* Upload gambar sertifikat */
.cert-image-upload {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  flex-wrap: wrap;
}

.cert-upload-preview {
  width: 110px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-bg-hover);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cert-upload-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cert-upload-placeholder {
  width: 2rem;
  height: 2rem;
  color: var(--color-text-muted);
}

.cert-upload-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.6rem;
  flex: 1;
  min-width: 200px;
}

.cert-upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  background: var(--color-bg-hover);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
  justify-content: center;
}

.cert-upload-btn:hover:not(:disabled) {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.cert-upload-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cert-upload-btn.btn-submit {
  color: #fff;
  background: var(--color-accent);
  border: none;
  font-weight: 600;
}

.cert-upload-input {
  display: none;
}

.cert-upload-msg {
  font-size: 0.75rem;
  margin: 0;
  font-family: var(--font-mono);
}

.cert-upload-msg.success {
  color: #4ade80;
}

.cert-upload-msg.error {
  color: #ef4444;
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

@media (max-width: 768px) {
  .cert-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
