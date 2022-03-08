$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        let dt = new Date(data)
        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询对象 将来请求数据的时候
    // 需要将请求参数提交到服务器
    let q = {
        pagenum: 1, // 页码值 默认请求第一页数据
        pagesize: 2, // 每页显示条数 默认2条
        cate_id: '', // 文章分类的id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'get',
            url: '/my/article/list',
            data: q,
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表数据失败！')
                }
                // 使用模板引擎渲染页面的数据
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: res => {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 为查询参数对象q中属性赋值
        q.cate_id = cate_id
        q.state = state
        // 重新渲染表格数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total)
        // 调用 laypage.render() 方法来渲染分页结构
        laypage.render({
            elem: 'pageBox', // 分页容器的id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示条数
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换 触发 jump回调
            // 触发jump回调的方式有
            // 1.点击页码的时候 会触发jump回调
            // 2.只要调用laypage.render() 方法 就会触发jump回调
            jump: function (obj, first) {
                // 可以通过first的值 来判断是通过哪种方式触发的jump回调
                // 如果first的值为true 证明是方式2触发的
                // 否则是方式1触发的
                // console.log(obj.curr)
                // 把最新页码值赋值给q查询参数
                q.pagenum = obj.curr
                // 把最新的条目数 复制到q这个查询参数的pagesize属性中
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表 并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式 为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮个数
        let len = $('.btn-delete').length
        // 获取文章id
        let id = $(this).data('id')
        // 询问用户是否删除数据
        layer.confirm('确认删除？', {icon: 3, title: '提示'}, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: res => {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后 要判断当前这一页是否有剩余数据
                    // 如果没有剩余数据 则让页码值 -1
                    // 再重新调用initTable()方法
                    if (len === 1) {
                        // 如果len值为1 证明删除完毕后 页面上没有任何数据
                        // 页码值最小是1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})