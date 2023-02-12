vue3 新特性
1.vue3 中不同层级不再需要一个根标签包裹
2.css 可以直接绑定 js 变量

内置组件 component
动态绑定我们的组件，根据数据的不同更换不同的组件
component 通过属性 is 的值可以渲染不同的组件。

axios 请求拦截和响应拦截

前端判断 token 失效
在登陆时储存当前的时间，下一次发请求时通过请求拦截判断是否存在 token，如果有 token 则判断当前 token 是否过期，过期则强制退出转到登录页面

vuex 的持久化

路由守卫
判断是否转入 login 页面

引入全局 scss 之后造成无法在 scipt 中再次引用，新建一个文件，暴露需要用到的变量，作为新文件引入

手机号以及邮箱的正则验证
var checkEmail = (rule, value, callback) => {
// 检验邮箱的正则表达式
    const emailRef = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (emailRef.test(value)) {
        return callback()
    }
    callback(new Error('邮箱格式错误'))
}

// 检验手机号合法性
var checkMobile = (rule, value, callback) => {
    // 检验手机号的正则表达式
    const mobileRef = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
    if (mobileRef.test(value)) {
        return callback()
    }
    callback(new Error('手机号格式错误'))
}
