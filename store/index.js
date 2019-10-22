import Vue from 'vue'
import Vuex from 'vuex'
import { getToken,setToken,removeToken,setUserInfo,removeUserInfo,getUserInfo } from '../utils/auth'
import { h5Login } from '../api/wxlogin'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: getUserInfo(),
		token: getToken(),
	},
	mutations: {
		SET_TOKEN: (state, token) => {
			state.token = token
		},
		SET_LOGIN:(state, status) => {
			state.hasLogin = status
		},
		SET_USERINFO:(state, userInfo) => {
			state.userInfo = userInfo
		}
	},
	actions: {
		// 登录
		async login({ commit }, data) {
			if(data.type === 'weixinh5'){
				let response = await h5Login({code: data.code});
				if(response.statusCode == 201){
					console.log(response);
					commit('SET_TOKEN', response.data.meta);
					commit('SET_LOGIN', true);
					commit('SET_USERINFO', response.data);
					setToken(response.data.meta);
					setUserInfo(response.data);
				}
				return;
			}
		},
		logout({ commit }){
			commit('SET_TOKEN', '')
			commit('SET_LOGIN', false);
			commit('SET_USERINFO', {});
			removeToken();
			removeUserInfo();
		}
	}
})

export default store
