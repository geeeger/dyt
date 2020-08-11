const {Base64} = require('./third-parts/base64')
const fs = require('fs')
const { genUUID } = require('./third-parts/uuid')

const colors = require('colors')

let origin = process.argv[2]

let argv = origin

if (argv.indexOf('.') !== -1) {
    argv = argv.split('.')[1]
}

const uinfo = JSON.parse(Base64.decode(argv))

console.log(colors.green('[openid]: '), uinfo.openid)
console.log(colors.green('[user_id]: '), uinfo.user_id)

console.log(colors.bgGreen('save config'))

fs.writeFile('./auth.json', JSON.stringify({
    openid: uinfo.openid,
    user_id: uinfo.user_id,
    header: {
        authorization: `DYT ${origin.replace(/[\r\n]/, '')}`,
        "x-uuid": genUUID(32, 16),
        "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.116 Safari/537.36 QBCore/4.0.1301.400 QQBrowser/9.0.2524.400 Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2875.116 Safari/537.36 NetType/WIFI MicroMessenger/7.0.5 WindowsWechat',
        "referer": "https://appv2.ynhdkc.com/register_kunhua_depart_list?hos_code=871900",
        "origin": "https://appv2.ynhdkc.com"
    }
}), (error) => {
    if (error) {
        console.log(colors.bgRed('save failed!'))
    } else {
        console.log(colors.bgGreen('save success!'))
    }
})