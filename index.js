const instance = axios.create({
  baseURL: 'https://evening-ravine-22261.herokuapp.com/v1/',
  // baseURL: 'http://0.0.0.0:3000/v1/',
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
      reactions: [],
      selectedRoomId: null,
      roomName: null,
      content: null,
      messages: [],
      mode: 'user-name-form'
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

    // load reactions
    await instance.get('/reactions')
      .then(function (response) {
        self.reactions = response.data
      })
      .catch(function (error) {
      })

    // load messages
    await self.loadLastMessage()
    this.scrollToBottom()

    // set interval
    setInterval(() => {
      const lastMessage = self.messages[self.messages.length - 1]
      if (lastMessage != null) {
        self.loadMessageAfter(lastMessage.id)
      }
    }, 2000)
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
      await self.loadLastMessage()
      this.scrollToBottom()
      this.mode = 'chat-form'
    },
    saveUserName() {
      if (this.userName !== '') {
        Cookies.set('user_name', this.userName)
      }
      this.mode = 'chat-form'
    },
    async createMessage() {
      const self = this
      if (self.userName === '') {
        self.userName = 'NONAME'
      }
      const currentLastMessage = self.messages[self.messages.length - 1]
      if (currentLastMessage != null) {
        await self.loadMessageAfter(currentLastMessage.id)
      }
      await instance.post(`/rooms/${self.selectedRoomId}/messages`, {
        user_id: self.userId,
        user_name: self.userName,
        content: self.content,
        content_type: 0
      })
        .then(function (response) {
          self.content = ''
          self.messages.push(response.data)
          this.scrollToBottom()
        })
        .catch(function (error) {
        })
      const lastMessage = self.messages[self.messages.length - 1]
      await self.loadMessageAfter(lastMessage.id)
    },
    async loadLastMessage() {
      const self = this
      await instance.get(`/rooms/${self.selectedRoomId}/messages`)
        .then(function (response) {
          self.messages = response.data.reverse()
        })
        .catch(function (error) {
        })
    },
    async loadMessageBefore() {
      const self = this
      const nextMessageId = self.messages[0].id
      await instance.get(`/rooms/${self.selectedRoomId}/messages?next_message_id=${nextMessageId}`)
        .then(function (response) {
          self.messages.splice(0, 0, ...response.data.reverse())
        })
        .catch(function (error) {
        })
    },
    async loadMessageAfter(prevMessageId) {
      const self = this
      await instance.get(`/rooms/${self.selectedRoomId}/messages?prev_message_id=${prevMessageId}`)
        .then(function (response) {
          self.messages.splice(self.messages.length, 0, ...response.data.reverse())
        })
        .catch(function (error) {
        })
      this.scrollToBottom()
    },
    scrollToBottom() {
      const element = document.getElementById('messages');
      const bottom = element.scrollHeight - element.clientHeight
      element.scroll(0, bottom)
    },
    async sendReaction(message, reaction) {
      const self = this
      if (self.isReactionSent(message, reaction)) return
      if (self.userName === '') {
        self.userName = 'NONAME'
      }
      await instance.put(`/rooms/${self.selectedRoomId}/messages/${message.id}/reactions`, {
        user_id: self.userId,
        user_name: self.userName,
        reaction_id: reaction.id
      })
        .then(function (response) {
          message.message_reactions.push(response.data)
        })
        .catch(function (error) {
        })
    },
    isReactionSent(message, reaction) {
      return message.message_reactions.some((message_reaction) => {
        return message_reaction.user_id === this.userId && message_reaction.reaction.id == reaction.id
      })
    }
  },
  computed: {
  }
})
