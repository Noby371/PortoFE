<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSkills } from '../services/api'
import { useScrollReveal } from '../composables/useScrollReveal'
import {
  CpuChipIcon,
  ServerIcon,
  ComputerDesktopIcon,
  CircleStackIcon,
  WrenchIcon,
  DevicePhoneMobileIcon,
  CommandLineIcon,
  Square3Stack3DIcon,
} from '@heroicons/vue/24/outline'

useScrollReveal()

interface Skill {
  id: number
  name: string
  category: string
  level: number
  iconSlug: string | null
}

interface SkillGroup {
  category: string
  skills: Skill[]
}

const skillGroups = ref<SkillGroup[]>([])
const isLoading = ref(true)

const categoryIcon: Record<string, unknown> = {
  IOT: CpuChipIcon,
  BACKEND: ServerIcon,
  FRONTEND: ComputerDesktopIcon,
  DATABASE: CircleStackIcon,
  DEVOPS: WrenchIcon,
  MOBILE: DevicePhoneMobileIcon,
  TOOLS: CommandLineIcon,
  OTHER: Square3Stack3DIcon,
}

onMounted(async () => {
  try {
    const skills: Skill[] = await getSkills()

    const grouped = skills.reduce(
      (acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = []
        acc[skill.category]!.push(skill)
        return acc
      },
      {} as Record<string, Skill[]>,
    )

    skillGroups.value = Object.entries(grouped).map(([category, skills]) => ({
      category,
      skills,
    }))
  } catch {
    // fallback kosong
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section class="skills section" id="skills">
    <div class="container">
      <p class="section-label reveal">Kemampuan</p>
      <h2 class="section-title reveal reveal-delay-1">Tech <span>Stack</span></h2>
      <div class="section-divider reveal reveal-delay-2"></div>

      <div v-if="isLoading" class="loading">Memuat skills...</div>

      <div v-else class="skills-grid">
        <div
          v-for="(group, i) in skillGroups"
          :key="i"
          class="skill-card reveal"
          :style="{ transitionDelay: `${i * 0.1}s` }"
        >
          <!-- Card Header -->
          <div class="card-header">
            <component :is="categoryIcon[group.category] ?? Square3Stack3DIcon" class="card-icon" />
            <h3 class="card-title">{{ group.category }}</h3>
          </div>

          <!-- Skill List -->
          <div class="skill-list">
            <div v-for="(skill, j) in group.skills" :key="j" class="skill-item">
              <div class="skill-meta">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-fill" :style="{ width: skill.level + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.skills {
  background: var(--color-bg-primary);
}

.loading {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  text-align: center;
  padding: 3rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.skill-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all var(--transition);
}

.skill-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-4px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.card-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-accent);
  flex-shrink: 0;
}

.card-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.skill-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-name {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.skill-level {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-accent);
}

.skill-bar {
  height: 4px;
  background: var(--color-bg-hover);
  border-radius: 999px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent), var(--color-accent-hover));
  border-radius: 999px;
  transition: width 1s ease;
}

@media (max-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
