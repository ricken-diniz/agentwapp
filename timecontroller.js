export class TimeController {
// auxiliaries functions
    sleep(seconds) {
        seconds = seconds * 1000
        return new Promise(resolve => setTimeout(resolve, seconds));
    }
    time() {
        return Math.floor(Date.now() / 1000)
    }
    verify_last_message_time(first_time, second_time) {
        return second_time - first_time;
    }
    get_last_data_identifier(user) {
        if (dict_master[user]) {
            i = 0
            for (element in dict_master[user]) {
                i++
            }
            return i
        } else {
            return 0 // user history is empity
        }
    }

    // Primary methods
    async send_message(identify) {
        number = get_last_data_identifier(identify)
        if (dict_master[identify]['data' + (number)]) {
            try {
                time_of_last_message = verify_last_message_time(dict_master[identify]['data' + (number - 1)]['last_time'], dict_master[identify]['data' + (number)]['last_time']);
            } catch (error) {
                time_of_last_message = 'undefined'
            }
            console.log('time_of_last_message: ' + time_of_last_message)
            if ((time_of_last_message != 'undefined' && time_of_last_message >= time_drop) || verify_last_message_time(dict_master[identify]['data' + (number)]['last_time'], time()) >= time_drop) {
                // send message to url
                console.log('mensagem ' + number + ' enviada!') //its just a log checker, remove later
                for (let element in dict_master) {
                    if (element == identify) {
                        dict_master[element] = {} // reset the user temporary messages
                    }
                }
                return true
            } else {
                console.log(number + ': aguarde ' + time_drop + ' segundos...')
                await sleep(time_drop)
                // CAUTION, in here number dont be yet the number that was three seconds ago
                time_of_last_message2 = verify_last_message_time(dict_master[identify]['data' + (number)]['last_time'], time());
                console.log('x: ' + time_of_last_message2)
                console.log('y: ' + time_of_last_message)
                if (time_of_last_message2 >= time_drop) {
                    console.log('again')
                    send_message(identify)
                }

                // if (dict_master[identify] ['data'+(number)] == dict_master[identify] ['data'+(number2)]){
                //     send_message(identify)
                // }
            }
        }
    }
    newData(new_data) {
        number = get_last_data_identifier(new_data['from'])

        if (!dict_master[new_data['from']]) {
            dict_master[new_data['from']] = {}
        }

        dict_master[new_data['from']]['data' + (number + 1)] = {
            'last_time': time(),
            'content': new_data
        }
        send_message(new_data['from'])
    }
}