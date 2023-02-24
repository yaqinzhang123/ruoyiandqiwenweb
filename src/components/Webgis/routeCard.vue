<template>
	<view class="" @click="toContent">
		<el-card class="content" shadow="hover">
			<view class="project">
			<view class="project-name">
				<i class='el-icon-coin'></i>
				<text>服务名称：{{routeCard.projectName}}</text>
			</view>
			<view class="projectDesc">
				服务端口：<text>{{routeCard.port}}</text>
			</view>
			<!-- <view>
				<h3 class='title'>路由：</h3><text>{{route}}</text>
			</view> -->
			<view class="projectDesc">
				创建时间：<text>{{routeCard.createTime}}</text>
			</view>
			<view class="projectDesc">
				服务备注：<text>{{routeCard.desc}}</text>
			</view>
			</view>
			<div class="transition-box">
				<div>
					<el-row>
						<el-col :span="8" class="switchServer">
							<text class="space">关</text>
							<el-switch v-model="routeCard.serveroption"></el-switch>
							<text class="space">开</text>
							
						</el-col>
						<el-col :span="8" class="switchServer">
							<i class="el-icon-edit">编辑</i>
						</el-col>
						<el-col :span="8" class="switchServer">
							<i class="el-icon-delete">删除</i>
						</el-col>
					</el-row>
				</div>
			</div>
		</el-card>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				routeCard:{
					serveroption: true,
					port: 80,
					projectName:'铁路项目',
					// route: '/sgis',
					createTime: '2022-01-26',
					desc:''
				}
			}
		},
		methods: {
			toContent(){
				this.$router.push('routeContent')
			}
		}
	}
</script>

<style lang="scss">
	.content{
		box-shadow: 0 2px 4px rgba(0, 0, 0, .02), 0 0 6px rgba(0, 0, 0, .04);
		width: 98%;
		// height: 185px;
		position: relative;
		width: 95%;
		text-align: left;
		// height: 185px;
		flex: none;
		 margin-left: 10px;
		border-radius: 4px;
		margin-top: 15px;
		// padding: 8px 12px;
		box-sizing: border-box;
		cursor: pointer;
		will-change: box-shadow;
		transition: box-shadow .4s ease-out;
		overflow: hidden;
	}
	.content:hover .transition-box{
		transform:translateY(0px);
		transition: all 0.6s ease 0s;
		-webkit-transform: translateY(-50px);
	}
	 .transition-box {
	    width: 100%;
	    height: 50px;
		line-height: 50px;
	    border-radius: 5px;
	    background-color: #409EFF;
	    text-align: center;
		background-color: rgba(0,0,0,.5);
		position: absolute;
		left: -1px;
		bottom: -50px;
		transition: all 0.6s ease 0s;
	  }
	.space{
		padding: 0px 10px 0px 10px;
	}
	.switchServer{
		color: rgba($color: #ffffff, $alpha: 1.0);
	}
	.project{
		color: rgba(153,153,153,.7);
		text-align: left;
		padding: 10px 0px;
		.project-name{
			i{
				font-size: 40px;
				left: 0;
				color: #ffcc80;
				will-change: color;
				transition: color .4s ease-out;
				padding: 0px 10px 0px 0px;
			}
			display: flex;
			height: 40px;
			line-height: 40px;
			color: #5bb0cc;
			font-size: 18px;
		}
		.projectDesc{
			margin-top: 13px;
			border-bottom: 1px dashed rgba(204,204,204,.65);
			margin-bottom: 7px;
		}
	}
	
</style>
