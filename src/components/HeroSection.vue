<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useHireModal } from '../composables/useHireModal'
import { getProfile } from '../services/api'

const { openModal } = useHireModal()

interface Profile {
  name: string
  title: string
  bio: string
  location: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  resumeUrl: string | null
}

const profile = ref<Profile | null>(null)

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
const tiltX = ref(0)
const tiltY = ref(0)
const glowX = ref(50)
const glowY = ref(50)

function handleMouseMove(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width
  const py = (e.clientY - rect.top) / rect.height
  tiltY.value = (px - 0.5) * 16
  tiltX.value = (0.5 - py) * 16
  glowX.value = px * 100
  glowY.value = py * 100
}

function resetTilt() {
  tiltX.value = 0
  tiltY.value = 0
  glowX.value = 50
  glowY.value = 50
}

const tiltStyle = computed(() => ({
  transform: `rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg)`,
}))

const glowStyle = computed(() => ({
  background: `radial-gradient(circle at ${glowX.value}% ${glowY.value}%, rgba(120, 119, 255, 0.45), transparent 60%)`,
}))

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
          {{ profile?.bio ?? 'Mahasiswa Teknik Informatika tingkat akhir di Universitas Wiraraja Madura, berpengalaman dalam pengembangan sistem IoT, web fullstack, dan mobile application. Co-founder InnoTech — software house Sumenep.' }}
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
        <div class="avatar-wrapper" @mousemove="handleMouseMove" @mouseleave="resetTilt">
          <div class="tilt-card" :style="tiltStyle">
            <div class="avatar-glow" :style="glowStyle"></div>
            <div class="avatar-ring"></div>
            <div class="avatar-ring ring-2"></div>
            <img src="/hero.png" alt="FathBoy Profile" class="avatar-img" />
          </div>
        </div>

        <div class="float-badge badge-esp">⚡ ESP32</div>
        <div class="float-badge badge-vue">▲ Vue.js</div>
        <div class="float-badge badge-node">⬢ Node.js</div>
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

/* ── Visual ── */
.hero-visual {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 440px;
  perspective: 1000px;
}

.avatar-wrapper {
  position: relative;
  width: 340px;
  height: 340px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tilt-card {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.15s ease-out;
  transform-style: preserve-3d;
}

.avatar-glow {
  position: absolute;
  inset: -20%;
  border-radius: 50%;
  opacity: 0.8;
  transition: background 0.1s ease-out;
  pointer-events: none;
  z-index: 0;
}

.avatar-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid transparent;
  border-image: linear-gradient(135deg, #6c63ff, #ff63c4, #63d9ff) 1;
  opacity: 0.55;
  animation: rotate 8s linear infinite;
}

.ring-2 {
  inset: -18px;
  opacity: 0.3;
  animation: rotate 12s linear infinite reverse;
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
  box-shadow: 0 0 12px 2px var(--color-accent);
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.avatar-img {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  box-shadow: 0 20px 50px -15px rgba(0, 0, 0, 0.5);
}

/* ── Floating Badges ── */
.float-badge {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 20px -10px rgba(0, 0, 0, 0.5);
  animation: float 3s ease-in-out infinite;
}

.badge-esp  { top: 8%;    left: -2%;  animation-delay: 0s; }
.badge-vue  { top: 58%;   right: -4%; animation-delay: 1s; }
.badge-node { bottom: 5%; left: 12%;  animation-delay: 2s; }

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

  .hero-role-line { justify-content: center; }
  .hero-desc      { margin: 0 auto 2rem; }
  .hero-cta       { justify-content: center; }
  .hero-stats     { justify-content: center; }

  .hero-visual    { height: 300px; }
  .avatar-wrapper { width: 260px; height: 260px; }

  .blob-1, .blob-2, .blob-3 {
    filter: blur(60px);
    opacity: 0.4;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mesh-blob,
  .avatar-ring,
  .float-badge,
  .wave,
  .hero-name,
  .scroll-line,
  .dot-pulse {
    animation: none !important;
  }
}
</style>
