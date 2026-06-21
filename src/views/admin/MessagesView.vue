<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  EnvelopeIcon,
  EnvelopeOpenIcon,
  // TrashIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/24/outline'
import api from '../../services/api'

interface Message {
  id: number
  name: string
  email: string
  subject: string
  message: string
  isRead: boolean
  createdAt: string
}

const messages = ref<Message[]>([])
const isLoading = ref(true)
const successMsg = ref('')
const errorMsg = ref('')
const selectedMessage = ref<Message | null>(null)

const unreadCount = computed(() => messages.value.filter((m) => !m.isRead).length)

onMounted(fetchMessages)

async function fetchMessages() {
  isLoading.value = true
  try {
    const res = await api.get('/contact/messages?limit=100')
    messages.value = res.data.data
  } catch {
    errorMsg.value = 'Gagal memuat pesan.'
  } finally {
    isLoading.value = false
  }
}

function selectMessage(msg: Message) {
  selectedMessage.value = msg
  if (!msg.isRead) {
    markRead(msg)
  }
}

async function markRead(msg: Message) {
  try {
    await api.patch(`/contact/messages/${msg.id}/read`)
    msg.isRead = true
  } catch {
    // silent fail
  }
}


function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="messages-view">

    <!-- Header -->
    <div class="view-header">
      <div>
        <h2 class="view-title">Pesan Masuk</h2>
        <p class="view-desc">
          {{ messages.length }} pesan
          <span v-if="unreadCount > 0" class="unread-count">· {{ unreadCount }} belum dibaca</span>
        </p>
      </div>
    </div>

    <!-- Alert -->
    <Transition name="fade">
      <div v-if="successMsg" class="alert alert-success">
        <CheckCircleIcon class="alert-icon" />
        {{ successMsg }}
      </div>
      <div v-else-if="errorMsg" class="alert alert-error">
        <ExclamationTriangleIcon class="alert-icon" />
        {{ errorMsg }}
      </div>
    </Transition>

    <!-- Loading -->
    <div v-if="isLoading" class="loading">Memuat pesan...</div>

    <!-- Content -->
    <div v-else class="messages-layout">

      <!-- List -->
      <div class="messages-list">
        <div v-if="messages.length === 0" class="empty-state">
          <EnvelopeIcon class="empty-icon" />
          <p>Belum ada pesan masuk.</p>
        </div>

        <div
          v-for="msg in messages"
          :key="msg.id"
          class="message-item"
          :class="{
            unread: !msg.isRead,
            active: selectedMessage?.id === msg.id
          }"
          @click="selectMessage(msg)"
        >
          <div class="message-item-left">
            <div class="sender-avatar">
              {{ msg.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="message-item-body">
            <div class="message-item-header">
              <span class="sender-name">{{ msg.name }}</span>
              <span class="message-date">{{ formatDate(msg.createdAt) }}</span>
            </div>
            <p class="message-subject">{{ msg.subject }}</p>
            <p class="message-preview">{{ msg.message }}</p>
          </div>
          <div class="message-item-right">
            <component
              :is="msg.isRead ? EnvelopeOpenIcon : EnvelopeIcon"
              class="read-icon"
              :class="{ unread: !msg.isRead }"
            />
          </div>
        </div>
      </div>

      <!-- Detail -->
      <div class="message-detail">
        <div v-if="!selectedMessage" class="detail-empty">
          <EnvelopeIcon class="detail-empty-icon" />
          <p>Pilih pesan untuk membaca</p>
        </div>

        <div v-else class="detail-content">
          <!-- Detail Header -->
          <div class="detail-header">
            <div class="detail-sender">
              <div class="detail-avatar">
                {{ selectedMessage.name.charAt(0).toUpperCase() }}
              </div>
              <div>
                <p class="detail-name">{{ selectedMessage.name }}</p>
                <a :href="`mailto:${selectedMessage.email}`" class="detail-email">
                  {{ selectedMessage.email }}
                </a>
              </div>
            </div>
            <span class="detail-date">{{ formatDate(selectedMessage.createdAt) }}</span>
          </div>

          <!-- Subject -->
          <h3 class="detail-subject">{{ selectedMessage.subject }}</h3>

          <!-- Message -->
          <div class="detail-message">
            {{ selectedMessage.message }}
          </div>

          <!-- Reply Button -->
          <a
            :href="`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`"
            class="btn-reply"
          >
            Balas via Email ↗
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.messages-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
}

.view-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.view-desc {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  margin-top: 0.2rem;
}

.unread-count {
  color: var(--color-accent);
  font-weight: 600;
}

.alert {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
}

.alert-success {
  background: rgba(74, 222, 128, 0.1);
  border: 1px solid rgba(74, 222, 128, 0.3);
  color: #4ade80;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
}

.alert-icon {
  width: 1.1rem;
  height: 1.1rem;
  flex-shrink: 0;
}

.loading {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

/* Layout */
.messages-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 1rem;
  min-height: 500px;
}

/* List */
.messages-list {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow-y: auto;
  max-height: 600px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

.empty-icon {
  width: 2.5rem;
  height: 2.5rem;
  opacity: 0.4;
}

.message-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: all var(--transition);
  position: relative;
}

.message-item:last-child {
  border-bottom: none;
}

.message-item:hover {
  background: var(--color-bg-hover);
}

.message-item.active {
  background: var(--color-accent-dim);
  border-left: 3px solid var(--color-accent);
}

.message-item.unread {
  background: rgba(108, 99, 255, 0.04);
}

.message-item-left {
  flex-shrink: 0;
}

.sender-avatar {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.875rem;
  color: var(--color-accent);
}

.message-item-body {
  flex: 1;
  min-width: 0;
}

.message-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.2rem;
}

.sender-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-date {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.message-subject {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-preview {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 0.15rem;
}

.message-item-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.read-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-text-muted);
}

.read-icon.unread {
  color: var(--color-accent);
}

/* Detail */
.message-detail {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}

.detail-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 0.75rem;
  color: var(--color-text-muted);
  font-size: 0.875rem;
  padding: 3rem;
}

.detail-empty-icon {
  width: 3rem;
  height: 3rem;
  opacity: 0.3;
}

.detail-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.detail-sender {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.detail-avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: var(--color-accent-dim);
  border: 1px solid var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--color-accent);
  font-size: 1rem;
  flex-shrink: 0;
}

.detail-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 0.15rem;
}

.detail-email {
  font-size: 0.8rem;
  color: var(--color-accent);
  font-family: var(--font-mono);
}

.detail-email:hover {
  color: var(--color-accent-hover);
}

.detail-date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.detail-subject {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.detail-message {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.8;
  padding: 1.25rem;
  background: var(--color-bg-hover);
  border-radius: 10px;
  border: 1px solid var(--color-border);
  white-space: pre-wrap;
}

.btn-reply {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem;
  background: var(--color-accent);
  color: #fff;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all var(--transition);
  width: fit-content;
}

.btn-reply:hover {
  background: var(--color-accent-hover);
  color: #fff;
  transform: translateY(-1px);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .messages-layout {
    grid-template-columns: 1fr;
  }

  .messages-list {
    max-height: 300px;
  }
}
</style>
