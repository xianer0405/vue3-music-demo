<template>
  <div class="recommend" v-loading="loading">
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic">
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{item.title}}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedAlbum"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import Slider from '@/components/base/slider/slider';
import Scroll from '@/components/wrap-scroll';
import { getRecommend } from '../service/recommend';
import storage from 'good-storage';
import { ALBUM_KEY } from '@/assets/js/constant';

export default defineComponent({
  name: 'Recommend',
  props: {},
  setup (props) {
    const sliders = ref([]);
    const albums = ref([]);
    const selectedAlbum = ref(null);
    const loadRecommend = async () => {
      const data = await getRecommend();
      sliders.value = data.sliders;
      albums.value = data.albums;
      console.log('recommend: ', data);
    };

    onMounted(loadRecommend);

    const loading = computed(() => {
      return !sliders.value.length && !albums.value.length;
    });

    const selectItem = (album) => {
      selectedAlbum.value = album;
      cacheAlbum(album);
      this.$router.push({
        path: `/recommend/${album.id}`
      });
    };

    const cacheAlbum = (album) => {
      storage.session.set(ALBUM_KEY, album);
    };

    return {
      sliders,
      albums,
      selectedAlbum,
      loading,
      selectItem,
      cacheAlbum
    };
  },
  components: {
    Slider,
    Scroll
  }
});
</script>

<style lang="scss" scoped>
  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: scroll;
    .recommend-content {
      height: 100%;
      overflow: hidden;
      .slider-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 40%;
        overflow: hidden;
        .slider-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }
      .recommend-list {
        .list-title {
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-theme;
        }
        .item {
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;

          .icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;
          }
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .title {
            color: $color-text-d;
          }
        }
      }
    }
  }
</style>
