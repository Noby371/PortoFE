<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getProfile } from '../services/api'

const currentYear = new Date().getFullYear()

interface Profile {
  name: string
  githubUrl: string | null
  linkedinUrl: string | null
  phone: string | null
}

const profile = ref<Profile | null>(null)

onMounted(async () => {
  try {
    profile.value = await getProfile()
  } catch {
    // fallback
  }
})

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Education', href: '#education' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
]
</script>

<template>
  <footer class="footer">
    <div class="container">
      <!-- Top -->
      <div class="footer-top">
        <!-- Brand -->
        <div class="footer-brand">
          <a href="#" class="footer-logo">
            <span class="logo-bracket">&lt;</span>
            {{ profile?.name ?? 'FathBoy' }}
            <span class="logo-bracket">/&gt;</span>
          </a>
          <p class="footer-tagline">
            Fullstack Developer & IoT Engineer berbasis di Sumenep, Madura. Siap membangun solusi
            teknologi yang berdampak nyata.
          </p>
        </div>

        <!-- Nav Links -->
        <div class="footer-col">
          <p class="footer-col-title">Navigasi</p>
          <ul class="footer-links">
            <li v-for="link in navLinks" :key="link.href">
              <a :href="link.href" class="footer-link">{{ link.label }}</a>
            </li>
          </ul>
        </div>

        <!-- Social Links -->
        <div class="footer-col">
          <p class="footer-col-title">Sosial</p>
          <ul class="footer-links">
            <li v-if="profile?.githubUrl">
              <a :href="profile.githubUrl" target="_blank" class="footer-link"> GitHub </a>
            </li>
            <li v-if="profile?.linkedinUrl">
              <a :href="profile.linkedinUrl" target="_blank" class="footer-link"> LinkedIn </a>
            </li>
            <li v-if="profile?.phone">
              <a
                :href="`https://wa.me/${profile.phone.replace(/\D/g, '')}`"
                target="_blank"
                class="footer-link"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="footer-divider"></div>

      <!-- Bottom -->
      <div class="footer-bottom">
        <p class="footer-copy">
          © {{ currentYear }} {{ profile?.name ?? 'FathBoy' }}. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
}

.container {
  padding-top: 3.5rem;
  padding-bottom: 2rem;
}

/* ── Top ── */
.footer-top {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 2.5rem;
}

/* Brand */
.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-logo {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  transition: color var(--transition);
  width: fit-content;
}

.footer-logo:hover {
  color: var(--color-accent);
}

.logo-bracket {
  color: var(--color-accent);
}

.footer-tagline {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  max-width: 280px;
}

/* Columns */
.footer-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-col-title {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
}

.footer-links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.footer-link {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  transition: all var(--transition);
  width: fit-content;
  position: relative;
}

.footer-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-accent);
  transition: width var(--transition);
}

.footer-link:hover {
  color: var(--color-accent);
}

.footer-link:hover::after {
  width: 100%;
}

/* ── Divider ── */
.footer-divider {
  height: 1px;
  background: var(--color-border);
  margin-bottom: 1.5rem;
}

/* ── Bottom ── */
.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.footer-copy {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 480px) {
  .footer-top {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
