
import { createChatCollector } from './timecontroller.js';

function sleep(seconds) {
    seconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, seconds));
}

const imaginary_data = {
    'from': 'idx'
}
async function testing(){
    const controller = createChatCollector();

    controller.addMessage(imaginary_data);
    await sleep(1);
    controller.addMessage(imaginary_data);
    await sleep(1);
    controller.addMessage(imaginary_data);
    await sleep(4);
    controller.promise.then(result => {
        console.log("Todas as mensagens recebidas:", result);
      });
    controller.addMessage(imaginary_data);
    controller.promise.then(result => {
        console.log("Todas as mensagens recebidas:", result);
      });
}

testing()