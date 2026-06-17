<script setup lang="ts">
import { skillGroups } from '../data/skills'
import { useScrollReveal } from '../composables/useScrollReveal'

useScrollReveal()
</script>

<template>
  <section class="skills section" id="skills">
    <div class="container">

      <p class="section-label reveal">Kemampuan</p>
      <h2 class="section-title reveal reveal-delay-1">Tech <span>Stack</span></h2>
      <div class="section-divider reveal reveal-delay-2"></div>

      <div class="skills-grid">
        <div
          v-for="(group, i) in skillGroups"
          :key="i"
          class="skill-card reveal-up"
          :class="`reveal-delay-${i + 1}`"
        >
          <div class="card-header">
            <component :is="group.icon" class="card-icon" />
            <h3 class="card-title">{{ group.category }}</h3>
          </div>

          <div class="skill-list">
            <div
              v-for="(skill, j) in group.skills"
              :key="j"
              class="skill-item"
            >
              <div class="skill-meta">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level">{{ skill.level }}%</span>
              </div>
              <div class="skill-bar">
                <div
                  class="skill-fill"
                  :style="{ width: skill.level + '%' }"
                ></div>
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
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hanya animasi opacity untuk card, biarkan skill bar bekerja normal */
.skill-card {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.skill-card.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Reset opacity untuk card yang sudah direveal */
.skill-card.reveal-up {
  opacity: 0;
  transform: translateY(30px);
}

.skill-card.reveal-up.revealed {
  opacity: 1;
  transform: translateY(0);
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
