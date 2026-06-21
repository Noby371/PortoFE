import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── Public ──────────────────────────────────────────────────────────────
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },

    // ── Admin ────────────────────────────────────────────────────────────────
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('../views/admin/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('../views/admin/DashboardView.vue'),
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('../views/admin/ProfileView.vue'),
        },
        {
          path: 'skills',
          name: 'admin-skills',
          component: () => import('../views/admin/SkillsView.vue'),
        },
        {
          path: 'projects',
          name: 'admin-projects',
          component: () => import('../views/admin/ProjectsView.vue'),
        },
        {
          path: 'experience',
          name: 'admin-experience',
          component: () => import('../views/admin/ExperienceView.vue'),
        },
        {
          path: 'education',
          name: 'admin-education',
          component: () => import('../views/admin/EducationView.vue'),
        },
        {
          path: 'certificates',
          name: 'admin-certificates',
          component: () => import('../views/admin/CertificatesView.vue'),
        },
        {
          path: 'messages',
          name: 'admin-messages',
          component: () => import('../views/admin/MessagesView.vue'),
        },
      ],
    },
  ],

  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
})

// ── Navigation Guard ───────────────────────────────────────────────────────
router.beforeEach((to, _from) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'admin-login' }
  }

  if (to.meta.requiresGuest && auth.isAuthenticated) {
    return { name: 'admin-dashboard' }
  }
})

export default router
