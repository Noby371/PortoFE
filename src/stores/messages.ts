import { defineStore } from 'pinia'
import api from '../services/api'

interface UnreadLatest {
  id: number
  name: string
  subject: string
}

export const useMessagesStore = defineStore('messages', {
  state: () => ({
    unreadCount: 0,
    latest: null as UnreadLatest | null,
    loaded: false,
  }),

  actions: {
    async refresh() {
      try {
        const res = await api.get('/contact/messages/unread-summary')
        this.unreadCount = res.data.count ?? 0
        this.latest = res.data.latest ?? null
        this.loaded = true
      } catch {
        // Abaikan — polling tidak boleh memunculkan error UI
      }
    },
  },
})
