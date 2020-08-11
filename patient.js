const Axios = require('axios')
const colors = require('colors')
const fs = require('fs')

// import Axios from "axios";

const auth = require('./auth.json')


Axios.get(`https://dytapi.ynhdkc.com/v1/patient/${auth.user_id}`, {
    timeout: 10000,
    timeoutErrorMessage: 'timeout',
    responseType: 'json',
    headers: {
        ...auth.header
    }
})
    .then((res) => res.data)
    .then((res) => {
        if (res.code !== 1) {
            console.log(colors.bgRed(res.msg))
        } else {
            console.log(colors.green(res.msg), ' ', '存储个人信息')
            fs.writeFile('./patient.json', JSON.stringify(res.data[0]), (error) => {
                if (error) {
                    console.log(colors.bgRed('存储失败'))
                } else {
                    console.log(res.data[0])
                    console.log(colors.bgGreen('存储成功'))
                }
            })
        }
    })
    .catch(e => {
        console.log(colors.red(e.message))
    })
