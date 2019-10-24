import Request from '@/common/request'
import { getToken } from '@/utils/auth'

const api_host = 'http://lnapp.cam/api'


const http     = new Request()

// 全局设置
http.setConfig((config) => {
	config.baseUrl = api_host
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
	
	// 存在token 
	let token = getToken()
	if(token){
		config.header.Authorization = 'Bearer ' + token
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
		return false;
	}
	
	// 401
	if(response.statusCode === 401){
		uni.showToast({
			title: response.data.message,
			icon: 'none'
		})
		return false;
	}
	
	// 442
	if(response.statusCode === 422){
		uni.showToast({
			title: response.data.message,
			icon: 'none'
		})
		return false;
	}
	
	// token 过期
	
	return response
}, (response) => {
	console.log('error');
	return response
})

export default http
