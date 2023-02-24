<!-- 倾斜摄影 -->
<template>
	<div class="app-container">
		<projectList ref="child" :projectType="projectType"></projectList>
	</div>
</template>

<script>
	import projectList from	'@/components/Webgis/projectList.vue'
	export default {
		components: {projectList},
		data() {
			return {
				projectType:""
			}
		},
		methods: {
		},
		created() {
			this.projectType=this.$route.query.projectType
			this.$nextTick(()=>{
			        this.$refs.child.initList();
			})
		}
	}
</script>

<style>

</style>
