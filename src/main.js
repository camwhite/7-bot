import bot from './bot'
import term, { stream } from './term'

bot.on('data', term)
stream.pipe(bot)
