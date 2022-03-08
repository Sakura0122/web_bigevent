$(function () {
    let layer = layui.layer
    let form = layui.form
    initArtCateList()

    // 初始化文章分类数据
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败！')
                }
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    let indexAdd = null
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过代理的形式 为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.msg('新增分类成功！')
                layer.close(indexAdd)
            }
        })
    })

    // 通过代理的形式 为 btn-edit 按钮绑定点击事件
    let indexExit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexExit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        let id = $(this).data('id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式 为 form-edit 表单绑定 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                initArtCateList()
                layer.close(indexExit)
            }
        })
    })

    // 通过代理的形式 为 删除按钮绑定点击事件
    $('body').on('click', '.btn-delete', function () {
        let id = $(this).data('id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', {icon: 3, title: '提示'},
            function (index) {
                $.ajax({
                    method: 'get',
                    url: '/my/article/deletecate/' + id,
                    success: res => {
                        if (res.status !== 0) {
                            return layer.msg('删除失败！')
                        }
                        layer.msg('删除成功！')
                        layer.close(index)
                        initArtCateList()
                    }
                })
            }
        )
    })
})