<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useActiveNav } from '../composables/useActiveNav'
import { useHireModal } from '../composables/useHireModal'

const isScrolled = ref(false)
const isMobileOpen = ref(false)
const { activeSection } = useActiveNav()
const { openModal } = useHireModal()

const navLinks = [
  { label: 'About',      href: '#about',      id: 'about'      },
  { label: 'Skills',     href: '#skills',     id: 'skills'     },
  { label: 'Education',  href: '#education',  id: 'education'  },
  { label: 'Projects',   href: '#projects',   id: 'projects'   },
  { label: 'Experience', href: '#experience', id: 'experience' },
  { label: 'Certificates', href: '#certificates', id: 'certificates' },
  { label: 'Contact',    href: '#contact',    id: 'contact'    },
]

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

function toggleMobile() {
  isMobileOpen.value = !isMobileOpen.value
  // Prevent body scroll when mobile menu is open
  if (!isMobileOpen.value) {
    document.body.style.overflow = ''
  } else {
    document.body.style.overflow = 'hidden'
  }
}

function closeMobile() {
  isMobileOpen.value = false
  document.body.style.overflow = ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<template>
  <header :class="['navbar', { scrolled: isScrolled }]">
    <div class="container navbar-inner">

      <a href="#" class="navbar-logo">
        <span class="logo-bracket">&lt;</span>
        FathBoy
        <span class="logo-bracket">/&gt;</span>
      </a>

      <nav class="navbar-links">
        <a
          v-for="link in navLinks"
          :key="link.href"
          :href="link.href"
          class="nav-link"
          :class="{ active: activeSection === link.id }"
        >
          {{ link.label }}
        </a>
        <button @click="openModal" class="btn-hire">Hire Me</button>
      </nav>

      <button class="mobile-toggle" @click="toggleMobile" aria-label="Toggle menu">
        <span :class="['bar', { open: isMobileOpen }]"></span>
        <span :class="['bar', { open: isMobileOpen }]"></span>
        <span :class="['bar', { open: isMobileOpen }]"></span>
      </button>
    </div>

    <div :class="['mobile-menu', { open: isMobileOpen }]">
      <a
        v-for="link in navLinks"
        :key="link.href"
        :href="link.href"
        class="mobile-link"
        :class="{ active: activeSection === link.id }"
        @click="closeMobile"
      >
        {{ link.label }}
      </a>
      <button @click="openModal" class="btn-hire mobile-hire">
        Hire Me
      </button>
    </div>
  </header>
</template>

<style scoped>
/* Navbar Base Styles */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: transparent;
  transition: all 0.3s ease;
  padding: 1.25rem 0;
}

.navbar.scrolled {
  background: var(--color-bg-primary);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 0.75rem 0;
}

.navbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo */
.navbar-logo {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.navbar-logo:hover {
  color: var(--color-accent);
}

.logo-bracket {
  color: var(--color-accent);
}

/* Desktop Navigation */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  padding-bottom: 4px;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-accent);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.nav-link:hover {
  color: var(--color-accent);
}

.nav-link.active {
  color: var(--color-accent);
}

.nav-link.active::after {
  width: 100%;
}

/* Hire Me Button */
.btn-hire {
  padding: 0.5rem 1.25rem;
  background: var(--color-accent);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-hire:hover {
  background: var(--color-accent-hover);
  transform: translateY(-2px);
}

/* Mobile Toggle Button */
.mobile-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
}

.bar {
  width: 100%;
  height: 3px;
  background: var(--color-text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.bar.open:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.bar.open:nth-child(2) {
  opacity: 0;
}

.bar.open:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 80%;
  max-width: 300px;
  height: 100vh;
  background: var(--color-bg-primary);
  backdrop-filter: blur(20px);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 6rem 2rem 2rem;
  transition: right 0.3s ease;
  z-index: 999;
}

.mobile-menu.open {
  right: 0;
}

.mobile-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 500;
  padding: 0.75rem 1rem;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.mobile-link:hover {
  color: var(--color-accent);
  background: var(--color-accent-dim);
  padding-left: 1.5rem;
}

.mobile-link.active {
  color: var(--color-accent);
  background: var(--color-accent-dim);
}

.mobile-hire {
  margin-top: 1rem;
  text-align: center;
}

/* Overlay untuk mobile menu */
.mobile-menu::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: -1;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-menu.open::before {
  opacity: 1;
  visibility: visible;
}

/* Responsive */
@media (max-width: 768px) {
  .navbar-links {
    display: none;
  }

  .mobile-toggle {
    display: flex;
  }
}
</style>
