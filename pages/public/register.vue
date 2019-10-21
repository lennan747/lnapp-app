<template>
	<view class="container">
		<view class="left-bottom-sign"></view>
		<view class="back-btn yticon icon-zuojiantou-up" @click="navBack"></view>
		<view class="right-top-sign"></view>
		<!-- 设置白色背景防止软键盘把下部绝对定位元素顶上来盖住输入框等 -->
		<view class="wrapper">
			<view class="left-top-sign">REGISTER</view>
			<view class="welcome">
				欢迎加入！
			</view>
			<view class="input-content">
				<view class="input-item">
					<text class="tit">手机号码</text>
					<input type="number" :value="mobile" placeholder="请输入手机号码" maxlength="11" data-key="mobile" @input="inputChange" />
				</view>
				<view class="input-item">
					<text class="tit">验证码</text>
					<view class="input-code">
						<view>
							<input type="number" :value="verificationCode" placeholder="请输入验证码" maxlength="4" data-key="verificationCode"
							 @input="inputChange" />
						</view>
						<view class="bt-code" @tap="getCaptchaCode"><text>获取验证码</text></view>
					</view>

				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="mobile" value="" placeholder="8-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20"
					 password data-key="password" @input="inputChange" @confirm="toLogin" />
				</view>
			</view>
			<button class="confirm-btn" @click="toRegister" :disabled="registering">注册</button>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="captcha-code">
				<input type="number" maxlength="4" placeholder="验证码">
				<image @click="getCaptchaCode()" :src="captcha.imageContent"></image>
			</view>
			<view class="code-tip"><view class="leo-btn">确定</view></view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import { getCaptchaCode } from '@/api/register'
	export default {
		components: {
			uniPopup
		},
		data() {
			return {
				mobile: '',
				password: '',
				verificationCode: '',
				captcha: {
					imageContent: '../../static/captcha.jpg',
					captchaKey: '',
					expiredAt: ''
				},
				registering: false
			}
		},
		onLoad() {

		},
		methods: {
			...mapMutations(['login']),
			inputChange(e) {
				const key = e.currentTarget.dataset.key;
				this[key] = e.detail.value;
			},
			navBack() {
				uni.navigateBack();
			},
			async toRegister() {

			},
			async getCaptchaCode() {
				if(!this.$util.isMobile(this.mobile) || this.$util.isNullOrEmpty(this.mobile)){
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return false;
				}
				// 获取图片验证码
				let response = await getCaptchaCode(this.mobile);
				if(response.statusCode === 201){
					this.captcha.imageContent = response.data.captcha_image_content
					this.captcha.captchaKey   = response.data.captcha_key
					this.captcha.expiredAt    =  response.data.expired_at
					this.$refs.popup.open()
				}
				
				// if(response.statusCode !== 201){
				// 	uni.showToast({
				// 		title: '获取验证失败',
				// 		icon: 'none'
				// 	})
				// }
			}
		},

	}
</script>

<style lang='scss'>
	page {
		background: #fff;
	}

	.container {
		padding-top: 115px;
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #fff;
	}

	.wrapper {
		position: relative;
		z-index: 90;
		background: #fff;
		padding-bottom: 40upx;
	}

	.back-btn {
		position: absolute;
		left: 40upx;
		z-index: 9999;
		padding-top: var(--status-bar-height);
		top: 40upx;
		font-size: 40upx;
		color: $font-color-dark;
	}

	.left-top-sign {
		font-size: 120upx;
		color: $page-color-base;
		position: relative;
		left: -16upx;
	}

	.right-top-sign {
		position: absolute;
		top: 80upx;
		right: -30upx;
		z-index: 95;

		&:before,
		&:after {
			display: block;
			content: "";
			width: 400upx;
			height: 80upx;
			background: #b4f3e2;
		}

		&:before {
			transform: rotate(50deg);
			border-radius: 0 50px 0 0;
		}

		&:after {
			position: absolute;
			right: -198upx;
			top: 0;
			transform: rotate(-50deg);
			border-radius: 50px 0 0 0;
			/* background: pink; */
		}
	}

	.left-bottom-sign {
		position: absolute;
		left: -270upx;
		bottom: -320upx;
		border: 100upx solid #d0d1fd;
		border-radius: 50%;
		padding: 180upx;
	}

	.welcome {
		position: relative;
		left: 50upx;
		top: -90upx;
		font-size: 46upx;
		color: #555;
		text-shadow: 1px 0px 1px rgba(0, 0, 0, .3);
	}

	.input-content {
		padding: 0 60upx;
	}

	.input-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 0 30upx;
		background: $page-color-light;
		height: 120upx;
		border-radius: 4px;
		margin-bottom: 50upx;

		&:last-child {
			margin-bottom: 0;
		}

		.input-code {
			display: flex;
			justify-content: space-between;
			height: 60upx;
			width: 100%;

			.bt-code {
				background: $uni-color-primary;
				color: #fff;
				border-radius: 5px;

				text {
					font-size: $font-sm;
					text-align: center;
					padding: 10upx;
				}
			}
		}

		.tit {
			height: 50upx;
			line-height: 56upx;
			font-size: $font-sm+2upx;
			color: $font-color-base;
		}

		input {
			height: 60upx;
			font-size: $font-base + 2upx;
			color: $font-color-dark;
			width: 100%;
		}
	}

	.confirm-btn {
		width: 630upx;
		height: 76upx;
		line-height: 76upx;
		border-radius: 50px;
		margin-top: 70upx;
		background: $uni-color-primary;
		color: #fff;
		font-size: $font-lg;

		&:after {
			border-radius: 100px;
		}
	}

	.forget-section {
		font-size: $font-sm+2upx;
		color: $font-color-spec;
		text-align: center;
		margin-top: 40upx;
	}

	.register-section {
		position: absolute;
		left: 0;
		bottom: 50upx;
		width: 100%;
		font-size: $font-sm+2upx;
		color: $font-color-base;
		text-align: center;

		text {
			color: $font-color-spec;
			margin-left: 10upx;
		}
	}

	.captcha-code {
		display: flex;
		justify-content: space-between;
		background-color: #f8f6fc;
		input{
			height: 70upx;
			width: 600upx;
			padding: 10upx;
			margin-right: 50upx;
			border-radius: 10upx;
		}
		image {
			height: 70upx;
		}
	}
	.code-tip{
		display: flex;
		justify-content: flex-end;
		font-size: $font-sm;
		margin-top: 1upx;
		.leo-btn{
			background: $uni-color-primary;
			color: #fff;
			border-radius: 5px;
			padding-left: 50upx;
			padding-right: 50upx;
			padding-bottom: 10upx;
			padding-top: 10upx;
			margin-top: 10upx;
			text {
				font-size: $font-sm;
				text-align: center;
				padding: 10upx;
			}
		}
	}
</style>
