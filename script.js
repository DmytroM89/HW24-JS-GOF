class PubSub {
    constructor() {
        this.handlers = [];
    }

    subscribe(event, handler, context) {
        if (typeof context === 'undefined') { context = handler; }
        this.handlers.push({ event: event, handler: handler.bind(context) });
    }

    publish(event, msg, sender) {
        this.handlers.forEach((topic) => {
            if (topic.event === event) {
                topic.handler(msg, sender)
            }
        })
    }
}

class Rose {
    constructor(pubsub) {
        this.name = 'Rose';
        this.pubsub = pubsub;
        this.pubsub.subscribe('event-message', this.emitMessage, this);
    }

    emitMessage(msg, sender) {
        console.log(sender + ': ', msg);
        const event = sender === 'Jack' ? 'rose-billy' : 'rose-jack';
        this.sendMessage(event, `I'm happy with ${sender}`);
    }

    sendMessage(event, msg) {
        this.pubsub.publish(event, msg, this.name);
    }
}

class Billy {
    constructor(pubsub) {
        this.name = 'Billy';
        this.pubsub = pubsub;
        this.pubsub.subscribe('rose-billy', this.emitMessage, this);
    }

    emitMessage(msg, sender) {
        console.log(sender + ': ' + msg);
        console.log(`${this.name} left the chat`);
    }

    sendMessage(event, msg) {
        this.pubsub.publish(event, msg, this.name);
    }
}

class Jack {
    constructor(pubsub) {
        this.name = 'Jack';
        this.pubsub = pubsub;
        this.pubsub.subscribe('rose-jack', this.emitMessage, this);
    }

    emitMessage(msg, sender) {
        console.log(sender + ': ' + msg);
        if (sender === 'Rose') {
            console.log(`${this.name} left the chat`);
        }

    }

    sendMessage(event, msg) {
        this.pubsub.publish(event, msg, this.name);
    }
}

const pubsub = new PubSub();
const rose = new Rose(pubsub);
const billy = new Billy(pubsub);
const jack = new Jack(pubsub);

jack.sendMessage('event-message', 'Rose how are you doing?');