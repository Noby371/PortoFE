<script setup lang="ts">
import { ref } from 'vue'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PaperAirplaneIcon,
  CodeBracketSquareIcon,
} from '@heroicons/vue/24/outline'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)
const isSuccess = ref(false)

async function handleSubmit() {
  isSubmitting.value = true
  // Simulasi kirim — nanti diganti fetch ke backend
  await new Promise((r) => setTimeout(r, 1500))
  isSubmitting.value = false
  isSuccess.value = true
  form.value = { name: '', email: '', subject: '', message: '' }
  setTimeout(() => (isSuccess.value = false), 4000)
}

const contactInfo = [
  {
    icon: EnvelopeIcon,
    label: 'Email',
    value: 'email@example.com',
    href: 'mailto:email@example.com',
  },
  {
    icon: PhoneIcon,
    label: 'WhatsApp',
    value: '+62 8xx-xxxx-xxxx',
    href: 'https://wa.me/628xxxxxxxxxx',
  },
  {
    icon: MapPinIcon,
    label: 'Lokasi',
    value: 'Sumenep, Madura',
    href: null,
  },
]

const socialLinks = [
  {
    icon: CodeBracketSquareIcon,
    label: 'GitHub',
    href: 'https://github.com/username',
  },
]
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
            <span class="success-icon">✅</span>
            <div>
              <p class="success-title">Pesan terkirim!</p>
              <p class="success-desc">Saya akan membalas secepatnya.</p>
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
  gap: 1rem;
  padding: 2rem;
  background: rgba(74, 222, 128, 0.08);
  border: 1px solid rgba(74, 222, 128, 0.3);
  border-radius: 12px;
}

.success-icon {
  font-size: 2rem;
}

.success-title {
  font-size: 1rem;
  font-weight: 600;
  color: #4ade80;
  margin-bottom: 0.25rem;
}

.success-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
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
