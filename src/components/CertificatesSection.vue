<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCertificates, resolveAssetUrl } from '../services/api'
import { useScrollReveal } from '../composables/useScrollReveal'
import { TrophyIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'

useScrollReveal()

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

onMounted(async () => {
  try {
    certificates.value = await getCertificates()
  } catch {
    certificates.value = []
  } finally {
    isLoading.value = false
  }
})

function formatDate(date: string | null): string {
  if (!date) return '—'
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<template>
  <section v-if="!isLoading && certificates.length > 0" class="certificates section" id="certificates">
    <div class="container">

      <p class="section-label reveal">Pengakuan</p>
      <h2 class="section-title reveal reveal-delay-1">Sertifikat <span>Saya</span></h2>
      <div class="section-divider reveal reveal-delay-2"></div>

      <div class="cert-grid">
        <div
          v-for="(cert, i) in certificates"
          :key="cert.id"
          class="cert-card reveal"
          :style="{ transitionDelay: `${(i % 3) * 0.1}s` }"
        >
          <div class="cert-image">
            <img
              v-if="resolveAssetUrl(cert.imageUrl)"
              :src="resolveAssetUrl(cert.imageUrl)!"
              :alt="cert.title"
              loading="lazy"
            />
            <div v-else class="cert-image-placeholder">
              <TrophyIcon class="trophy-icon" />
            </div>
          </div>

          <div class="cert-body">
            <h3 class="cert-title">{{ cert.title }}</h3>
            <p class="cert-issuer">{{ cert.issuer }}</p>

            <div class="cert-dates">
              <span class="cert-date">{{ formatDate(cert.issuedAt) }}</span>
              <span v-if="cert.expiredAt" class="cert-date expired">
                Kedaluwarsa: {{ formatDate(cert.expiredAt) }}
              </span>
              <span v-else class="cert-date no-expire">Tidak kedaluwarsa</span>
            </div>

            <a
              v-if="cert.credentialUrl"
              :href="cert.credentialUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="cert-link"
            >
              Lihat Kredensial
              <ArrowTopRightOnSquareIcon class="cert-link-icon" />
            </a>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.certificates {
  background: var(--color-bg-primary);
  position: relative;
  overflow: hidden;
}

.certificates::before {
  content: '';
  position: absolute;
  top: -10%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(108, 99, 255, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

/* ── Grid ── */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

/* ── Card ── */
.cert-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  transition: all var(--transition);
}

.cert-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(108, 99, 255, 0.1);
}

.cert-image {
  width: 100%;
  height: 150px;
  border-radius: 12px;
  background: var(--color-bg-hover);
  border: 1px solid var(--color-border);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cert-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.cert-card:hover .cert-image img {
  transform: scale(1.05);
}

.cert-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.trophy-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-accent);
  opacity: 0.6;
}

.cert-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.cert-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.cert-issuer {
  font-size: 0.85rem;
  color: var(--color-accent);
  font-weight: 500;
}

.cert-dates {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  margin-top: 0.35rem;
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
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  color: var(--color-accent);
  margin-top: 0.5rem;
  width: fit-content;
}

.cert-link:hover {
  color: var(--color-accent-hover);
}

.cert-link-icon {
  width: 0.85rem;
  height: 0.85rem;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .cert-grid {
    grid-template-columns: 1fr;
  }
}
</style>
