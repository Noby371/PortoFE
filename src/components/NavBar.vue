<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMobileOpen = ref(false)

const navLinks = [
  { label: 'About',      href: '#about' },
  { label: 'Skills',     href: '#skills' },
  { label: 'Projects',   href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Contact',    href: '#contact' },
]

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

function toggleMobile() {
  isMobileOpen.value = !isMobileOpen.value
}

function closeMobile() {
  isMobileOpen.value = false
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<template>
  <header :class="['navbar', { scrolled: isScrolled }]">
    <div class="container navbar-inner">

      <!-- Logo -->
      <a href="#" class="navbar-logo">
        <span class="logo-bracket">&lt;</span>
        FathBoy
        <span class="logo-bracket">/&gt;</span>
      </a>

      <!-- Desktop Nav -->
      <nav class="navbar-links">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="nav-link"
        >
          {{ link.label }}
        </a>
        <a href="#contact" class="btn-hire">Hire Me</a>
      </nav>

      <!-- Mobile Toggle -->
      <button class="mobile-toggle" @click="toggleMobile" aria-label="Toggle menu">
        <span :class="['bar', { open: isMobileOpen }]"></span>
        <span :class="['bar', { open: isMobileOpen }]"></span>
        <span :class="['bar', { open: isMobileOpen }]"></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div :class="['mobile-menu', { open: isMobileOpen }]">
      <a
        v-for="link in navLinks"
        :key="link.href"
        :href="link.href"
        class="mobile-link"
        @click="closeMobile"
      >
        {{ link.label }}
      </a>
      <a href="#contact" class="btn-hire mobile-hire" @click="closeMobile">
        Hire Me
      </a>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1.25rem 0;
  transition: all var(--transition);
}

.navbar.scrolled {
  background: rgba(10, 10, 15, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  padding: 0.85rem 0;
}

.navbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Logo */
.navbar-logo {
  font-family: var(--font-mono);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text-primary);
  transition: color var(--transition);
  text-decoration: none;
}

.navbar-logo:hover {
  color: var(--color-accent);
}

.logo-bracket {
  color: var(--color-accent);
}

/* Desktop Links */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: color var(--transition);
  position: relative;
  text-decoration: none;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-accent);
  transition: width var(--transition);
}

.nav-link:hover {
  color: var(--color-text-primary);
}

.nav-link:hover::after {
  width: 100%;
}

/* Hire Me Button */
.btn-hire {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
  padding: 0.45rem 1.2rem;
  border-radius: 6px;
  transition: all var(--transition);
  text-decoration: none;
}

.btn-hire:hover {
  background: var(--color-accent);
  color: #fff;
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.bar {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text-primary);
  border-radius: 2px;
  transition: all var(--transition);
}

.bar.open:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.bar.open:nth-child(2) {
  opacity: 0;
}

.bar.open:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 0;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}

.mobile-menu.open {
  max-height: 400px;
}

.mobile-link {
  padding: 1rem 1.5rem;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
  transition: all var(--transition);
  text-decoration: none;
}

.mobile-link:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-hover);
}

.mobile-hire {
  margin: 1rem 1.5rem;
  text-align: center;
  border-radius: 6px;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }
}
</style>
