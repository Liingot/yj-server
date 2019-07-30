// const host = 'http://192.168.1.136:8899'//勇哥
// const host = 'http://39.105.35.51:8088'//测试
const host = 'https://v2.yuanjia101.com'//正式

function request(url, method, data, header = {}) {
    wx.showLoading({
        title: '加载中' // 数据请求前loading
    })
    return new Promise((resolve, reject) => {
        wx.request({
            url: host + url,
            method: method,
            data: data,
            dataType: "json",
            header: {
                'content-type': 'application/json', // 默认值
                'STAFF-TOKEN': 'eyJhbGciOiJIUzUxMiIsImlhdCI6MTU1NDE3MzgxNSwiZXhwIjoyMzMxNzczODE1fQ.eyJzdGFmZl9pZCI6MzQyfQ.A0PbYsszA3gEZdtlaJoV4g_I6cUe347tWP1gMrVPfKqDYdVfFIZnqRgunIO0eopmvIRWas2zu3QGNt66LkLipw'
            },
            success: function (res) {
                wx.hideLoading()
                resolve(res.data)
            },
            fail: function (res) {
                wx.hideLoading()
            },
            complete: function () {
                wx.hideLoading()
            }
        })
    })
}

function get(obj) {
    return request(obj.url, 'GET', obj.data)
}

function post(obj) {
    return request(obj.url, 'POST', obj.data)
}

export default {
    request,
    get,
    post,
    host
}