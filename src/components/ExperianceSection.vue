<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getExperience } from '../services/api'
import { useScrollReveal } from '../composables/useScrollReveal'
import {
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarDaysIcon,
} from '@heroicons/vue/24/outline'

useScrollReveal()

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

const typeConfig: Record<string, { label: string; color: string }> = {
  WORK:         { label: 'Pekerjaan',  color: '#6c63ff' },
  INTERNSHIP:   { label: 'Magang',     color: '#f59e0b' },
  ORGANIZATION: { label: 'Organisasi', color: '#10b981' },
  FREELANCE:    { label: 'Freelance',  color: '#3b82f6' },
}

onMounted(async () => {
  try {
    experiences.value = await getExperience()
  } catch {
    experiences.value = []
  } finally {
    isLoading.value = false
  }
})

function formatDate(date: string | null | undefined): string {
  if (!date) return 'Sekarang'
  const parts = date.split('-')
  const year = parts[0] ?? ''
  const month = parts[1]
  if (!month) return year
  const months = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
  return `${months[parseInt(month) - 1]} ${year}`
}
</script>

<template>
  <section class="experience section" id="experience">
    <div class="container">

      <p class="section-label reveal">Perjalanan</p>
      <h2 class="section-title reveal reveal-delay-1">Pengalaman <span>Saya</span></h2>
      <div class="section-divider reveal reveal-delay-2"></div>

      <div v-if="isLoading" class="loading">Memuat data pengalaman...</div>

      <div v-else class="timeline">
        <div
          v-for="(exp, i) in experiences"
          :key="exp.id"
          class="timeline-item reveal"
          :style="{ transitionDelay: `${i * 0.1}s` }"
        >
          <!-- Line & Dot -->
          <div class="timeline-line">
            <div
              class="timeline-dot"
              :style="{ background: typeConfig[exp.type]?.color ?? '#6c63ff' }"
            ></div>
            <div v-if="i < experiences.length - 1" class="timeline-connector"></div>
          </div>

          <!-- Content -->
          <div class="timeline-content">

            <!-- Header -->
            <div class="exp-header">
              <div class="exp-header-left">
                <div class="exp-icon-wrap">
                  <component
                    :is="exp.type === 'INTERNSHIP' || exp.type === 'WORK' ? BriefcaseIcon : AcademicCapIcon"
                    class="exp-icon"
                  />
                </div>
                <div>
                  <h3 class="exp-role">{{ exp.role }}</h3>
                  <p class="exp-company">{{ exp.company }}</p>
                </div>
              </div>

              <div class="exp-header-right">
                <span
                  class="exp-type-badge"
                  :style="{
                    color:        typeConfig[exp.type]?.color ?? '#6c63ff',
                    borderColor: (typeConfig[exp.type]?.color ?? '#6c63ff') + '44',
                    background:  (typeConfig[exp.type]?.color ?? '#6c63ff') + '11',
                  }"
                >
                  {{ typeConfig[exp.type]?.label ?? exp.type }}
                </span>
                <span v-if="exp.isCurrent" class="exp-current">● Saat ini</span>
              </div>
            </div>

            <!-- Meta -->
            <div class="exp-meta">
              <span class="meta-item">
                <CalendarDaysIcon class="meta-icon" />
                {{ formatDate(exp.startDate) }} —
                {{ exp.isCurrent ? 'Sekarang' : formatDate(exp.endDate) }}
              </span>
              <span v-if="exp.location" class="meta-item">
                <MapPinIcon class="meta-icon" />
                {{ exp.location }}
              </span>
            </div>

            <!-- Description -->
            <p class="exp-desc">{{ exp.description }}</p>

          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
.experience {
  background: var(--color-bg-primary);
  position: relative;
  overflow: hidden;
}

.experience::before {
  content: '';
  position: absolute;
  top: -10%;
  right: -10%;
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
  width: 14px;
  height: 14px;
  border-radius: 50%;
  flex-shrink: 0;
  box-shadow: 0 0 0 4px rgba(108, 99, 255, 0.15);
  position: relative;
  z-index: 1;
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
.exp-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.exp-header-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.exp-icon-wrap {
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

.exp-icon {
  width: 1.2rem;
  height: 1.2rem;
  color: var(--color-accent);
}

.exp-role {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.15rem;
}

.exp-company {
  font-size: 0.875rem;
  color: var(--color-accent);
  font-weight: 500;
}

.exp-header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.exp-type-badge {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.7rem;
  border-radius: 999px;
  border: 1px solid;
}

.exp-current {
  font-size: 0.72rem;
  color: #4ade80;
  font-family: var(--font-mono);
}

/* Meta */
.exp-meta {
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
.exp-desc {
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

  .exp-header {
    flex-direction: column;
  }

  .exp-header-right {
    align-items: flex-start;
  }
}
</style>
