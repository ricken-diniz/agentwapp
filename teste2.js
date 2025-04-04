
import { TimeController } from './teste.js';
const tc = new TimeController

const imaginary_data = {
    'from': 'idx'
}

async function testing(){
    let a = tc.newData(imaginary_data) // msg 1
    console.log(a)
    await tc.sleep(1)
    let b = tc.newData(imaginary_data) // msg 2
    console.log(b)
    await tc.sleep(1)
    let c = tc.newData(imaginary_data) // msg 3 (sent)
    console.log(c)
    await tc.sleep(3.5)
    let d = tc.newData(imaginary_data) // msg 1 (sent)
    console.log(d)
}
testing()