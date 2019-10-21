import Request from '@/common/request'

const http = new Request()


// 全局设置
http.setConfig((config) => {
	config.baseUrl = 'http://lnapp.cam/api'
	config.header = {
		...config.header
	}
	return config
})


// 自定义验证器
http.validateStatus = (statusCode) => {
	return true
}

// 请求拦截器
http.interceptor.request((config, cancel) => {
	config.header = {
		...config.header,
	}
	return config
})

// 响应拦截器
http.interceptor.response(async (response) => {
	// 429 请求次数过多
	if(response.statusCode === 429){
		uni.showToast({
			title: '请稍后重试',
			icon: 'none'
		})
	}
	return response
}, (response) => {
	console.log('error');
	return response
})

export default http
