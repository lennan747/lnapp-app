import http from '@/utils/http'

export function h5Login(data){
	return http.post('/socials/weixin/authorizations', {
		code: data.code
	});
}