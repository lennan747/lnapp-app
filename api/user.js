import http from '@/utils/http'

// 收货地址列表
export function getUserAddresses(){
	return http.get('/user_addresses');
}