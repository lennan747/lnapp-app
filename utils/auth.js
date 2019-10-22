export function getToken() {
  return uni.getStorageSync('access_token')
}

export function setToken(token) {
  uni.setStorageSync('access_token',token.access_token) 
  uni.setStorageSync('access_token_expired_at', new Date().getTime() + token.expires_in * 1000)
}

export function removeToken() {
  return uni.removeStorageSync('access_token') && uni.removeStorageSync('access_token_expired_at');
}

export function getExpiresIn(){
	return uni.getStorageSync('access_token_expired_at')
}

export function getUserInfo(){
	return uni.getStorageSync('user_info');
}

export function setUserInfo(userInfo){
	 return uni.setStorageSync('user_info',userInfo);
}

export function removeUserInfo(){
	 return uni.removeStorageSync('user_info');
}
