dict_master = {
    'id1' : {
        'checker' : true,
        'last_time' : 'time()',
        'data_one' : [],
        'data_two' : [],
    },
    'id2' : {
        'checker' : true,
        'last_time' : 'time()',
        'data_one' : [],
    },
}
dict2 = {
    'id1' : {
        'checker' : true,
        'last_time' : 'time()',
        'data_one' : [],
        'data_two' : [],
    }
}
x = dict_master['id1']
y = dict2['id1']
if(x == y){
    console.log('yes!')
} else {
    console.log('no!')
}