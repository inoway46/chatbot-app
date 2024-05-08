const app = new Vue({
  el: "#app",
  data: {
    url: "",
    roomInfoMessage: "",
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
      this.roomInfoMessage = response.data.message;
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
