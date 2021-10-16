<template>
    <div class='singer' v-loading="!singers.length">
      <index-list :data="singers"></index-list>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { getSingerList } from '@/service/singer';
import IndexList from '@/components/base/index-list/index.vue';
export default defineComponent({
  name: 'Singer',
  setup (props) {
    const singers = ref([]);
    const loadSingers = async () => {
      const data = await getSingerList();
      singers.value = data.singers;
      console.log(data);
    };

    onMounted(loadSingers);

    return {
      singers
    };
  },
  components: { IndexList }
});
</script>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
