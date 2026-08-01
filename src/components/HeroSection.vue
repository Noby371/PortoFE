<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useHireModal } from '../composables/useHireModal'
import { getProfile, resolveAssetUrl } from '../services/api'

const { openModal } = useHireModal()

interface Profile {
  name: string
  title: string
  bio: string
  location: string | null
  avatarUrl: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  resumeUrl: string | null
}

const profile = ref<Profile | null>(null)

const avatarSrc = computed(() =>
  resolveAssetUrl(profile.value?.avatarUrl) ?? '/hero.png'
)

onMounted(async () => {
  try {
    profile.value = await getProfile()
  } catch {
    // fallback
  }
})

const roles = ['Fullstack Developer', 'IoT Engineer', 'Freelancer']

/* ── Typing effect ── */
const displayedRole = ref('')
const roleIndex = ref(0)
let charIndex = 0
let typeTimer: ReturnType<typeof setTimeout> | null = null
let isDeleting = false

function tick() {
  const current = roles[roleIndex.value] ?? ''

  if (!isDeleting) {
    charIndex++
    displayedRole.value = current.slice(0, charIndex)
    if (charIndex === current.length) {
      isDeleting = true
      typeTimer = setTimeout(tick, 1800)
      return
    }
    typeTimer = setTimeout(tick, 70)
  } else {
    charIndex--
    displayedRole.value = current.slice(0, charIndex)
    if (charIndex === 0) {
      isDeleting = false
      roleIndex.value = (roleIndex.value + 1) % roles.length
      typeTimer = setTimeout(tick, 300)
      return
    }
    typeTimer = setTimeout(tick, 35)
  }
}

/* ── Parallax tilt ── */

onMounted(() => {
  typeTimer = setTimeout(tick, 500)
})

onUnmounted(() => {
  if (typeTimer) clearTimeout(typeTimer)
})
</script>

<template>
  <section class="hero section" id="hero">
    <!-- Gradient Mesh Background -->
    <div class="mesh-bg" aria-hidden="true">
      <div class="mesh-blob blob-1"></div>
      <div class="mesh-blob blob-2"></div>
      <div class="mesh-blob blob-3"></div>
      <div class="mesh-grid"></div>
      <div class="mesh-noise"></div>
    </div>

    <div class="container hero-inner">
      <!-- Text Content -->
      <div class="hero-content">
        <p class="hero-greeting"><span class="wave">👋</span> Halo, saya</p>
        <h1 class="hero-name">{{ profile?.name ?? 'FathBoy' }}</h1>

        <div class="hero-role-line">
          <span class="role-prefix">&lt;</span>
          <span class="role-typed">{{ displayedRole }}</span>
          <span class="role-cursor">|</span>
          <span class="role-prefix">/&gt;</span>
        </div>

        <p class="hero-desc">
          {{ profile?.bio ?? 'Fresh Graduate Teknik Informatika dari Universitas Wiraraja Madura, berpengalaman dalam pengembangan sistem IoT, web fullstack, dan mobile application. Co-founder InnoTech — software house Sumenep.' }}
        </p>

        <div class="hero-cta">
          <a href="#projects" class="btn-primary">
            <span>Lihat Projects</span>
            <svg class="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </a>
          <button class="btn-secondary" @click="openModal">
            <span class="dot-pulse"></span>
            Hire Me
          </button>
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
        <img :src="avatarSrc" alt="FathBoy Profile" class="hero-img" />
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
  isolation: isolate;
}

/* ── Gradient Mesh Background ── */
.mesh-bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}

.mesh-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
  will-change: transform;
}

.blob-1 {
  width: 600px;
  height: 600px;
  top: -15%;
  right: -10%;
  background: radial-gradient(circle, #6c63ff 0%, transparent 70%);
  animation: drift1 14s ease-in-out infinite;
}

.blob-2 {
  width: 480px;
  height: 480px;
  bottom: -10%;
  left: -8%;
  background: radial-gradient(circle, #ff63c4 0%, transparent 70%);
  animation: drift2 18s ease-in-out infinite;
}

.blob-3 {
  width: 420px;
  height: 420px;
  top: 35%;
  left: 40%;
  background: radial-gradient(circle, #63d9ff 0%, transparent 70%);
  opacity: 0.35;
  animation: drift3 16s ease-in-out infinite;
}

.mesh-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent);
}

.mesh-noise {
  position: absolute;
  inset: 0;
  opacity: 0.05;
  pointer-events: none;
  background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  mix-blend-mode: overlay;
}

@keyframes drift1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(-40px, 40px) scale(1.1); }
}
@keyframes drift2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(50px, -30px) scale(1.05); }
}
@keyframes drift3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(-30px, -40px) scale(0.9); }
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.wave {
  display: inline-block;
  animation: wave 2.5s ease-in-out infinite;
  transform-origin: 70% 70%;
}

@keyframes wave {
  0%, 60%, 100% { transform: rotate(0deg); }
  10%            { transform: rotate(14deg); }
  20%            { transform: rotate(-8deg); }
  30%            { transform: rotate(14deg); }
  40%            { transform: rotate(-4deg); }
  50%            { transform: rotate(10deg); }
}

.hero-name {
  font-size: clamp(3.2rem, 8vw, 5.5rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, #b9b3ff 45%, #6c63ff 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  animation: shimmer 6s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}

.hero-role-line {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-mono);
  font-size: 1.05rem;
  margin-bottom: 1.75rem;
  min-height: 1.6rem;
}

.role-prefix {
  color: var(--color-text-muted);
  opacity: 0.6;
}

.role-typed {
  color: var(--color-accent);
  font-weight: 600;
  background: linear-gradient(90deg, #6c63ff, #ff63c4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.role-cursor {
  color: var(--color-accent);
  animation: blink 0.9s steps(1) infinite;
  font-weight: 300;
}

@keyframes blink {
  50% { opacity: 0; }
}

.hero-desc {
  font-size: 1rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
  margin-bottom: 2rem;
  max-width: 480px;
}

/* ── CTA ── */
.hero-cta {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.85rem;
  background: linear-gradient(135deg, #6c63ff, #8f63ff);
  color: #fff;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 8px 24px -8px rgba(108, 99, 255, 0.6);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.btn-primary:hover {
  color: #fff;
  transform: translateY(-3px);
  box-shadow: 0 12px 30px -8px rgba(108, 99, 255, 0.75);
}

.btn-arrow {
  transition: transform 0.25s ease;
}

.btn-primary:hover .btn-arrow {
  transform: translateX(3px);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.85rem 1.85rem;
  border: 1px solid var(--color-border-hover);
  color: var(--color-text-primary);
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  backdrop-filter: blur(8px);
  transition: all 0.25s ease;
  background: transparent;
  cursor: pointer;
  font-family: var(--font-sans);
}

.btn-secondary:hover {
  background: var(--color-bg-hover);
  border-color: var(--color-accent);
  transform: translateY(-3px);
}

.dot-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
  animation: pulse 1.8s infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0%   { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.6); }
  70%  { box-shadow: 0 0 0 7px rgba(74, 222, 128, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
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
  font-size: 1.7rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6c63ff, #ff63c4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

/* ── Visual Side ── */
.hero-visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-img {
  display: block;
  height: 90vh;
  width: auto;
  max-width: 100%;
  /* Fade halus di bagian bawah agar tidak terlihat terpotong */
  -webkit-mask-image: linear-gradient(to bottom, black 78%, transparent 100%);
  mask-image: linear-gradient(to bottom, black 78%, transparent 100%);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
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

  .hero-role-line { justify-content: center; }
  .hero-desc      { margin: 0 auto 2rem; }
  .hero-cta       { justify-content: center; }
  .hero-stats     { justify-content: center; }

  .hero-img { height: 55vh; max-height: 520px; }
  .blob-1, .blob-2, .blob-3 {
    filter: blur(60px);
    opacity: 0.4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mesh-blob,
  .wave,
  .hero-name,
  .scroll-line,
  .dot-pulse {
    animation: none !important;
  }
}
</style>
