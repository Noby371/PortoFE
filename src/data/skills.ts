import type { SkillGroup } from '../types'
import {
  CpuChipIcon,
  ServerIcon,
  ComputerDesktopIcon,
  CircleStackIcon,
  WrenchIcon,
} from '@heroicons/vue/24/outline'

export const skillGroups: SkillGroup[] = [
  {
    category: 'IoT & Embedded',
    icon: CpuChipIcon,
    skills: [
      { name: 'ESP32', level: 85 },
      { name: 'Arduino / C++', level: 80 },
      { name: 'MQTT Protocol', level: 75 },
      { name: 'Sensor Integration', level: 80 },
    ],
  },
  {
    category: 'Backend',
    icon: ServerIcon,
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express.js', level: 85 },
      { name: 'TypeScript', level: 80 },
      { name: 'PHP', level: 75 },
      { name: 'Laravel', level: 75 },
      { name: 'C#', level: 65 },
    ],
  },
  {
    category: 'Frontend',
    icon: ComputerDesktopIcon,
    skills: [
      { name: 'Vue.js', level: 80 },
      { name: 'HTML / CSS', level: 85 },
      { name: 'JavaScript', level: 80 },
    ],
  },
  {
    category: 'Database',
    icon: CircleStackIcon,
    skills: [
      { name: 'PostgreSQL', level: 80 },
      { name: 'MySQL', level: 80 },
      { name: 'Prisma ORM', level: 75 },
    ],
  },
  {
    category: 'Tools & Office',
    icon: WrenchIcon,
    skills: [
      { name: 'Git & GitHub', level: 80 },
      { name: 'Microsoft Word', level: 90 },
      { name: 'Microsoft Excel', level: 85 },
      { name: 'Microsoft PowerPoint', level: 85 },
      { name: 'Linux (Ubuntu)', level: 70 },
    ],
  },
]
