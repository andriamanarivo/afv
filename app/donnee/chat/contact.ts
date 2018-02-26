export class Contact {
    constructor(
        public jid = '',
        public name = '',
        public uid = '',
        public pdp = '',
        public roomJid = '',
        public unreadMessageCount = 0,
        public status = 'offline', //offline online dnd away
        public currentMessageTimestamp,
        public currentMessageContent = '',
        public currentMessageRelativeDate = '',
        public defaultpdp = 'assets/img/profil-default.png',
        public vEtes = null,
        public isTyping = false

    ) {}
}
