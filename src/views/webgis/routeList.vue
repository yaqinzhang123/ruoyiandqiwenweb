<template>
	<view>
		<projectList></projectList>
	</view>
</template>

<script>
	import routeCard from '@/components/Webgis/routeCard.vue'
	import projectList from	'@/components/Webgis/projectList.vue'
	import api from '@/api/webgis/index'
	export default {
		components: {routeCard,projectList},
		data() {
			return {
				listData:{
					searchName:'',
					currentPage:1,
					projectType:1
				},
				pageSize: 10,
				pageCurrent: 1,
				total: 0,
				dialogFormVisible: false,
				form: {
				  projectName: '',
				  projectPort: '',
				  projectDesc: '',
				  projectType: 1
				},
				formLabelWidth: '80px'
			}
		},
		methods: {
			async initList(){
				var res= await api.routeList(this.listData);
				if(!res.code==200){
					this.$message.error(res.msg)
				}else{
					console.log(res)
				}
				
			},
			toContent(){
				uni.navigateTo({
					url:'./routeContent'
				})
			},
			async insertRoute(){
				var res = await api.addRoute(this.form)
				console.log(res)
			}
		},
		onLoad(option) {
			alert(localStorage.getItem('projectType'))
			this.initList()
		}
	}
</script>

<style lang="scss">
.optionBar{
	background-color: #EEEEEE;
	height: 90px;
	line-height: 90px;
	padding: 10px;
}
.iptstyle{
	text-align: left;
}
.btnstyle{
	text-align: right;
	padding-right: 20px;
}
.ipt{
	width: 500px;
	padding: 0px 20px 0px 10px;
}
.list{
	padding: 10px;
	text-align: center;
}
.paginations{
	position: absolute;
	bottom: 100px;
	width: 100%;
}

</style>
