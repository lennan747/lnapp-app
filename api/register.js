import http from '@/utils/http'

export function getCaptchaCode(phoneNummer) {
	return http.post('/captchas', {
		phone: phoneNummer
	});
}
