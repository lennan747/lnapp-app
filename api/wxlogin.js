const wxlogin = async (params = {}) => {
	let loginData = await uni.login({
		provider: 'weixin'
	})

	params.code = loginData.code;

	// 接口请求 weapp/authorizations
	let authResponse = await request({
		url: 'weapp/authorizations',
		data: params,
		method: 'POST'
	})

	// 登录成功，记录 token 信息
	if (authResponse.statusCode === 201) {
		wepy.setStorageSync('access_token', authResponse.data.access_token)
		wepy.setStorageSync('access_token_expired_at', new Date().getTime() + authResponse.data.expires_in * 1000)
	}

	return authResponse
}

export default wxlogin
