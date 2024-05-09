const app = new Vue({
  el: "#app",
  data: {
    url: "https://suumo.jp/chintai/jnc_000090434455/?bc=100379768366",
    newMessage: "",
    roomInfoError: "",
  },
  methods: {
    async fetchRoomInfo() {
      const response = await axios.post("/api/get-room-info", {
        url: this.url,
      });
      if (response.data.error_message !== undefined) {
        this.roomInfoError = response.data.error_message;
        return;
      }
      this.roomInfoError = "";
      this.newMessage = response.data.message;
    },
  },
  watch: {
    url() {
      if (this.url.includes("https://suumo.jp/chintai/")) {
        this.roomInfoError = "";
      }
    },
  },
});
