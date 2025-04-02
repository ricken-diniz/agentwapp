// Imaginary datas
url = 'http://127.0.0.1:8000/chat'
imaginary_data = {
    'from' : 'idx'
}
dict_master = {
    'id1' : {
        'checker' : true,
        'last_time' : time(),
        'data_one' : [],
        'data_two' : [],
    },
    'id2' : {
        'checker' : true,
        'last_time' : time(),
        'data_one' : [],
    },
}

// auxiliaries functions
function sleep(seconds) {
    seconds = seconds*1000 
    return new Promise(resolve => setTimeout(resolve, seconds));
}
function time(){
    return Math.floor(Date.now() / 1000)
}
function verify_last_message_time(timestamp){
    return time() - timestamp;
}

// Primary methods
async function send_message(content){
    if (dict_master[content]['checker'] == true){
        // send message to url
        console.log('mensagem enviada!')
        for(let element in dict_master){
            if(element == content){
                dict_master[element] = {} // reset the user temporary messages
            }
        }
    } else {
        console.log('aguarde 3 segundos...')
        dict_master[content]['checker'] = true
        await sleep(3)
        if(dict_master[content]['checker'] == true){
            send_message(content)
        }
    }
}
function newData(new_data){
    if(new_data['from'] in dict_master){
        user = dict_master[new_data['from']]
        if(verify_last_message_time(user['last_time']) <= 3){
            user['data'+time()] = new_data
            user['checker'] = false
        } 
        send_message(new_data['from'])
    } else { // user never been defined
        dict_master[new_data['from']] = {
            'checker': false,
            'last_time': time(),
            'data{time()}' : new_data
        };
        console.log(dict_master[new_data['from']])
        send_message(new_data['from'])
    }
}


async function testing(){
    newData(imaginary_data)
    await sleep(1)
    newData(imaginary_data)
    await sleep(1)
    newData(imaginary_data)
    await sleep(3.5)
    newData(imaginary_data)
}
testing()

/** Final Remarks 4/1/25
 *  - Provavelmente será necessário um checker para cada data, de tal forma, irá impedir que um conjuto de mensagens seja enviada mais de uma vez.
 *  - Se cada data tiver um checker, será possível verificar se aquela mensagem em específico foi a última a ser enviada nos últimos 3 segundos.
 * 
 */