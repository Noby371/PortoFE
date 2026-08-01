<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  CloudArrowUpIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowUpTrayIcon,
  DocumentTextIcon,
  UserCircleIcon,
} from '@heroicons/vue/24/outline'
import api, { resolveAssetUrl } from '../../services/api'

interface Profile {
  id?: number
  name: string
  title: string
  bio: string
  email: string
  phone: string | null
  location: string | null
  avatarUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  resumeUrl: string | null
}

const form = ref<Profile>({
  name: '',
  title: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  avatarUrl: '',
  githubUrl: '',
  linkedinUrl: '',
  resumeUrl: '',
})

const isLoading = ref(true)
const isSaving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

// ── Avatar upload ─────────────────────────────────────────
const avatarFile = ref<File | null>(null)
const isUploadingAvatar = ref(false)
const avatarMsg = ref('')
const avatarError = ref('')

const avatarPreview = computed(() => {
  if (avatarFile.value) {
    return URL.createObjectURL(avatarFile.value)
  }
  return resolveAssetUrl(form.value.avatarUrl)
})

function handleAvatarSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  avatarFile.value = file
  avatarError.value = ''
  avatarMsg.value = 'Klik "Ganti Foto" untuk menyimpan gambar baru.'
}

async function handleAvatarUpload() {
  if (!avatarFile.value) return
  isUploadingAvatar.value = true
  avatarMsg.value = ''
  avatarError.value = ''

  try {
    const fd = new FormData()
    fd.append('avatar', avatarFile.value)
    const res = await api.post('/profile/avatar', fd)
    form.value.avatarUrl = res.data.avatarUrl
    avatarFile.value = null
    avatarMsg.value = 'Foto profil berhasil diunggah!'
  } catch (err) {
    avatarError.value =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'Gagal mengunggah foto. Pastikan file JPG/PNG/WebP maks 5MB.'
  } finally {
    isUploadingAvatar.value = false
  }
}

// ── CV / Resume upload ───────────────────────────────────
const resumeFile = ref<File | null>(null)
const isUploadingResume = ref(false)
const resumeMsg = ref('')
const resumeError = ref('')

function handleResumeSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  resumeFile.value = file
  resumeError.value = ''
  resumeMsg.value = 'Klik "Upload CV" untuk menyimpan file baru.'
}

async function handleResumeUpload() {
  if (!resumeFile.value) return
  isUploadingResume.value = true
  resumeMsg.value = ''
  resumeError.value = ''

  try {
    const fd = new FormData()
    fd.append('resume', resumeFile.value)
    const res = await api.post('/profile/resume', fd)
    form.value.resumeUrl = res.data.resumeUrl
    resumeFile.value = null
    resumeMsg.value = 'CV berhasil diunggah!'
  } catch (err) {
    resumeError.value =
      (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      'Gagal mengunggah CV. Pastikan file PDF/DOC/DOCX maks 10MB.'
  } finally {
    isUploadingResume.value = false
  }
}

onMounted(async () => {
  try {
    const res = await api.get('/profile')
    Object.assign(form.value, res.data)
  } catch {
    // Profile belum ada
  } finally {
    isLoading.value = false
  }
})

async function handleSave() {
  isSaving.value = true
  successMsg.value = ''
  errorMsg.value = ''

  try {
    await api.patch('/profile', form.value)
    successMsg.value = 'Profil berhasil disimpan!'
    setTimeout(() => (successMsg.value = ''), 4000)
  } catch {
    errorMsg.value = 'Gagal menyimpan profil. Coba lagi.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="profile-view">

    <!-- Loading -->
    <div v-if="isLoading" class="loading">Memuat data profil...</div>

    <form v-else class="profile-form" @submit.prevent="handleSave">

      <!-- Section: Foto Profil -->
      <div class="form-section avatar-section">
        <h3 class="form-section-title">Foto Profil</h3>

        <div class="avatar-row">
          <div class="avatar-preview">
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              alt="Preview foto profil"
              class="avatar-img"
            />
            <UserCircleIcon v-else class="avatar-placeholder" />
          </div>

          <div class="avatar-controls">
            <p class="avatar-hint">
              Foto akan disimpan di server. Saat diganti, foto lama otomatis dihapus.
              Format: JPG / PNG / WebP (maks 5MB).
            </p>

            <label class="avatar-file-btn">
              <ArrowUpTrayIcon class="btn-icon" />
              Pilih Foto
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="avatar-file-input"
                @change="handleAvatarSelect"
              />
            </label>

            <button
              type="button"
              class="btn-save avatar-upload-btn"
              :disabled="!avatarFile || isUploadingAvatar"
              @click="handleAvatarUpload"
            >
              <span v-if="isUploadingAvatar" class="spinner"></span>
              <template v-else>
                <CloudArrowUpIcon class="btn-icon" />
                {{ avatarFile ? 'Ganti Foto' : 'Ganti Foto' }}
              </template>
            </button>

            <p v-if="avatarMsg" class="avatar-msg avatar-msg-success">{{ avatarMsg }}</p>
            <p v-else-if="avatarError" class="avatar-msg avatar-msg-error">{{ avatarError }}</p>
          </div>
        </div>
      </div>

      <!-- Section: Resume / CV -->
      <div class="form-section resume-section">
        <h3 class="form-section-title">Resume / CV</h3>

        <div class="resume-row">
          <div class="resume-icon-wrap">
            <DocumentTextIcon class="resume-icon" />
          </div>

          <div class="avatar-controls">
            <p class="avatar-hint">
              CV akan disimpan di server dan dipakai tombol "Download CV" di halaman publik.
              Saat diganti, file lama otomatis dihapus. Format: PDF / DOC / DOCX (maks 10MB).
            </p>

            <div class="resume-actions">
              <label class="avatar-file-btn">
                <ArrowUpTrayIcon class="btn-icon" />
                Pilih File
                <input
                  type="file"
                  accept="application/pdf,.pdf,application/msword,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.docx"
                  class="avatar-file-input"
                  @change="handleResumeSelect"
                />
              </label>

              <button
                type="button"
                class="btn-save avatar-upload-btn"
                :disabled="!resumeFile || isUploadingResume"
                @click="handleResumeUpload"
              >
                <span v-if="isUploadingResume" class="spinner"></span>
                <template v-else>
                  <CloudArrowUpIcon class="btn-icon" />
                  {{ resumeFile ? 'Upload CV' : 'Upload CV' }}
                </template>
              </button>

              <a
                v-if="form.resumeUrl"
                :href="resolveAssetUrl(form.resumeUrl) ?? undefined"
                target="_blank"
                class="avatar-file-btn resume-view-btn"
              >
                Lihat CV Saat Ini
              </a>
            </div>

            <p v-if="resumeMsg" class="avatar-msg avatar-msg-success">{{ resumeMsg }}</p>
            <p v-else-if="resumeError" class="avatar-msg avatar-msg-error">{{ resumeError }}</p>
          </div>
        </div>
      </div>

      <!-- Section: Identitas -->
      <div class="form-section">
        <h3 class="form-section-title">Identitas</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nama</label>
            <input
              v-model="form.name"
              type="text"
              class="form-input"
              placeholder="FathBoy"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">Title / Jabatan</label>
            <input
              v-model="form.title"
              type="text"
              class="form-input"
              placeholder="Fullstack Developer & IoT Engineer"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="form-input"
              placeholder="email@example.com"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">Nomor HP / WhatsApp</label>
            <input
              v-model="form.phone"
              type="text"
              class="form-input"
              placeholder="+62 8xx-xxxx-xxxx"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Lokasi</label>
            <input
              v-model="form.location"
              type="text"
              class="form-input"
              placeholder="Sumenep, Madura"
            />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Bio</label>
          <textarea
            v-model="form.bio"
            class="form-input form-textarea"
            placeholder="Ceritakan tentang diri Anda..."
            rows="4"
            required
          ></textarea>
        </div>
      </div>

      <!-- Section: Links -->
      <div class="form-section">
        <h3 class="form-section-title">Links & Sosial</h3>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">GitHub URL</label>
            <input
              v-model="form.githubUrl"
              type="url"
              class="form-input"
              placeholder="https://github.com/username"
            />
          </div>
          <div class="form-group">
            <label class="form-label">LinkedIn URL</label>
            <input
              v-model="form.linkedinUrl"
              type="url"
              class="form-input"
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Avatar URL</label>
            <input
              v-model="form.avatarUrl"
              type="text"
              class="form-input"
              placeholder="/uploads/avatars/xxx.jpg atau https://..."
            />
          </div>
          <div class="form-group">
            <label class="form-label">Resume / CV URL</label>
            <input
              v-model="form.resumeUrl"
              type="text"
              class="form-input"
              placeholder="/uploads/resume/xxx.pdf atau https://..."
            />
          </div>
        </div>
      </div>

      <!-- Alert + Submit -->
      <div class="form-footer">
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

        <button type="submit" class="btn-save" :disabled="isSaving">
          <span v-if="isSaving" class="spinner"></span>
          <template v-else>
            <CloudArrowUpIcon class="btn-icon" />
            Simpan Profil
          </template>
        </button>
      </div>

    </form>
  </div>
</template>

<style scoped>
.profile-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

/* ── Avatar Upload ─────────────────────────────────────── */
.avatar-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-accent);
  box-shadow: 0 0 0 4px var(--color-accent-dim);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-hover);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-placeholder {
  width: 3rem;
  height: 3rem;
  color: var(--color-text-muted);
}

.avatar-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
  min-width: 240px;
}

.avatar-hint {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

.avatar-file-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: var(--color-bg-hover);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  color: var(--color-text-primary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition);
}

.avatar-file-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.avatar-file-input {
  display: none;
}

.avatar-upload-btn {
  padding: 0.6rem 1.25rem;
  font-size: 0.85rem;
}

.avatar-upload-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.avatar-msg {
  font-size: 0.8rem;
  margin: 0;
  font-family: var(--font-mono);
}

.avatar-msg-success {
  color: #4ade80;
}

.avatar-msg-error {
  color: #ef4444;
}

/* ── Resume / CV Upload ────────────────────────────────── */
.resume-row {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.resume-icon-wrap {
  width: 120px;
  height: 120px;
  border-radius: 14px;
  border: 2px dashed var(--color-border);
  background: var(--color-bg-hover);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resume-icon {
  width: 3rem;
  height: 3rem;
  color: var(--color-text-muted);
}

.resume-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.resume-view-btn {
  text-decoration: none;
}

/* Form */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-section {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.form-grid {
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
}

.form-input::placeholder {
  color: var(--color-text-muted);
}

.form-input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-dim);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

/* Footer — alert + button sejajar */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  flex-wrap: wrap;
}

/* Alert */
.alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  flex: 1;
  min-width: 0;
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

/* Button */
.btn-save {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 2rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-save:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
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

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-save {
    justify-content: center;
  }
}
</style>
