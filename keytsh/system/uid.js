export const UidGenerator = () => ({
  generate() {
    while (true) {
      let head = (Math.random() * 46656) | 0
      let tail = (Math.random() * 46656) | 0

      head = ('000' + head.toString(36)).slice(-3)
      tail = ('000' + tail.toString(36)).slice(-3)

      const uid = head + tail

      if (!this.hasOwnProperty(uid)) {
        this[uid] = true

        return uid
      }
    }
  },
})
