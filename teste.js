dict_master = {
    'user_one' : {
        'id' : data_first['id'],
        'last_time' : time(),
        'data_one' : [],
        'data_two' : [],
    },
    'user_two' : {
        'id' : data_first['id'],
        'last_time' : time(),
        'data_one' : [],
    },
}

checker = true
new_data = []
url = 'http://127.0.0.1:8000/chat'

for(i = 0;i < dict_master.length();i++){
    if (new_data['id'] == dict_master[i].id ){
        if( verify_last_message_time(dict_master[i].last_time) <= 3){
            dict_master[i]['data'+str(i)] = new_data
            checker = false
        } else {
            send_message(dict_master)
        }
    } else {
        user = {}
        user['id'] = new_data['id']
        user['last_time'] = time()
        user['data'+str(i)] = new_data
        dict_master['user' + str(i)] = user
        send_message(dict_master)
    }
};

function verify_last_message_time(timestamp){
    return time() - timestamp;
}

async function send_message(content){
    sleep(3)
    if (checker == true){

    }
    dict_master = {}
}