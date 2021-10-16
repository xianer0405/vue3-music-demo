<template>
  <m-header></m-header>
  <tab></tab>
  <router-view></router-view>
</template>
<script>
import { defineComponent } from 'vue';
import Header from '@/components/header/header.vue';
import Tab from '@/components/tab/tab.vue';

export default defineComponent({
  components: {
    MHeader: Header,
    Tab
  }
});

</script>
