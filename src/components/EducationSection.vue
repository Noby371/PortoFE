<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getEducation } from '../services/api'
import { useScrollReveal } from '../composables/useScrollReveal'
import {
  AcademicCapIcon,
  CalendarDaysIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/vue/24/outline'

useScrollReveal()

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

onMounted(async () => {
  try {
    educations.value = await getEducation()
  } catch {
    educations.value = []
  } finally {
    isLoading.value = false
  }
})

function yearRange(edu: Education): string {
  if (edu.isCurrent || !edu.endYear) return `${edu.startYear} — Sekarang`
  return `${edu.startYear} — ${edu.endYear}`
}
</script>

<template>
  <section class="education section" id="education">
    <div class="container">

      <p class="section-label reveal">Akademik</p>
      <h2 class="section-title reveal reveal-delay-1">Pendidikan <span>Saya</span></h2>
      <div class="section-divider reveal reveal-delay-2"></div>

      <div v-if="isLoading" class="loading">Memuat data pendidikan...</div>

      <div v-else class="timeline">
        <div
          v-for="(edu, i) in educations"
          :key="edu.id"
          class="timeline-item reveal"
          :style="{ transitionDelay: `${i * 0.1}s` }"
        >
          <!-- Line & Dot -->
          <div class="timeline-line">
            <div class="timeline-dot">
              <AcademicCapIcon class="timeline-dot-icon" />
            </div>
            <div v-if="i < educations.length - 1" class="timeline-connector"></div>
          </div>

          <!-- Content -->
          <div class="timeline-content">
            <!-- Header -->
            <div class="edu-header">
              <div class="edu-header-left">
                <div class="edu-icon-wrap">
                  <AcademicCapIcon class="edu-icon" />
                </div>
                <div>
                  <h3 class="edu-degree">{{ edu.degree }}</h3>
                  <p class="edu-institution">{{ edu.institution }}</p>
                </div>
              </div>

              <div class="edu-header-right">
                <span class="edu-field">{{ edu.field }}</span>
                <span v-if="edu.isCurrent" class="edu-current">● Saat ini</span>
              </div>
            </div>

            <!-- Meta -->
            <div class="edu-meta">
              <span class="meta-item">
                <CalendarDaysIcon class="meta-icon" />
                {{ yearRange(edu) }}
              </span>
              <span v-if="edu.gpa" class="meta-item">
                <ClipboardDocumentCheckIcon class="meta-icon" />
                IPK: {{ edu.gpa.toFixed(2) }}
              </span>
            </div>

            <!-- Description -->
            <p v-if="edu.description" class="edu-desc">{{ edu.description }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.education {
  background: var(--color-bg-secondary);
  position: relative;
  overflow: hidden;
}

.education::before {
  content: '';
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(108, 99, 255, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.loading {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  text-align: center;
  padding: 3rem;
}

/* ── Timeline ── */
.timeline {
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-item {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 1.5rem;
}

.timeline-line {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 0.35rem;
}

.timeline-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  flex-shrink: 0;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 0 0 4px rgba(108, 99, 255, 0.12);
}

.timeline-dot-icon {
  width: 0.9rem;
  height: 0.9rem;
  color: var(--color-accent);
}

.timeline-connector {
  width: 2px;
  flex: 1;
  background: var(--color-border);
  margin: 0.5rem 0;
  min-height: 2rem;
}

/* Content */
.timeline-content {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 1.5rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  margin-bottom: 1.5rem;
  transition: all var(--transition);
}

.timeline-content:hover {
  border-color: var(--color-border-hover);
  transform: translateX(4px);
  box-shadow: 0 4px 20px rgba(108, 99, 255, 0.08);
}

/* Header */
.edu-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.edu-header-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.edu-icon-wrap {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 10px;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.edu-icon {
  width: 1.2rem;
  height: 1.2rem;
  color: var(--color-accent);
}

.edu-degree {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.15rem;
}

.edu-institution {
  font-size: 0.875rem;
  color: var(--color-accent);
  font-weight: 500;
}

.edu-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.edu-field {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-bg-hover);
}

.edu-current {
  font-size: 0.72rem;
  color: #4ade80;
  font-family: var(--font-mono);
}

/* Meta */
.edu-meta {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.meta-icon {
  width: 0.9rem;
  height: 0.9rem;
}

/* Description */
.edu-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
  padding-top: 0.5rem;
  border-top: 1px solid var(--color-border);
}

/* ── Responsive ── */
@media (max-width: 600px) {
  .timeline-item {
    grid-template-columns: 24px 1fr;
    gap: 1rem;
  }

  .timeline-dot {
    width: 24px;
    height: 24px;
  }

  .timeline-dot-icon {
    width: 0.75rem;
    height: 0.75rem;
  }

  .edu-header {
    flex-direction: column;
  }

  .edu-header-right {
    align-items: flex-start;
  }
}
</style>
