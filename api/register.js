import http from '@/utils/http'

export function getCaptchaCode(phoneNummer) {
	return http.post('/captchas', {
		phone: phoneNummer
	});
}

export function getPhoneCode(data){
	return http.post('/verificationCodes',{
		captcha_key: data.captchaKey,
		captcha_code: data.captchaCode
	})
}

export function register(data){
	return http.post('/users',{
		name: data.phone,
		password: data.password,
		verification_key: data.verificationKey,
		verification_code: data.verificationCode
	})
}