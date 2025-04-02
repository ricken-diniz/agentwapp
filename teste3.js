function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

checker = false

while(checker == false){
    console.log('oi')
    checker = true
    checker = false
    checker = true
    sleep(3000)
    console.log('ximbinha')
}
