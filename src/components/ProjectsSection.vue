<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getProjects } from '../services/api'
import { useScrollReveal } from '../composables/useScrollReveal'
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

useScrollReveal()

type ProjectType = 'ALL' | 'THESIS' | 'STARTUP' | 'ACADEMIC' | 'FREELANCE' | 'PERSONAL'

interface Project {
  id: number
  title: string
  slug: string
  description: string
  type: string
  status: string
  techStack: string[]
  repoUrl: string | null
  demoUrl: string | null
  featured: boolean
  startDate: string
  endDate: string | null
}

// ─── STATE ──────────────────────────────────────────────
const allProjects = ref<Project[]>([])
const isLoading = ref(true)
const isError = ref(false)
const errorMessage = ref('')
const activeFilter = ref<ProjectType>('ALL')
const isRetrying = ref(false)

// ─── CONSTANTS ──────────────────────────────────────────
const filters: { label: string; value: ProjectType }[] = [
  { label: 'Semua', value: 'ALL' },
  { label: 'Thesis', value: 'THESIS' },
  { label: 'Startup', value: 'STARTUP' },
  { label: 'Akademik', value: 'ACADEMIC' },
  { label: 'Freelance', value: 'FREELANCE' },
  { label: 'Personal', value: 'PERSONAL' },
]

const statusLabel: Record<string, string> = {
  IN_PROGRESS: 'On Going',
  COMPLETED: 'Selesai',
  ARCHIVED: 'Arsip',
}

const typeLabel: Record<string, string> = {
  THESIS: 'Thesis',
  STARTUP: 'Startup',
  ACADEMIC: 'Akademik',
  FREELANCE: 'Freelance',
  PERSONAL: 'Personal',
}

// ─── HELPER FUNCTIONS ──────────────────────────────────

// Retry mechanism dengan exponential backoff
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      console.warn(`Attempt ${attempt + 1}/${maxRetries} failed:`, error)

      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt) // exponential: 1s, 2s, 4s
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError!
}

// Validasi response API - struktur: { data: [], meta: {} }
function validateResponse(response: unknown): Project[] {
  console.log('📡 API Response:', response)
  const res = response as Record<string, unknown>

  // Response dari getProjects: { data: [], meta: {} }
  if (res?.data && Array.isArray(res.data)) {
    return res.data as Project[]
  }

  // Fallback jika array langsung
  if (Array.isArray(response)) {
    return response as Project[]
  }

  console.error('Unexpected response structure:', response)
  return []
}

// Fetch data utama
async function fetchProjects(showLoading = true) {
  if (showLoading) {
    isLoading.value = true
    isError.value = false
    errorMessage.value = ''
  }

  try {
    const response = await withRetry(
      () => getProjects({ limit: 100 }),
      3,
      1000
    )

    const projects = validateResponse(response)
    allProjects.value = projects
    isError.value = false
    errorMessage.value = ''

  } catch (error) {
    console.error('❌ Failed to fetch projects:', error)
    allProjects.value = []
    isError.value = true
    errorMessage.value = error instanceof Error
      ? error.message
      : 'Gagal memuat data project. Periksa koneksi internet Anda.'
  } finally {
    if (showLoading) {
      isLoading.value = false
    }
    isRetrying.value = false
  }
}

// Handle retry manual
async function handleRetry() {
  if (isRetrying.value) return
  isRetrying.value = true
  await fetchProjects(true)
}

// ─── LIFECYCLE ──────────────────────────────────────────

onMounted(async () => {
  await fetchProjects(true)
})

// ─── COMPUTED ──────────────────────────────────────────

const filtered = computed(() => {
  if (activeFilter.value === 'ALL') {
    return allProjects.value
  }
  return allProjects.value.filter((p) => p.type === activeFilter.value)
})

// ─── FORMATTERS ────────────────────────────────────────

function formatDate(date: string) {
  if (!date) return ''
  try {
    return date.slice(0, 7) // YYYY-MM
  } catch {
    return date
  }
}

// ─── EXPOSE FOR DEBUG ──────────────────────────────────

// Bisa diakses dari console untuk debugging
if (import.meta.env.DEV) {
  ;((window as unknown) as Record<string, unknown>).__projects = {
    allProjects,
    filtered,
    refetch: fetchProjects,
  }
}
</script>

<template>
  <section class="projects section" id="projects">
    <div class="container">
      <p class="section-label reveal">Portofolio</p>
      <h2 class="section-title reveal reveal-delay-1">Project <span>Saya</span></h2>
      <div class="section-divider reveal reveal-delay-2"></div>

      <!-- Filter Tabs -->
      <div class="filter-tabs reveal reveal-delay-3">
        <button
          v-for="f in filters"
          :key="f.value"
          class="filter-btn"
          :class="{ active: activeFilter === f.value }"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
          <span class="filter-count">
            ({{ f.value === 'ALL' ? allProjects.length : allProjects.filter(p => p.type === f.value).length }})
          </span>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Memuat projects...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="isError" class="error-state">
        <ExclamationTriangleIcon class="error-icon" />
        <div class="error-content">
          <p class="error-message">{{ errorMessage }}</p>
          <button
            class="retry-btn"
            @click="handleRetry"
            :disabled="isRetrying"
          >
            <ArrowPathIcon class="btn-icon" :class="{ spinning: isRetrying }" />
            {{ isRetrying ? 'Mencoba...' : 'Coba Lagi' }}
          </button>
        </div>
      </div>

      <!-- Projects Grid -->
      <div v-else class="projects-grid">
        <div
          v-for="(project, index) in filtered"
          :key="project.id"
          class="project-card reveal"
          :style="{ transitionDelay: `${(index % 4) * 0.1}s` }"
          :class="{ featured: project.featured }"
        >
          <!-- Featured Badge -->
          <div v-if="project.featured" class="featured-badge">⭐ Featured</div>

          <!-- Card Top -->
          <div class="card-top">
            <div class="card-meta">
              <span class="type-badge">{{ typeLabel[project.type] || project.type }}</span>
              <span class="status-badge" :class="project.status.toLowerCase()">
                <component
                  :is="project.status === 'IN_PROGRESS' ? ClockIcon : CheckCircleIcon"
                  class="status-icon"
                />
                {{ statusLabel[project.status] || project.status }}
              </span>
            </div>
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-desc">{{ project.description }}</p>
          </div>

          <!-- Tech Stack -->
          <div class="tech-stack">
            <span v-for="(tech, i) in project.techStack.slice(0, 5)" :key="i" class="tech-tag">
              {{ tech }}
            </span>
            <span v-if="project.techStack.length > 5" class="tech-more">
              +{{ project.techStack.length - 5 }}
            </span>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <span class="project-date">
              {{ formatDate(project.startDate) }}
              {{ project.endDate ? '→ ' + formatDate(project.endDate) : '→ Sekarang' }}
            </span>
            <div class="card-links">
              <a
                v-if="project.repoUrl"
                :href="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="card-link"
                title="Source Code"
              >
                <CodeBracketIcon class="link-icon" />
              </a>
              <a
                v-if="project.demoUrl"
                :href="project.demoUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="card-link"
                title="Live Demo"
              >
                <ArrowTopRightOnSquareIcon class="link-icon" />
              </a>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filtered.length === 0 && !isLoading && !isError" class="empty-state">
          <XCircleIcon class="empty-icon" />
          <p>Tidak ada project dengan filter ini.</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects {
  background: var(--color-bg-secondary);
}

/* ─── Loading State ──────────────────────────────────── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
  color: var(--color-text-muted);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── Error State ────────────────────────────────────── */
.error-state {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  margin-bottom: 2rem;
}

.error-icon {
  width: 2rem;
  height: 2rem;
  color: #ef4444;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  margin: 0;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1.25rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  white-space: nowrap;
}

.retry-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 99, 255, 0.3);
}

.retry-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.btn-icon.spinning {
  animation: spin 0.8s linear infinite;
}

/* ─── Filter Tabs ────────────────────────────────────── */
.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.filter-btn {
  padding: 0.45rem 1.1rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition);
}

.filter-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-text-primary);
}

.filter-btn.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
  font-weight: 600;
}

.filter-count {
  font-size: 0.7rem;
  opacity: 0.7;
}

/* ─── Grid ───────────────────────────────────────────── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* ─── Card ───────────────────────────────────────────── */
.project-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.5rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  transition: all var(--transition);
}

.project-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(108, 99, 255, 0.1);
}

.project-card.featured {
  border-color: rgba(108, 99, 255, 0.3);
  background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(108, 99, 255, 0.05) 100%);
}

.featured-badge {
  position: absolute;
  top: -1px;
  right: 1.5rem;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.75rem;
  border-radius: 0 0 8px 8px;
}

/* Card Top */
.card-top {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type-badge {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: var(--color-accent-dim);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
}

.status-badge.in_progress {
  background: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.status-badge.completed {
  background: rgba(74, 222, 128, 0.1);
  color: #4ade80;
  border: 1px solid rgba(74, 222, 128, 0.3);
}

.status-badge.archived {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
  border: 1px solid rgba(107, 114, 128, 0.3);
}

.status-icon {
  width: 0.85rem;
  height: 0.85rem;
}

.project-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text-primary);
  line-height: 1.4;
}

.project-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

/* Tech Stack */
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.tech-tag {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  background: var(--color-bg-hover);
  border: 1px solid var(--color-border);
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.tech-more {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-accent);
  padding: 0.2rem 0.6rem;
}

/* Card Footer */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.project-date {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.card-links {
  display: flex;
  gap: 0.5rem;
}

.card-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  transition: all var(--transition);
}

.card-link:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-dim);
}

.link-icon {
  width: 1rem;
  height: 1rem;
}

/* ─── Empty State ────────────────────────────────────── */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  background: var(--color-bg-card);
  border: 1px dashed var(--color-border);
  border-radius: 12px;
}

.empty-icon {
  width: 2.5rem;
  height: 2.5rem;
  color: var(--color-text-muted);
  opacity: 0.5;
}

/* ─── Responsive ──────────────────────────────────────── */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .error-state {
    flex-direction: column;
    align-items: flex-start;
  }

  .error-content {
    flex-direction: column;
    align-items: stretch;
  }

  .retry-btn {
    justify-content: center;
  }
}
</style>
