import { ref, watch, nextTick, computed } from 'vue';
export default function useFixed (props) {
  const TITLE_HEIGHT = 30;
  const groupRef = ref(null);
  const scrollY = ref(0);
  const currentIndex = ref(0);
  const listHeights = ref([]);
  const distance = ref(0);

  // 根据当前分组索引，计算当前要显示的title
  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return '';
    }
    const currentGroup = props.data[currentIndex.value];
    return currentGroup ? currentGroup.title : '';
  });

  const fixedStyle = computed(() => {
    const distanceVal = distance.value;
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0;
    return {
      transform: `translate3d(0, ${diff}px, 0)`
    };
  });

  // 当数据变化时， 计算根据数据渲染的dom的高度集合
  watch(() => props.data, async () => {
    await nextTick();
    calculate();
  });

  // 根据滚动的Y轴的值，计算当前落在哪个分组;
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value;
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      const heightTop = listHeightsVal[i];
      const heightBottom = listHeightsVal[i + 1];
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i;
        distance.value = heightBottom - newY;
      }
    }
  });

  function calculate() {
    const list = groupRef.value.children;
    const listHeightsVal = listHeights.value;
    let height = 0;
    listHeightsVal.length = 0;
    listHeightsVal.push(height);

    for (let i = 0; i < list.length; i++) {
      height += list[i].clientHeight;
      listHeightsVal.push(height);
    }
  }

  function onScroll(position) {
    scrollY.value = -position.y;
  }
  return {
    groupRef,
    fixedTitle,
    fixedStyle,
    currentIndex,
    onScroll
  };
}
