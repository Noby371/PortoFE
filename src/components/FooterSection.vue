<script setup lang="ts">
import { CodeBracketSquareIcon, HeartIcon } from '@heroicons/vue/24/solid'

const currentYear = new Date().getFullYear()

const navLinks = [
  { label: 'About',      href: '#about'      },
  { label: 'Skills',     href: '#skills'     },
  { label: 'Projects',   href: '#projects'   },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact'    },
]

const socialLinks = [
  { label: 'GitHub',    href: 'https://github.com/username'            },
  { label: 'LinkedIn',  href: 'https://linkedin.com/in/username'       },
  { label: 'WhatsApp',  href: 'https://wa.me/628xxxxxxxxxx'            },
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
            FathBoy
            <span class="logo-bracket">/&gt;</span>
          </a>
          <p class="footer-tagline">
            Fullstack Developer & IoT Engineer berbasis di Sumenep, Madura.
            Siap membangun solusi teknologi yang berdampak nyata.
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
            <li v-for="link in socialLinks" :key="link.href">
              <a :href="link.href" target="_blank" class="footer-link">
                {{ link.label }}
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
          © {{ currentYear }} FathBoy. All rights reserved.
        </p>
        <p class="footer-made">
          Made with
          <HeartIcon class="heart-icon" />
          using
          <CodeBracketSquareIcon class="code-icon" />
          Vue.js & TypeScript
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
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-copy {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.footer-made {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.heart-icon {
  width: 0.85rem;
  height: 0.85rem;
  color: #f43f5e;
}

.code-icon {
  width: 0.95rem;
  height: 0.95rem;
  color: var(--color-accent);
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
