$(function () {
    // 调用 getUserInfo 获取用户基本信息
    getUserInfo()
    let layer = layui.layer
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('is not', {icon: 3, title: '提示'},
            function (index) {
                // console.log('ok')
                // 1.清空本地 token
                // 2.重新跳转到登陆页面
                localStorage.removeItem('token')
                location.href = './login.html'
                // 关闭 confirm 询问框
                layer.close(index)
            })
    })
})

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: res => {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 调用 renderAvatar()
            renderAvatar(res.data)
        },
        // 无论成功失败 都会调用 complete 回调函数
        // complete: function (res) {
        //     // console.log(res)
        //     // 在 complete 回调函数中 可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 1.强制清空token
        //         localStorage.removeItem('token')
        //         // 2.强制跳转到登录页
        //         location.href = './login.html'
        //     }
        // }
    })
}

// 渲染用户头像
function renderAvatar(user) {
    // 1.获取用户名称
    let name = user.nickname || user.username
    // 2.设置欢迎文本
    $('#welcome').html(`欢迎 ${name}`)
    // 3.按需渲染用户头像
    if (user.user_pic !== null) {
        // 3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 3.2 渲染文本头像
        $('.layui-nav-img').hide()
        $('.text-avatar').html(name[0].toUpperCase()).show()
    }
}