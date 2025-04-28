<script setup lang="ts">
import AppNav from '@/components/common/nav/AppNav.vue';
import AppSideNav from '@/components/common/sidenav/AppSideNav.vue';
</script>

<template>
  <main data-test-id="dashboard-layout">
    <AppNav />
    <div class="md:flex my-4 mx-10">
      <AppSideNav />
      <div class="bg-white p-4 shadow-sm text-sm w-full overflow-hidden">
        <slot />
      </div>
    </div>
  </main>
</template>
