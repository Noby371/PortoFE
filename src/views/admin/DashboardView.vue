<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../../services/api'
import {
  CodeBracketIcon,
  FolderOpenIcon,
  BriefcaseIcon,
  EnvelopeIcon,
} from '@heroicons/vue/24/outline'

interface Stats {
  skills: number
  projects: number
  experience: number
  messages: number
}

const stats = ref<Stats>({
  skills: 0,
  projects: 0,
  experience: 0,
  messages: 0,
})

const isLoading = ref(true)

onMounted(async () => {
  try {
    const [skills, projects, experience, messages] = await Promise.all([
      api.get('/skills'),
      api.get('/projects'),
      api.get('/experience'),
      api.get('/contact/messages'),
    ])

    stats.value = {
      skills:     skills.data.length,
      projects:   projects.data.meta?.total ?? projects.data.length,
      experience: experience.data.length,
      messages:   messages.data.meta?.total ?? 0,
    }
  } catch (err) {
    console.error(err)
  } finally {
    isLoading.value = false
  }
})

const statCards = [
  { key: 'skills',     label: 'Skills',      icon: CodeBracketIcon, color: '#6c63ff' },
  { key: 'projects',   label: 'Projects',    icon: FolderOpenIcon,  color: '#10b981' },
  { key: 'experience', label: 'Experience',  icon: BriefcaseIcon,   color: '#f59e0b' },
  { key: 'messages',   label: 'Pesan Masuk', icon: EnvelopeIcon,    color: '#3b82f6' },
]

const quickLinks = [
  { label: 'Tambah Project',    name: 'admin-projects'    },
  { label: 'Tambah Skill',      name: 'admin-skills'      },
  { label: 'Update Profile',    name: 'admin-profile'     },
  { label: 'Lihat Pesan',       name: 'admin-messages'    },
]
</script>

<template>
  <div class="dashboard">

    <!-- Welcome -->
    <div class="welcome-card">
      <div class="welcome-text">
        <h2 class="welcome-title">Selamat datang kembali! 👋</h2>
        <p class="welcome-desc">Kelola konten portofolio Anda dari sini.</p>
      </div>
      <a href="/" target="_blank" class="btn-view-site">
        Lihat Portofolio ↗
      </a>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div
        v-for="card in statCards"
        :key="card.key"
        class="stat-card"
      >
        <div class="stat-icon-wrap" :style="{ background: card.color + '22', borderColor: card.color + '44' }">
          <component :is="card.icon" class="stat-icon" :style="{ color: card.color }" />
        </div>
        <div>
          <p class="stat-number">
            <span v-if="isLoading" class="skeleton">--</span>
            <span v-else>{{ stats[card.key as keyof Stats] }}</span>
          </p>
          <p class="stat-label">{{ card.label }}</p>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="section-header">
      <h3 class="section-title">Aksi Cepat</h3>
    </div>

    <div class="quick-links">
      <RouterLink
        v-for="link in quickLinks"
        :key="link.name"
        :to="{ name: link.name }"
        class="quick-link"
      >
        {{ link.label }} →
      </RouterLink>
    </div>

  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Welcome */
.welcome-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.75rem;
  background: linear-gradient(135deg, var(--color-bg-card) 0%, rgba(108, 99, 255, 0.08) 100%);
  border: 1px solid rgba(108, 99, 255, 0.2);
  border-radius: 16px;
  flex-wrap: wrap;
  gap: 1rem;
}

.welcome-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 0.25rem;
}

.welcome-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.btn-view-site {
  padding: 0.6rem 1.25rem;
  background: var(--color-accent);
  color: #fff;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all var(--transition);
  white-space: nowrap;
}

.btn-view-site:hover {
  background: var(--color-accent-hover);
  color: #fff;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: all var(--transition);
}

.stat-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

.stat-icon-wrap {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 10px;
  border: 1px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.skeleton {
  opacity: 0.3;
}

/* Quick Links */
.section-header {
  margin-top: 0.5rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.quick-link {
  padding: 1rem 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: all var(--transition);
}

.quick-link:hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
  background: var(--color-accent-dim);
}

/* Responsive */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-links {
    grid-template-columns: 1fr;
  }
}
</style>
