import { ref, computed } from 'vue';

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 18;
  // 需要拿到scroll组件的实例
  const scrollRef = ref(null);

  // 计算快捷图标列表
  const shortcutList = computed(() => {
    return props.data.map(group => {
      return group.title;
    });
  });

  const touch = {};

  // 点击时间处理， 拿到图标索引，查找索引对应dom元素并滚动过去
  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index);
    touch.y1 = e.touches[0].pageY;
    touch.anchorIndex = anchorIndex;
    scrollToElement(anchorIndex);
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY;
    // |0 表示向下取整，与Math.floor()作用相同
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0;
    const anchorIndex = touch.anchorIndex + delta;
    scrollToElement(anchorIndex);
  }

  function scrollToElement(index) {
    if (isNaN(index)) {
      return;
    }
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index));
    const targetGroupEl = groupRef.value.children[index];
    const scroll = scrollRef.value.scroll;
    scroll.scrollToElement(targetGroupEl, 0);
  }

  return {
    scrollRef,
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove
  };
}
