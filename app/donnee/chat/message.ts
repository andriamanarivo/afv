export class Message {
    constructor(
        public id = '',
        public from = '',
        public to = '',
        public type = '',
        public body = '',
        public timestamp ,
        public messageDate = '',
        public status = '',
        public hasDelay = false,
        public room = ''
    ) {}
}
