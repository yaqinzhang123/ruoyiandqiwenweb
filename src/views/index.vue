<template>
  <div class="app-container home">
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
</style>

