<template>
  <div>count: {{count}}</div>
  <button @click="handleClick">增加</button>
</template>

<script>
import { reactive, toRefs } from "vue";
export default {
  name: "App",
  setup() {
    const state = reactive({ count: 0 });
    function handleClick() {
      state.count++;
    }
    return {
      ...toRefs(state),
      handleClick,
    };
  },
};
</script>
