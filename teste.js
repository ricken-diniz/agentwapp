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

// checker = true
new_data = {
    'from' : 'idx'
}
url = 'http://127.0.0.1:8000/chat'

if(new_data['from'] in dict_master){
    user = dict_master[new_data['from']]
    if(verify_last_message_time(user['last_time']) <= 3){
        user['data'+time()] = new_data
        user['checker'] = false
    } 
    send_message(new_data['from'])
} else { // user never been defined
    data = str('data' + time())
    dict_master[new_data['from']] = {
        'checker': false,
        'last_time': time(),
        data : new_data
    };
    send_message(new_data['from'])
}

function verify_last_message_time(timestamp){
    return time() - timestamp;
}

async function send_message(content){
    if (dict_master[content]['checker'] == true){
        // send message to url
        for(let element in dict_master){
            if(element == content){
                dict_master[element] = {} // reset the user temporary messages
            }
        }
    } else {
        sleep(3)
        dict_master[content]['checker'] = true
        send_message(content)
    }
}