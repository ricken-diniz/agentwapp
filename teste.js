
// Imaginary datas
const dict_master = {}
export class TimeController {
    // auxiliaries functions
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
        let number = this.get_last_data_identifier(identify)
        if (dict_master[identify]['data' + (number)]) {
            if (this.verify_last_message_time(dict_master[identify]['data' + (number)]['last_time']) >= 3) {
                // send message to url
                console.log('mensagem ' + number + ' enviada!') //its just a log checker, remove later
                for (let element in dict_master) {
                    if (element == identify) {
                        let response = dict_master[element]
                        console.log(dict_master)
                        console.log(response)
                        dict_master[element] = {} // reset the user temporary messages
                        console.log(response)
                        return response
                    }
                }
            } else {
                console.log(number + ': aguarde 3 segundos...')
                await this.sleep(3)
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



/** Final Remarks 4/2/25
 - A variável de checagem não é necessária, uma vez que tal funcionalidade pode ser feita a partir das horas registradas
 - É necessário verificar o motivo da função "send_message" estar sendo executada inúmeras vezes, provavelmente por falha de lógica no verificador da linha 67.
 */