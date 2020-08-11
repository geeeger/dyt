const Axios = require("axios");
// import Axios from  'axios'

const colors = require('colors');

const day = require('dayjs');

const params = require('./params.json');

const auth = require('./auth.json');

const patient = require('./patient.json');

params.pat_id = patient.pat_id;


console.log(colors.green('请求时间表'))

const date = day(new Date())

let sparam = {
    hos_code: params.hos_code,
    dep_id: params.dep_id,
    doc_id: params.doc_id,
    from_date: date.format('YYYY-MM-DD'),
    end_date: date.date(date.date() + 8).format('YYYY-MM-DD'),
    reg_date: '2017-2-20',
    hyid: ''
}

function qs(obj) {
    let res = ''
    for (var k in obj) {
        res += k + '=' + obj[k] + '&'
    }
    return res.replace(/&$/, '')
}

Axios.get('https://dytapi.ynhdkc.com/v1/schedule?' + qs(sparam), {
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
            throw new Error(res.msg)
        }
        console.log(colors.green('get schedule success'))
        console.log(res.data.map(s => s.sch_date).join('\n'))
        const result = res.data.filter((s) => s.src_num > 0)
        if (result.length === 0) {
            throw new Error('没号，请刷新重试')
        }
        console.log(colors.green('选择最近一天：'), result[0].sch_date, {
            1: '上午',
            2: '中午',
            3: '下午'
        }[result[0].time_type])
        return result[0]
    })
    .then(res => {
        console.log(colors.green('请求可预约时间段'))
        params.sch_date = res.sch_date
        params.time_type = res.time_type
        params.schedule_id = res.schedule_id
        return Axios.get('https://dytapi.ynhdkc.com/v1/schedule/1?' + qs({
            hos_code: params.hos_code,
            dep_id: params.dep_id,
            doc_id: params.doc_id,
            sch_date: res.sch_date,
            time_type: res.time_type,
            schedule_id: res.schedule_id
        }), {
            timeout: 10000,
            timeoutErrorMessage: 'timeout',
            responseType: 'json',
            headers: {
                ...auth.header
            }
        })
    })
    .then((res) => res.data)
    .then((res) => {
        if (res.code !== 1) {
            throw new Error(res.msg)
        }
        console.log(colors.green('get schedule/1 success'))
        const result = res.data
        console.log(result.map(s => s.start_time).join('\n'))
        if (result.length === 0) {
            throw new Error('没号段了，请刷新重试')
        }
        console.log(colors.green('选择最近时间段'), result[0].start_time)
        params.start_time = result[0].start_time
        params.queue_sn = result[0].queue_sn
        console.log(params)
        // throw new Error('不预约了')
        return Axios.post('https://dytapi.ynhdkc.com/v1/appoint', JSON.stringify(params), {
            timeout: 10000,
            timeoutErrorMessage: 'timeout',
            responseType: 'json',
            headers: {
                ...auth.header,
                'content-type': 'application/json;charset=utf-8'
            }
        })
    })
    .then((res) => res.data)
    .then((res) => {
        if (res.code !== 1) {
            throw new Error(res.msg)
        }
        console.log(colors.green(res.msg))
    })
    .catch(error => {
        //超时之后在这里捕抓错误信息.
        if (error.response) {
            console.log(colors.red(error.response))
        } else if (error.request) {
            console.log(colors.red(error.request))
        } else {
            console.log(colors.red(error.message));
        }
    })