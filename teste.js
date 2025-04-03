// Imaginary datas
url = 'http://127.0.0.1:8000/chat'
imaginary_data = {
    'from' : 'idx'
}
dict_master = {
    'id1' : {
        'data_one' : {
            'last_time' : time(),
            'checker' : false,
            'content' : []
        },
        'data_two' : {
            'last_time' : time(),
            'checker': true,
            'content' : []
        },
    },
    'id2' : {
        'data_one' : {
            'last_time' : time(),
            'checker' : true,
            'content' : []
        },
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
function get_last_data_identifier(user){
    if(dict_master[user]){
        i = 0
        for (element in dict_master[user]){
            i++
        }
        return i    
    } else {
        return 0 // user history is empity
    }
}

// Primary methods
async function send_message(identify){
    number = get_last_data_identifier(identify)
    if(dict_master[identify] ['data'+(number)]){
        if (verify_last_message_time(dict_master[identify] ['data'+(number)]['last_time']) >= 3){
            // send message to url
            console.log('mensagem ' +number+' enviada!') //its just a log checker, remove later
            for(let element in dict_master){
                if(element == identify){
                    dict_master[element] = {} // reset the user temporary messages
                }
            }
        } else {
            console.log(number+': aguarde 3 segundos...')
            await sleep(3)
            number2 = get_last_data_identifier(identify)
            if (dict_master[identify] ['data'+(number)] == dict_master[identify] ['data'+(number2)]){
                send_message(identify)
            }
        }
    }
}
function newData(new_data){
    number = get_last_data_identifier(new_data['from'])

    if(!dict_master[new_data['from']]){
        dict_master[new_data['from']] = {}
    }

    dict_master[new_data['from']]['data'+(number+1)] = {
        'last_time': time(),
        'content' : new_data
    }
    send_message(new_data['from'])
}


async function testing(){
    newData(imaginary_data) // msg 1
    await sleep(1)
    newData(imaginary_data) // msg 2
    await sleep(1)
    newData(imaginary_data) // msg 3 (sent)
    await sleep(3.5)
    newData(imaginary_data) // msg 1 (sent)
}
testing()

/** Final Remarks 4/2/25
 - A variável de checagem não é necessária, uma vez que tal funcionalidade pode ser feita a partir das horas registradas
 - É necessário verificar o motivo da função "send_message" estar sendo executada inúmeras vezes, provavelmente por falha de lógica no verificador da linha 67.
 */