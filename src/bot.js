import { resolve } from 'path'
import { Duplex } from 'stream'
import Twitch from 'twitch-js'
import notifier from 'node-notifier'
import { token, username, channels } from '../options'

class Bot extends Duplex {
  constructor(opts = {}) {
    super(opts)
    chat.on(PRIVATE_MESSAGE, data => {
      this.notification = {
        title: data.username,
        icon: resolve('icon.png'),
        message: data.message
      }
      this.push(data, this.encoding)
    })
  }
  _write(chunk, encoding, callback) {
    if (Buffer.isBuffer(chunk)) {
      chunk = chunk.toString(encoding)
    }
    channels.forEach(async channel => {
      const { username } = await chat.say(channel, chunk)
      this.notification = null
      this.push({ username, message: chunk }, this.encoding)
    })
    callback()
  }
  _read() {
    if (!this.notification) return
    notifier.notify(this.notification)
  }
}

const {
  chat,
  chatConstants: {
    EVENTS: { PRIVATE_MESSAGE }
  }
} = new Twitch({
  token,
  username,
  log: { level: 0 }
})
;(async () => {
  await chat.connect()
  channels.forEach(channel => chat.join(channel))
})()

export default new Bot({ objectMode: true })
