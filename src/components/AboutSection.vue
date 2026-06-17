<script setup lang="ts">
import type { AboutHighlight } from '../types'
import { useScrollReveal } from '../composables/useScrollReveal'
import {
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  SignalIcon,
  RocketLaunchIcon,
  MapPinIcon,
  CheckBadgeIcon,
  BuildingLibraryIcon,
  CodeBracketIcon,
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/outline'

useScrollReveal()

const highlights: AboutHighlight[] = [
  {
    icon: AcademicCapIcon,
    title: 'Pertukaran Mahasiswa',
    description: 'Program PMM di Universitas Negeri Yogyakarta — pengalaman akademik lintas kampus negeri.',
  },
  {
    icon: WrenchScrewdriverIcon,
    title: 'Magang Industri',
    description: 'Teknisi di Madura Store — diagnosis & perbaikan hardware laptop secara langsung.',
  },
  {
    icon: SignalIcon,
    title: 'Pemateri IoT',
    description: 'Mengajar Internet of Things di ITClass Universitas Wiraraja — ESP32, MQTT, dan sensor.',
  },
  {
    icon: RocketLaunchIcon,
    title: 'Co-Founder InnoTech',
    description: 'Mendirikan software house di Sumenep bersama tim — web, mobile, IoT, dan konsultasi IT.',
  },
]

const infoItems = [
  { icon: MapPinIcon,          label: 'Lokasi',      value: 'Sumenep, Madura',      green: false },
  { icon: CheckBadgeIcon,      label: 'Status',      value: 'Tersedia untuk hire',   green: true  },
  { icon: BuildingLibraryIcon, label: 'Universitas', value: 'Wiraraja Madura',       green: false },
  { icon: CodeBracketIcon,     label: 'Fokus',       value: 'Fullstack & IoT',       green: false },
]
</script>

<template>
  <section class="about section" id="about">
    <div class="container">

      <p class="section-label reveal">Tentang Saya</p>
      <h2 class="section-title reveal reveal-delay-1">Siapa <span>FathBoy</span>?</h2>
      <div class="section-divider reveal reveal-delay-2"></div>

      <div class="about-inner">

        <!-- ── Left ── -->
        <div class="about-text">
          <p class="reveal-left reveal-delay-1">
            Saya adalah mahasiswa <strong>Teknik Informatika semester 8</strong> di
            Universitas Wiraraja Madura yang sedang menyelesaikan tugas akhir
            tentang sistem monitoring tempat sampah berbasis IoT menggunakan
            Fuzzy Tsukamoto.
          </p>
          <p class="reveal-left reveal-delay-2">
            Perjalanan saya di dunia teknologi tidak hanya terbatas di bangku kuliah —
            saya telah mengikuti <strong>pertukaran mahasiswa</strong> di Universitas
            Negeri Yogyakarta, menjalani <strong>magang</strong> sebagai teknisi laptop,
            hingga menjadi <strong>pemateri IoT</strong> untuk mahasiswa lain.
          </p>
          <p class="reveal-left reveal-delay-3">
            Saat ini saya aktif mengembangkan <strong>InnoTech</strong>, software house
            yang saya dirikan bersama rekan-rekan di Sumenep, Madura. Saya percaya
            teknologi harus memberikan dampak nyata bagi masyarakat sekitar.
          </p>

          <!-- Info Grid -->
          <div class="about-info">
            <div
              v-for="(item, i) in infoItems"
              :key="i"
              class="info-item"
            >
              <component :is="item.icon" class="info-icon" />
              <div>
                <span class="info-label">{{ item.label }}</span>
                <span class="info-value" :class="{ 'info-status': item.green }">
                  {{ item.value }}
                </span>
              </div>
            </div>
          </div>

          <a href="/cv.pdf" target="_blank" class="btn-download">
            <ArrowDownTrayIcon class="btn-icon" />
            Download CV
          </a>
        </div>

        <!-- ── Right ── -->
        <div class="about-highlights">
          <div
            v-for="(item, i) in highlights"
            :key="i"
            class="highlight-card"
          >
            <div class="highlight-icon-wrap">
              <component :is="item.icon" class="highlight-icon" />
            </div>
            <div class="highlight-body">
              <h4 class="highlight-title">{{ item.title }}</h4>
              <p class="highlight-desc">{{ item.description }}</p>
            </div>
            <div class="highlight-number">0{{ i + 1 }}</div>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.about {
  background: var(--color-bg-secondary);
  position: relative;
  overflow: hidden;
}

/* subtle background glow */
.about::before {
  content: '';
  position: absolute;
  bottom: -20%;
  left: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(108, 99, 255, 0.07) 0%, transparent 70%);
  pointer-events: none;
}

.about-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: start;
}

/* ── Text ── */
.about-text {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.about-text p {
  color: var(--color-text-secondary);
  line-height: 1.9;
  font-size: 0.95rem;
}

.about-text strong {
  color: var(--color-text-primary);
  font-weight: 600;
}

/* Info Grid */
.about-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin: 0.5rem 0 1.5rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  transition: all var(--transition);
}

.info-item:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-hover);
}

.info-icon {
  width: 1.1rem;
  height: 1.1rem;
  color: var(--color-accent);
  flex-shrink: 0;
}

.info-label {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.15rem;
}

.info-value {
  display: block;
  font-size: 0.85rem;
  color: var(--color-text-primary);
  font-weight: 500;
}

.info-status {
  color: #4ade80 !important;
}

/* Download Button */
.btn-download {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 1.6rem;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all var(--transition);
  width: fit-content;
  position: relative;
  overflow: hidden;
}

.btn-download::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--color-accent);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 0;
}

.btn-download:hover::before {
  transform: translateX(0);
}

.btn-download:hover {
  color: #fff;
  transform: translateY(-2px);
}

.btn-download span,
.btn-download .btn-icon {
  position: relative;
  z-index: 1;
}

.btn-icon {
  width: 1.1rem;
  height: 1.1rem;
}

/* ── Highlights ── */
.about-highlights {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.highlight-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.25rem 1.25rem 1.25rem;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  transition: all var(--transition);
  position: relative;
  overflow: hidden;
}

.highlight-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-accent);
  transform: scaleY(0);
  transition: transform var(--transition);
  transform-origin: bottom;
}

.highlight-card:hover {
  border-color: var(--color-border-hover);
  background: var(--color-bg-hover);
  transform: translateX(6px);
}

.highlight-card:hover::before {
  transform: scaleY(1);
}

.highlight-icon-wrap {
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

.highlight-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-accent);
}

.highlight-body {
  flex: 1;
}

.highlight-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.3rem;
}

.highlight-desc {
  font-size: 0.83rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.highlight-number {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-muted);
  opacity: 0.3;
  align-self: center;
  flex-shrink: 0;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .about-inner {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .about-info {
    grid-template-columns: 1fr;
  }
}
</style>
