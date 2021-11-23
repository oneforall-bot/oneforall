module.exports = async (oneforall, message) =>{
    oneforall.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null,
        date: new Date().toLocaleString('fr-FR', {dataStyle: 'full', timeStyle: 'short'})
    })
}
