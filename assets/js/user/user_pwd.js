$(function () {
    let form = layui.form
    let layer = layui.layer
    form.verify({
        // 自定义一个叫pwd 的校验规则
        'pwd': [/^[\S]{6,12}$/, '密码必须6~12位且不能出现空格'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success:res=>{
                if(res.status!==0){
                    return layer.msg('更新密码失败！')
                }
                layer.msg('更新密码成功！')
                // 重置表单
                $(this)[0].reset()
            }
        })
    })
})