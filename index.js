const instance = axios.create({
  baseURL: 'https://evening-ravine-22261.herokuapp.com/v1/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  responseType: 'json'  
})

new Vue({
  el: '#app',
  data() {
    return {
      rooms: [],
      selectedRoomId: null,
      roomName: null
    }
  },
  async mounted() {
    const self = this
    await instance.get('/rooms')
      .then(function (response) {
        self.rooms = response.data
        if (self.rooms.length == 0) return
        self.selectedRoomId = self.rooms[self.rooms.length - 1].id
      })
      .catch(function (error) {
      })
  },
  methods: {
    async createRoom() {
      const self = this
      await instance.post('/rooms', {
        name: self.roomName
      })
        .then(function (response) {
          self.rooms.push(response.data)
          self.selectedRoomId = response.data.id
          self.roomName = ''
        })
        .catch(function (error) {
        })
    }
  },
  computed: {

  }
})
