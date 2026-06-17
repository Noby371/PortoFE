<script setup lang="ts">
import { ref, computed } from 'vue'
import { projects } from '../data/projects'
import type { ProjectType } from '../types'
import { useScrollReveal } from '../composables/useScrollReveal'
import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  ClockIcon,
  CheckCircleIcon,
} from '@heroicons/vue/24/outline'

useScrollReveal()

const filters: { label: string; value: ProjectType | 'ALL' }[] = [
  { label: 'Semua',     value: 'ALL'       },
  { label: 'Thesis',    value: 'THESIS'    },
  { label: 'Startup',   value: 'STARTUP'   },
  { label: 'Akademik',  value: 'ACADEMIC'  },
  { label: 'Freelance', value: 'FREELANCE' },
]

const activeFilter = ref<ProjectType | 'ALL'>('ALL')

const filtered = computed(() =>
  activeFilter.value === 'ALL'
    ? projects
    : projects.filter((p) => p.type === activeFilter.value)
)

const statusLabel: Record<string, string> = {
  IN_PROGRESS: 'On Going',
  COMPLETED:   'Selesai',
  ARCHIVED:    'Arsip',
}

const typeLabel: Record<string, string> = {
  THESIS:    'Thesis',
  STARTUP:   'Startup',
  ACADEMIC:  'Akademik',
  FREELANCE: 'Freelance',
  PERSONAL:  'Personal',
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
        </button>
      </div>

      <!-- Project Grid -->
      <div class="projects-grid">
        <div
          v-for="(project, index) in filtered"
          :key="project.id"
          class="project-card reveal-up"
          :class="[`reveal-delay-${(index % 5) + 1}`, { featured: project.featured }]"
        >
          <!-- Featured Badge -->
          <div v-if="project.featured" class="featured-badge">⭐ Featured</div>

          <!-- Card Top -->
          <div class="card-top">
            <div class="card-meta">
              <span class="type-badge">{{ typeLabel[project.type] }}</span>
              <span class="status-badge" :class="project.status.toLowerCase()">
                <component
                  :is="project.status === 'IN_PROGRESS' ? ClockIcon : CheckCircleIcon"
                  class="status-icon"
                />
                {{ statusLabel[project.status] }}
              </span>
            </div>
            <h3 class="project-title">{{ project.title }}</h3>
            <p class="project-desc">{{ project.description }}</p>
          </div>

          <!-- Tech Stack -->
          <div class="tech-stack">
            <span
              v-for="(tech, i) in project.techStack.slice(0, 5)"
              :key="i"
              class="tech-tag"
            >
              {{ tech }}
            </span>
            <span v-if="project.techStack.length > 5" class="tech-more">
              +{{ project.techStack.length - 5 }}
            </span>
          </div>

          <!-- Card Footer -->
          <div class="card-footer">
            <span class="project-date">
              {{ project.startDate.slice(0, 7) }}
              {{ project.endDate ? '→ ' + project.endDate.slice(0, 7) : '→ Sekarang' }}
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
      </div>

    </div>
  </section>
</template>

<style scoped>
.projects {
  background: var(--color-bg-secondary);
}

/* ── Filter Tabs ── */
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

/* ── Grid ── */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

/* ── Card ── */
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

/* ── Responsive ── */
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
