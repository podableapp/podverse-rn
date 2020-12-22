// tslint:disable:no-string-literal
import linkifyHtml from 'linkifyjs/html'

String.prototype.linkifyHtml = function() {
  return this ? linkifyHtml(this) : ''
}

const badWordsRegexObj = require('badwords-list').object
delete badWordsRegexObj['God']
badWordsRegexObj['dicks'] = 1
const badWordsRegexString = `\\b(${Object.keys(badWordsRegexObj).join('|')})\\b`
const badWordsRegex = new RegExp(badWordsRegexString, 'gi')

String.prototype.sanitize = function(nsfw: boolean) {
  return nsfw && this
    ? this.replace(badWordsRegex, function(a) {
        return '*'.repeat(a.length)
      }).toString()
    : this.toString()
}
