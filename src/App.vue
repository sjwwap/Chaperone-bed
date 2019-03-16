<template>
  <div id="app">
    <transition :name="transitionName"><router-view></router-view></transition>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      transitionName:""
    };
  },
  watch: {
    $route(to, from) {
      console.log(to);
      let toName = to.name;

      const toIndex = to.meta.index;
      const fromIndex = from.meta.index;
      if (toIndex == fromIndex) {
        this.transitionName = "none";
      } else {
        this.transitionName =
          toIndex < fromIndex ? "slide-right" : "slide-left";
      }
    }
  },
  created() {
    document.body.removeChild(document.getElementById("Loading"));
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}

.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
