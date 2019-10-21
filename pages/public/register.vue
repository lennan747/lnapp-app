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
						<view class="bt-code" @tap="getCaptchaCode"><text>{{ getCodeText }}</text></view>
					</view>

				</view>
				<view class="input-item">
					<text class="tit">密码</text>
					<input type="mobile" :value="password" placeholder="8-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20"
					 password data-key="password" @input="inputChange" />
				</view>
				
				<view class="input-item">
					<text class="tit">确认密码</text>
					<input type="mobile" :value="surePassword" placeholder="8-18位不含特殊字符的数字、字母组合" placeholder-class="input-empty" maxlength="20"
					 password data-key="surePassword" @input="inputChange" />
				</view>
			</view>
			<button class="confirm-btn" @click="toRegister" :disabled="registering">注册</button>
		</view>
		<uni-popup ref="popup" type="center">
			<view class="captcha-code">
				<input type="text" maxlength="6" placeholder="验证码" data-key="captchaCode" :value="captchaCode" @input="inputChange">
				<image @click="getCaptchaCode()" :src="captcha.imageContent"></image>
			</view>
			<view class="code-tip" @tap="getPhoneCode()"><view class="leo-btn">确定</view></view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapMutations
	} from 'vuex';
	import uniPopup from "@/components/uni-popup/uni-popup.vue"
	import { getCaptchaCode,getPhoneCode,register } from '@/api/register'
	export default {
		components: { uniPopup },
		data() {
			return {
				mobile: '',                                          // 手机号
				password: '',                                        // 密码
				surePassword: '',                                    // 确认mima
				verificationCode: '',                                // 收到的短信验证码
				verification: '',                                    // 验证码信息
				captchaCode: '',                                     // 输入图片验证码
				captcha: {                                           // 图片验证码信息
					imageContent: '../../static/captcha.jpg',
					captchaKey: '',
					expiredAt: ''
				},
				registering: false,
				getCodeText: '获取验证码',                           // 验证码按钮文本
				getCodeisWaiting: false                             // 等待获取验证码
			}
		},
		onLoad() {},
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
				// 手机号验证码
				if(!this.$util.isMobile(this.mobile) || this.$util.isNullOrEmpty(this.mobile)){
					this.$api.msg('请输入正确的手机号')
					return false;
				}
				// 验证验证码
				if(this.$util.isNullOrEmpty(this.verificationCode)){
					this.$api.msg('请输入短信验证码');
					return false;
				}
				
				// 验证密码格式
				if(!this.$util.checkPwd(this.password)){
					this.$api.msg('密码为8~20位数字和字母组合')
					return false;
				}
				
				// 密码确认
				if(this.password !== this.surePassword){
					this.$api.msg('两次输入的密码不一致')
					return false;
				}
				
				this.registering = true;
				// 注册API
				let response = await register({
					phone: this.mobile,
					password: this.password,
					verificationKey: this.verification.key,
					verificationCode: this.verificationCode
				})
				
				if(response.statusCode === 201){
					this.$api.msg('注册成功');
				}
			},
			// 获取图片验证码
			async getCaptchaCode() {
				// 等待接收验证码
				if(this.getCodeisWaiting){
					return;
				}
				// 手机号验证码
				if(!this.$util.isMobile(this.mobile) || this.$util.isNullOrEmpty(this.mobile)){
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return false;
				}
				// 获取图片验证码
				let response = await getCaptchaCode(this.mobile);
				// 获取图片验证码成功
				if(response.statusCode === 201){
					this.captcha.imageContent = response.data.captcha_image_content
					this.captcha.captchaKey   = response.data.captcha_key
					this.captcha.expiredAt    =  response.data.expired_at
					this.$refs.popup.open()
				}
			},
			// 获取手机验证码
			async getPhoneCode(){
				console.log(this.captchaCode);
				if(this.$util.isNullOrEmpty(this.captchaCode)){
					uni.showToast({
						title: '请输入右图验证码',
						icon: 'none'
					});
					return false;
				}
				// 获取手机验证码成功
				let response = await getPhoneCode({captchaKey: this.captcha.captchaKey,captchaCode: this.captchaCode});
				if(response.statusCode === 201){
					this.getCodeText = "获取中...";
					this.verification = response.data;
					this.getCodeisWaiting = true;
					this.setTimer();
					this.$refs.popup.close()
				}
			},
			Timer() {},
			// 重新获取验证码倒计时
			setTimer() {
				let holdTime = 60;
				this.getCodeText = "重新获取(60)"
				this.Timer = setInterval(() => {
					if (holdTime <= 0) {
						this.getCodeisWaiting = false;
						this.getCodeBtnColor = "#ffffff";
						this.getCodeText = "获取验证码"
						clearInterval(this.Timer);
						return;
					}
					this.getCodeText = "重新获取(" + holdTime + ")"
					holdTime--;
			
				}, 1000)
			},
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
