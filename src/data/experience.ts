import type { Experience } from '../types'

export const experiences: Experience[] = [
  {
    company: 'InnoTech',
    role: 'Co-Founder & Fullstack Developer',
    description:
      'Memimpin pengembangan teknis dan strategi bisnis software house di Sumenep. Bertanggung jawab atas arsitektur sistem, pengembangan web fullstack, IoT, dan konsultasi IT untuk klien lokal.',
    startDate: '2024-01',
    endDate: undefined,
    isCurrent: true,
    location: 'Sumenep, Madura',
    type: 'WORK',
  },
  {
    company: 'Universitas Wiraraja Madura',
    role: 'Pemateri ITClass — IoT',
    description:
      'Mengajar materi Internet of Things kepada mahasiswa, mencakup dasar ESP32, sensor, protokol MQTT, dan implementasi sistem IoT sederhana. Membuat modul praktikum interaktif berbasis HTML.',
    startDate: '2024-02',
    endDate: '2024-08',
    isCurrent: false,
    location: 'Sumenep, Madura',
    type: 'WORK',
  },
  {
    company: 'Madura Store',
    role: 'Teknisi — Magang',
    description:
      'Melakukan diagnosis dan perbaikan perangkat keras laptop, instalasi sistem operasi, troubleshooting software, dan pelayanan pelanggan di pusat service laptop.',
    startDate: '2023-06',
    endDate: '2023-08',
    isCurrent: false,
    location: 'Sumenep, Madura',
    type: 'INTERNSHIP',
  },
  {
    company: 'Universitas Negeri Yogyakarta',
    role: 'Mahasiswa Pertukaran — PMM',
    description:
      'Mengikuti program Pertukaran Mahasiswa Merdeka (PMM) di Universitas Negeri Yogyakarta. Mengambil mata kuliah lintas prodi dan aktif dalam kegiatan akademik maupun sosial budaya.',
    startDate: '2023-02',
    endDate: '2023-06',
    isCurrent: false,
    location: 'Yogyakarta',
    type: 'ORGANIZATION',
  },
]
