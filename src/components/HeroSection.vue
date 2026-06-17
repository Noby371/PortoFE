<script setup lang="ts">
import { useHireModal } from '../composables/useHireModal'
const { openModal } = useHireModal()
const roles = ['Fullstack Developer', 'IoT Engineer', 'Freelancer']
</script>

<template>
  <section class="hero section" id="hero">
    <div class="container hero-inner">

      <!-- Text Content -->
      <div class="hero-content">
        <p class="hero-greeting">Halo, saya</p>
        <h1 class="hero-name">FathBoy</h1>
        <div class="hero-roles">
          <span v-for="(role, i) in roles" :key="i" class="role-badge">
            {{ role }}
          </span>
        </div>
        <p class="hero-desc">
          Mahasiswa Teknik Informatika tingkat akhir di
          <span class="highlight">Universitas Wiraraja Madura</span>,
          berpengalaman dalam pengembangan sistem
          <span class="highlight">IoT</span>,
          <span class="highlight">web fullstack</span>, dan
          <span class="highlight">mobile application</span>.
          Co-founder <span class="highlight">InnoTech</span> — software house Sumenep.
        </p>

        <div class="hero-cta">
          <a href="#projects" class="btn-primary">Lihat Projects</a>
          <button class="btn-secondary" @click="openModal">Hire Me</button>
        </div>

        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">10+</span>
            <span class="stat-label">Projects</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">2+</span>
            <span class="stat-label">Tahun Coding</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">5+</span>
            <span class="stat-label">Tech Stack</span>
          </div>
        </div>
      </div>

      <!-- Visual Side -->
      <div class="hero-visual">
        <div class="avatar-wrapper">
          <div class="avatar-ring"></div>
          <img src="/hero.png" alt="FathBoy Profile" class="avatar-img" />
        </div>

        <div class="float-badge badge-esp">ESP32</div>
        <div class="float-badge badge-vue">Vue.js</div>
        <div class="float-badge badge-node">Node.js</div>
      </div>

    </div>

    <div class="scroll-indicator">
      <span>Scroll</span>
      <div class="scroll-line"></div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding-top: 5rem;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(108, 99, 255, 0.12) 0%, transparent 70%);
  pointer-events: none;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  width: 100%;
}

/* ── Text ── */
.hero-greeting {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.5rem;
}

.hero-name {
  font-size: clamp(3rem, 7vw, 5rem);
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg, #f0f0f5 0%, #6c63ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.hero-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.role-badge {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: var(--color-accent-dim);
}

.hero-desc {
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: 2rem;
  max-width: 480px;
}

.highlight {
  color: var(--color-text-primary);
  font-weight: 500;
}

/* ── CTA ── */
.hero-cta {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.btn-primary {
  padding: 0.75rem 1.75rem;
  background: var(--color-accent);
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all var(--transition);
}

.btn-primary:hover {
  background: var(--color-accent-hover);
  color: #fff;
  transform: translateY(-2px);
}

.btn-secondary {
  padding: 0.75rem 1.75rem;
  border: 1px solid var(--color-border-hover);
  color: var(--color-text-primary);
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all var(--transition);
}

.btn-secondary:hover {
  background: var(--color-bg-hover);
  transform: translateY(-2px);
}

/* ── Stats ── */
.hero-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-accent);
  line-height: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 0.25rem;
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: var(--color-border);
}

/* ── Visual ── */
.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 420px;
}

.avatar-wrapper {
  position: relative;
  width: 340px;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--color-accent);
  opacity: 0.4;
  animation: rotate 8s linear infinite;
}

.avatar-ring::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  width: 12px;
  height: 12px;
  background: var(--color-accent);
  border-radius: 50%;
  transform: translateX(-50%);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--color-border);
}

/* ── Floating Badges ── */
.float-badge {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  animation: float 3s ease-in-out infinite;
}

.badge-esp  { top: 10%;   left: 0%;   animation-delay: 0s; }
.badge-vue  { top: 60%;   right: 0%;  animation-delay: 1s; }
.badge-node { bottom: 8%; left: 15%;  animation-delay: 2s; }

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
}

/* ── Scroll Indicator ── */
.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-muted);
  font-size: 0.7rem;
  font-family: var(--font-mono);
  letter-spacing: 0.1em;
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--color-accent), transparent);
  animation: scrollAnim 1.5s ease-in-out infinite;
}

@keyframes scrollAnim {
  0%   { opacity: 1; transform: scaleY(1);   transform-origin: top; }
  100% { opacity: 0; transform: scaleY(0.3); transform-origin: top; }
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }

  .hero-roles { justify-content: center; }
  .hero-desc  { margin: 0 auto 2rem; }
  .hero-cta   { justify-content: center; }
  .hero-stats { justify-content: center; }

  .hero-visual     { height: 300px; }
.avatar-wrapper  { width: 260px; height: 260px; }
.avatar-img      { width: 220px; height: 220px; }
}
</style>
