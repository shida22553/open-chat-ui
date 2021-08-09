// var app = new Vue({
//   el: '#app',
//   data() {
//     return {
//       intervalId: null,
//       inputIntervalMinutes: 15,
//       intervalMinutes: 15,
//       seconds: 15 * 60,
//       isActive: false,
//       seAudio: null,
//     }
//   },
//   mounted() {
//     this.seAudio = new Audio('se.mp3')
//   },
//   methods: {
//     tick() {
//       this.seconds -= 1
//       if (this.seconds < 0) {
//         this.playSe()
//         this.reset()
//       }
//     },
//     start() {
//       this.intervalId = setInterval(() => {
//         this.tick()
//       }, 1000)
//       this.isActive = true
//     },
//     stop() {
//       clearInterval(this.intervalId)
//       this.isActive = false
//     },
//     setIntervalSeconds() {
//       this.stop()
//       this.intervalMinutes = this.inputIntervalMinutes
//       this.reset()
//     },
//     reset() {
//       this.seconds = this.intervalMinutes * 60
//     },
//     playSe() {
//       this.seAudio.currentTime = 0
//       this.seAudio.play()
//     }
//   },
//   computed: {
//     timeStr() {
//       const minutes = ('0' + Math.floor(this.seconds / 60)).slice(-2)
//       const seconds = ('0' + this.seconds % 60).slice(-2)
//       return `${minutes}:${seconds}`
//     },
//     inputIntervalMinutesValid() {
//       return this.inputIntervalMinutes !== '' && this.inputIntervalMinutes < 100
//     }
//   }
// })
