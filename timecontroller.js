export class TimeController {
    // auxiliaries functions
    time_drop = 3
    sleep(seconds) {
        seconds = seconds * 1000
        return new Promise(resolve => setTimeout(resolve, seconds));
    }
    time() {
        return Math.floor(Date.now() / 1000)
    }
    verify_last_message_time(timestamp) {
        return this.time() - timestamp;
    }
    get_last_data_identifier(user) {
        if (dict_master[user]) {
            let i = 0
            for (let element in dict_master[user]) {
                i++
            }
            return i
        } else {
            return 0 // user history is empity
        }
    }
    
    // Primary methods
    async send_message(identify) {
        const url = require('./config.json').python_api_url
        let number = this.get_last_data_identifier(identify)
        if (dict_master[identify]['data' + (number)]) {
            if (this.verify_last_message_time(dict_master[identify]['data' + (number)]['last_time']) >= time_drop) {
                // send message to url
                for (let element in dict_master) {
                    if (element == identify) {
                        fetch(url, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(dict_master[element])
                          })
                            .then(response => response.json())
                            .then(data => {
                              msg.reply(data.message); // Exibe o valor da chave 'message' !!CAUNTION!! 'msg' is not defined in this context
                            })
                            .catch(error => console.log('Erro:', error));
                        console.log('mensagem ' + number + ' enviada!') //its just a log checker, remove later
                        dict_master[element] = {} // reset the user temporary messages
                    }
                }
            } else {
                console.log(number + ': aguarde 3 segundos...')
                await this.sleep(time_drop)
                let number2 = this.get_last_data_identifier(identify)
                if (dict_master[identify]['data' + (number)] == dict_master[identify]['data' + (number2)]) {
                    this.send_message(identify)
                }
            }
        }
    }
    newData(new_data) {
        let number = this.get_last_data_identifier(new_data['from'])

        if (!dict_master[new_data['from']]) {
            dict_master[new_data['from']] = {}
        }
        
        dict_master[new_data['from']]['data' + (number + 1)] = {
            'last_time': this.time(),
            'content': new_data
        }
        this.send_message(new_data['from'])
    }
}