<template>
  <div class=''>
    Recommend
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { getRecommend } from '../service/recommend';

export default defineComponent({
  name: 'Recommend',
  props: {},
  setup (props) {
    const sliders = ref([]);
    const albums = ref([]);
    const loadRecommend = async () => {
      const data = await getRecommend();
      sliders.value = data.sliders;
      albums.value = data.albums;
      console.log('recommend: ', data);
    };

    onMounted(loadRecommend);

    return {
      sliders,
      albums
    };
  }
});
</script>

<style lang="scss">

</style>
