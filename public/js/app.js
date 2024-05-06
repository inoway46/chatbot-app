const app = new Vue({
  el: '#app',
  data: {
    url: '',
    roomInfoMessage: '',
    errorMessage: ''
  },
  methods: {
    async fetchRoomInfo() {
      const response = await axios.post('/api/get-room-info', { url: this.url });
      if (response.data.error_message !== undefined) {
        this.errorMessage = response.data.error_message;
        return;
      }
      this.errorMessage = '';
      this.roomInfoMessage = response.data.message;
    }
  }
});
