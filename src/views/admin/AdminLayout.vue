<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useMessagesStore } from '../../stores/messages'
import {
  HomeIcon,
  UserIcon,
  CodeBracketIcon,
  FolderOpenIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  TrophyIcon,
  EnvelopeIcon,
  ArrowRightStartOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellAlertIcon,
  InboxArrowDownIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const messages = useMessagesStore()

const isSidebarOpen = ref(false)
const showToast = ref(false)
let prevUnread = 0
let pollTimer: ReturnType<typeof setInterval> | null = null

const navItems = [
  { label: 'Dashboard',    name: 'admin-dashboard',    icon: HomeIcon            },
  { label: 'Profile',      name: 'admin-profile',      icon: UserIcon            },
  { label: 'Skills',       name: 'admin-skills',       icon: CodeBracketIcon     },
  { label: 'Projects',     name: 'admin-projects',     icon: FolderOpenIcon      },
  { label: 'Experience',   name: 'admin-experience',   icon: BriefcaseIcon       },
  { label: 'Education',    name: 'admin-education',    icon: AcademicCapIcon     },
  { label: 'Certificates', name: 'admin-certificates', icon: TrophyIcon          },
  { label: 'Messages',     name: 'admin-messages',     icon: EnvelopeIcon        },
]

async function checkMessages() {
  const prev = prevUnread
  await messages.refresh()
  if (messages.unreadCount > prev && messages.unreadCount > 0) {
    showToast.value = true
    setTimeout(() => (showToast.value = false), 7000)
  }
  prevUnread = messages.unreadCount
}

function startPolling() {
  if (pollTimer) return
  pollTimer = setInterval(checkMessages, 20000)
}

function handleVisibility() {
  if (document.visibilityState === 'visible') {
    checkMessages()
  }
}

onMounted(async () => {
  try {
    await auth.fetchMe()
  } catch {
    auth.logout()
    router.push({ name: 'admin-login' })
    return
  }

  await messages.refresh()
  prevUnread = messages.unreadCount
  startPolling()
  document.addEventListener('visibilitychange', handleVisibility)
  window.addEventListener('focus', handleVisibility)
})

onUnmounted(() => {
  if (pollTimer) clearInterval(pollTimer)
  document.removeEventListener('visibilitychange', handleVisibility)
  window.removeEventListener('focus', handleVisibility)
})

async function handleLogout() {
  auth.logout()
  router.push({ name: 'admin-login' })
}
</script>

<template>
  <div class="admin-layout">

    <!-- ── Sidebar ── -->
    <aside :class="['sidebar', { open: isSidebarOpen }]">
      <!-- Logo -->
      <div class="sidebar-header">
        <p class="sidebar-logo">
          <span class="logo-bracket">&lt;</span>
          Admin
          <span class="logo-bracket">/&gt;</span>
        </p>
        <button class="sidebar-close" @click="isSidebarOpen = false">
          <XMarkIcon class="icon" />
        </button>
      </div>

      <!-- Admin Info -->
      <div class="admin-info">
        <div class="admin-avatar">
          {{ auth.admin?.email?.charAt(0).toUpperCase() ?? 'A' }}
        </div>
        <div>
          <p class="admin-name">{{ auth.admin?.name ?? 'Admin' }}</p>
          <p class="admin-email">{{ auth.admin?.email }}</p>
        </div>
      </div>

      <!-- Nav -->
      <nav class="sidebar-nav">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="{ name: item.name }"
          class="nav-item"
          :class="{ active: route.name === item.name }"
          @click="isSidebarOpen = false"
        >
          <component :is="item.icon" class="nav-icon" />
          {{ item.label }}
          <span
            v-if="item.name === 'admin-messages' && messages.unreadCount > 0"
            class="nav-badge"
          >
            {{ messages.unreadCount }}
          </span>
        </RouterLink>
      </nav>

      <!-- Logout -->
      <button class="btn-logout" @click="handleLogout">
        <ArrowRightStartOnRectangleIcon class="nav-icon" />
        Logout
      </button>
    </aside>

    <!-- ── Toast: Pesan Baru ── -->
    <Transition name="toast">
      <div v-if="showToast && messages.latest" class="message-toast">
        <div class="toast-icon">
          <BellAlertIcon class="toast-icon-svg" />
        </div>
        <div class="toast-body">
          <p class="toast-title">Pesan baru!</p>
          <p class="toast-text">
            <strong>{{ messages.latest.name }}</strong> — {{ messages.latest.subject }}
          </p>
        </div>
        <RouterLink :to="{ name: 'admin-messages' }" class="toast-link" @click="showToast = false">
          <InboxArrowDownIcon class="toast-link-icon" />
          Buka
        </RouterLink>
        <button class="toast-close" @click="showToast = false">
          <XMarkIcon class="icon" />
        </button>
      </div>
    </Transition>

    <!-- ── Overlay mobile ── -->
    <div
      v-if="isSidebarOpen"
      class="sidebar-overlay"
      @click="isSidebarOpen = false"
    ></div>

    <!-- ── Main Content ── -->
    <div class="admin-main">

      <!-- Topbar -->
      <header class="topbar">
        <button class="menu-btn" @click="isSidebarOpen = true">
          <Bars3Icon class="icon" />
        </button>
        <h1 class="page-title">
          {{ navItems.find(i => i.name === route.name)?.label ?? 'Admin Panel' }}
        </h1>
        <a href="/" target="_blank" class="view-site">
          Lihat Site ↗
        </a>
      </header>

      <!-- Page Content -->
      <div class="page-content">
        <RouterView />
      </div>

    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-primary);
}

/* ── Sidebar ── */
.sidebar {
  width: 260px;
  flex-shrink: 0;
  background: var(--color-bg-secondary);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  transition: transform var(--transition);
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.sidebar-logo {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.logo-bracket {
  color: var(--color-accent);
}

.sidebar-close {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
}

/* Admin Info */
.admin-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.admin-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--color-accent);
  flex-shrink: 0;
}

.admin-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.admin-email {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

/* Nav */
.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.85rem;
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  transition: all var(--transition);
  text-decoration: none;
}

.nav-item:hover {
  background: var(--color-bg-hover);
  color: var(--color-text-primary);
}

.nav-item.active {
  background: var(--color-accent-dim);
  color: var(--color-accent);
  font-weight: 600;
}

.nav-badge {
  margin-left: auto;
  min-width: 1.35rem;
  height: 1.35rem;
  padding: 0 0.35rem;
  border-radius: 999px;
  background: var(--color-accent);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ── Toast ── */
.message-toast {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 300;
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  min-width: 320px;
  max-width: 380px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-accent);
  border-radius: 14px;
  box-shadow: 0 12px 40px -12px rgba(108, 99, 255, 0.5);
}

.toast-icon {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 10px;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-icon-svg {
  width: 1.15rem;
  height: 1.15rem;
  color: var(--color-accent);
}

.toast-body {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: 0.1rem;
}

.toast-text {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.toast-text strong {
  color: var(--color-text-primary);
}

.toast-link {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  background: var(--color-accent);
  color: #fff;
  border-radius: 8px;
  font-size: 0.78rem;
  font-weight: 600;
  flex-shrink: 0;
  transition: all var(--transition);
}

.toast-link:hover {
  background: var(--color-accent-hover);
  color: #fff;
}

.toast-link-icon {
  width: 0.9rem;
  height: 0.9rem;
}

.toast-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 0.2rem;
  flex-shrink: 0;
}

.toast-close:hover {
  color: var(--color-text-primary);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px);
}

.nav-icon {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
}

/* Logout */
.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border: none;
  border-top: 1px solid var(--color-border);
  background: none;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition);
  width: 100%;
  text-align: left;
}

.btn-logout:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.08);
}

/* ── Overlay ── */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 40;
}

/* ── Main ── */
.admin-main {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Topbar */
.topbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 30;
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.page-title {
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.view-site {
  font-size: 0.8rem;
  color: var(--color-accent);
  font-family: var(--font-mono);
  transition: color var(--transition);
}

.view-site:hover {
  color: var(--color-accent-hover);
}

/* Page Content */
.page-content {
  flex: 1;
  padding: 2rem 1.5rem;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-close {
    display: block;
  }

  .sidebar-overlay {
    display: block;
  }

  .admin-main {
    margin-left: 0;
  }

  .menu-btn {
    display: block;
  }
}
</style>
