<template>
  <div class="about-page">
    <PageHeader />
    <HeroSection />
    <TwtMeaningSection />
    <WhyChooseSection />
    <CoreValuesSection />
    <TimelineSection />
    <CtaSection />
    <PageFooter />
  </div>
</template>

<script setup lang="ts">
import PageHeader from '../components/about/PageHeader.vue'
import HeroSection from '../components/about/HeroSection.vue'
import TwtMeaningSection from '../components/about/TwtMeaningSection.vue'
import WhyChooseSection from '../components/about/WhyChooseSection.vue'
import CoreValuesSection from '../components/about/CoreValuesSection.vue'
import TimelineSection from '../components/about/TimelineSection.vue'
import CtaSection from '../components/about/CtaSection.vue'
import PageFooter from '../components/about/PageFooter.vue'
</script>

<style scoped>
.about-page {
  background: #fff;
  min-height: 100vh;
}
</style>
