<template>
  <div id="app">
    <router-view />
    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";

export default {
  name: "App",
  components: { ThemePicker },
    metaInfo() {
        return {
            title: this.$store.state.settings.dynamicTitle && this.$store.state.settings.title,
            titleTemplate: title => {
                return title ? `${title} - ${process.env.VUE_APP_TITLE}` : process.env.VUE_APP_TITLE
            }
        }
    },
    created() {
    // this.initWebSocket();
  },
  methods:{

    //app.vue
    initWebSocket() {
      let that = this;
      if ("WebSocket" in window) {
        console.log("您的浏览器支持 WebSocket!");
        that.ws = new WebSocket(`ws://192.168.30.217:8080/ws`);
        that.$globalWebSocket.setWs(that.ws);
        // that.ws.onopen = that.onopen();
        that.ws.onopen = function() {
          console.log('webSocket connect successful')
          that.ws.send("vue")
        };
        that.ws.onclose = function() {
          // 关闭 websocket
          console.log("webSocket connect closed");
          setTimeout(() => {
            that.initWebSocket();
          }, 2000);
        };
      } else {
        // 浏览器不支持 WebSocket
        console.log("您的浏览器不支持 WebSocket!");
      }
    },
  }
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
