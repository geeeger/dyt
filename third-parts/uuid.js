exports.genUUID = function genUUID(len, radix) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    let uuid = []
    radix = radix || chars.length
    if (len) {
    for (let i = 0; i < len; i++) {
        uuid[i] = chars[0 | (Math.random() * radix)]
    }
    } else {
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (let i = 0; i < 36; i++) {
        if (!uuid[i]) {
        let r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
        }
    }
    }
    return uuid.join('')
}