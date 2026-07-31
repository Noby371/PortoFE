<script setup lang="ts">
import NavBar from '../components/NavBar.vue'
import HeroSection from '../components/HeroSection.vue'
import AboutSection from '../components/AboutSection.vue'
import SkillsSection from '../components/SkillsSection.vue'
import EducationSection from '../components/EducationSection.vue'
import ProjectsSection from '../components/ProjectsSection.vue'
import ExperianceSection from '../components/ExperianceSection.vue'
import CertificatesSection from '../components/CertificatesSection.vue'
import ContactSection from '../components/ContactSection.vue'
import FooterSection from '../components/FooterSection.vue'
import HireModal from '../components/HireModal.vue'
</script>

<template>
  <NavBar />
  <HireModal />
  <main>
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <EducationSection />
    <ProjectsSection />
    <ExperianceSection />
    <CertificatesSection />
    <ContactSection />
    <FooterSection />
  </main>
</template>
