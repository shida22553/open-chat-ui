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
      userId: null,
      userName: 'NONAME',
      rooms: [],
      selectedRoomId: null,
      roomName: null
    }
  },
  async mounted() {
    const self = this

    // user settings
    const userId = Cookies.get('user_id')
    if (userId != undefined && userId != null && userId !== '') {
      self.userId = userId
    } else {
      await instance.get('/users/hash')
        .then(function (response) {
          console.log(response)
          self.userId = response.data.hash
          Cookies.set('user_id', response.data.hash)
        })
        .catch(function (error) {
        })
    }
    const userName = Cookies.get('user_name')
    if (userName != undefined && userName != null && userName !== '') {
      self.userName = userName
    }

    // load rooms
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
    },
    saveUserName(){
      if (this.userName !== '') {
        Cookies.set('user_name', this.userName)
      }
    }
  },
  computed: {
  }
})
