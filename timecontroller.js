

export function createChatCollector() {
    let chatMessages = {};
    let timerId = null;
    let resolvePromise;

    const promise = new Promise((resolve) => {
        resolvePromise = resolve;
    });

    function addMessage(message) {
        chatMessages[message['from']] = message;
        if (timerId) {
            clearTimeout(timerId);
        }

        timerId = setTimeout(() => {
            resolvePromise({ chatMessages });
            chatMessages = {};
        }, 3000);
    }
    return { addMessage, promise };
}
