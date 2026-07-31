<script setup lang="ts">
import { ref } from 'vue'
import { sendContact } from '../services/api'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  CodeBracketSquareIcon,
} from '@heroicons/vue/24/outline'
import { getProfile } from '../services/api'
import { onMounted } from 'vue'

interface Profile {
  email: string
  phone: string | null
  location: string | null
  githubUrl: string | null
  linkedinUrl: string | null
}

import { computed } from 'vue'

const contactInfo = computed(() => [
  {
    icon: EnvelopeIcon,
    label: 'Email',
    value: profile.value?.email ?? 'email@example.com',
    href: `mailto:${profile.value?.email ?? 'email@example.com'}`,
  },
  {
    icon: PhoneIcon,
    label: 'WhatsApp',
    value: profile.value?.phone ?? '+62 8xx-xxxx-xxxx',
    href: profile.value?.phone
      ? `https://wa.me/${profile.value.phone.replace(/\D/g, '')}`
      : '#',
  },
  {
    icon: MapPinIcon,
    label: 'Lokasi',
    value: profile.value?.location ?? 'Sumenep, Madura',
    href: null,
  },
])

const profile = ref<Profile | null>(null)

onMounted(async () => {
  try {
    profile.value = await getProfile()
  } catch {
    // fallback
  }
})

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)
const isSuccess = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  isSubmitting.value = true
  errorMsg.value = ''

  try {
    await sendContact(form.value)
    isSuccess.value = true
    form.value = { name: '', email: '', subject: '', message: '' }
    setTimeout(() => (isSuccess.value = false), 4000)
  } catch {
    errorMsg.value = 'Gagal mengirim pesan. Coba lagi.'
  } finally {
    isSubmitting.value = false
  }
}

const socialLinks = ref([
  {
    icon: CodeBracketSquareIcon,
    label: 'GitHub',
    href: 'https://github.com/username',
  },
])

// Update social links setelah profile loaded
onMounted(async () => {
  try {
    const p = await getProfile()
    profile.value = p
    if (p.githubUrl) {
      socialLinks.value = [
        { icon: CodeBracketSquareIcon, label: 'GitHub', href: p.githubUrl },
      ]
    }
  } catch {
    // fallback
  }
})
</script>

<template>
  <section class="contact section" id="contact">
    <div class="container">

      <p class="section-label">Hubungi Saya</p>
      <h2 class="section-title">Mari <span>Berkolaborasi</span></h2>
      <div class="section-divider"></div>

      <div class="contact-inner">

        <!-- ── Left: Info ── -->
        <div class="contact-info">
          <p class="contact-intro">
            Saya terbuka untuk peluang kerja full-time, proyek freelance,
            maupun kolaborasi penelitian. Jangan ragu untuk menghubungi saya!
          </p>

          <div class="info-list">
            <a
              v-for="(item, i) in contactInfo"
              :key="i"
              :href="item.href ?? undefined"
              class="info-card"
              :class="{ 'no-link': !item.href }"
            >
              <div class="info-icon-wrap">
                <component :is="item.icon" class="info-icon" />
              </div>
              <div>
                <span class="info-label">{{ item.label }}</span>
                <span class="info-value">{{ item.value }}</span>
              </div>
            </a>
          </div>

          <!-- Social -->
          <div class="social-links">
            <a
              v-for="(s, i) in socialLinks"
              :key="i"
              :href="s.href"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn"
            >
              <component :is="s.icon" class="social-icon" />
              {{ s.label }}
            </a>
          </div>
        </div>

        <!-- ── Right: Form ── -->
        <div class="contact-form-wrap">

          <!-- Success State -->
          <div v-if="isSuccess" class="success-msg">
            <div class="success-check">
              <svg viewBox="0 0 52 52" class="success-check-svg" aria-hidden="true">
                <circle class="check-circle" cx="26" cy="26" r="24" fill="none" />
                <path class="check-mark" fill="none" d="M14 27l8 8 16-16" />
              </svg>
            </div>
            <div>
              <p class="success-title">Pesan terkirim!</p>
              <p class="success-desc">Terima kasih sudah menghubungi. Saya akan membalas secepatnya.</p>
            </div>
          </div>

          <form v-else class="contact-form" @submit.prevent="handleSubmit">

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Nama</label>
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

            <div class="form-group">
              <label class="form-label">Subject</label>
              <input
                v-model="form.subject"
                type="text"
                class="form-input"
                placeholder="Diskusi proyek / Hire / Kolaborasi"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label">Pesan</label>
              <textarea
                v-model="form.message"
                class="form-input form-textarea"
                placeholder="Ceritakan kebutuhan Anda..."
                rows="5"
                required
              ></textarea>
            </div>

            <button type="submit" class="btn-submit" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner"></span>
              <template v-else>
                <PaperAirplaneIcon class="btn-icon" />
                Kirim Pesan
              </template>
            </button>

          </form>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  background: var(--color-bg-secondary);
  position: relative;
  overflow: hidden;
}

.contact::before {
  content: '';
  position: absolute;
  bottom: -20%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(108, 99, 255, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.contact-inner {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 4rem;
  align-items: start;
}

/* ── Info ── */
.contact-intro {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: all var(--transition);
  color: inherit;
  text-decoration: none;
}

.info-card:not(.no-link):hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-hover);
  transform: translateX(4px);
}

.no-link {
  cursor: default;
  text-decoration: none;
}

.info-icon-wrap {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 8px;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--color-accent);
}

.info-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.15rem;
}

.info-value {
  display: block;
  font-size: 0.875rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

/* Social */
.social-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  transition: all var(--transition);
  text-decoration: none;
}

.social-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-dim);
}

.social-icon {
  width: 1rem;
  height: 1rem;
}

/* ── Form ── */
.contact-form-wrap {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 2rem;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.form-input {
  background: var(--color-bg-hover);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--color-text-primary);
  font-size: 0.9rem;
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
  min-height: 120px;
}

/* Submit Button */
.btn-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding: 0.85rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition);
}

.btn-submit:hover:not(:disabled) {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
}

/* Spinner */
.spinner {
  width: 1.1rem;
  height: 1.1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Success */
.success-msg {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 2.5rem 2rem;
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.07), rgba(108, 99, 255, 0.05));
  border: 1px solid rgba(74, 222, 128, 0.25);
  border-radius: 16px;
  animation: successIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.success-check {
  position: relative;
  width: 64px;
  height: 64px;
  flex-shrink: 0;
}

.success-check::before {
  content: '';
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(74, 222, 128, 0.4), transparent 70%);
  filter: blur(10px);
  animation: successPulse 2.2s ease-out infinite;
}

.success-check-svg {
  position: relative;
  z-index: 1;
  width: 64px;
  height: 64px;
}

.check-circle {
  stroke: #4ade80;
  stroke-width: 3;
  stroke-linecap: round;
  fill: none;
  stroke-dasharray: 151;
  stroke-dashoffset: 151;
  transform: rotate(-90deg);
  transform-origin: center;
  animation: drawStroke 0.6s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

.check-mark {
  stroke: #4ade80;
  stroke-width: 4;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: drawStroke 0.4s cubic-bezier(0.65, 0, 0.35, 1) 0.55s forwards;
}

@keyframes drawStroke {
  to { stroke-dashoffset: 0; }
}

@keyframes successPulse {
  0%   { transform: scale(0.7); opacity: 0.9; }
  100% { transform: scale(1.35); opacity: 0; }
}

@keyframes successIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.success-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #4ade80;
  margin-bottom: 0.3rem;
}

.success-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

@media (prefers-reduced-motion: reduce) {
  .success-msg,
  .check-circle,
  .check-mark,
  .success-check::before {
    animation: none !important;
  }
  .check-circle,
  .check-mark {
    stroke-dashoffset: 0;
  }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .contact-inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
