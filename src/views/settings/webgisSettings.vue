<template>
	<el-tabs v-model="activeName" :tab-position="tabPosition" >
	   <el-tab-pane label="高级配置" name="first">
		   <iframe :src="url" :width="1200" :height="800" ></iframe>
	   </el-tab-pane>
   <el-tab-pane label="全局配置" name="second">

	   <el-card >
		   <!-- <el-divider content-position="left">全局配置</el-divider> -->
		   <el-row :gutter="20">
			 <el-col :span="2"><div class="grid-content "></div></el-col>
			 <el-col :span="12">
				 <div class="grid-content">
					 <el-form ref="form" :model="form" label-width="80px">
					   <el-form-item label="访问域名">
						 <el-input v-model="form.serviceAddr"></el-input>
					   </el-form-item>
					   <el-form-item label="证书Crt">
						   <div @click="uploadPem">
							   <!-- <el-input ref="pem" type="input" v-model="form.servicePem" placeholder="请选择文件"></el-input> -->
							   <el-upload
								   class="upload-demo rowstyle"
								   ref="pem"
								   action=""
								   :file-list="fileCrtList"
								   :limit=1
								   :auto-upload="false">
								   <el-button slot="trigger" plain size="small" type="primary" >选取文件</el-button>
								   <div slot="tip" class="el-upload__tip">只能上传.crt结尾的文件，且不超过500kb</div>
								   </el-upload>
						   </div>
					   </el-form-item>
					   <el-form-item label="证书Key">
						   <div @click="uploadKey">
							   <!-- <el-input ref="key" type="input" v-model="form.serviceKey"  placeholder="请选择文件"></el-input> -->
							   <el-upload
								   class="upload-demo rowstyle"
								   ref="key"
								   action=""
								   :file-list="fileKeyList"
								   :limit=1
								   :auto-upload="false">
								   <el-button slot="trigger" plain size="small" type="primary">选取文件</el-button>
								   <div slot="tip" class="el-upload__tip ">只能上传.key结尾的文件，且不超过500kb</div>
								   </el-upload>
						   </div>
					   </el-form-item>
					   <el-form-item label="网关路径">
						 <el-input v-model="form.gatewayPath"></el-input>
					   </el-form-item>
					   <el-form-item label-width="80px" label="3dtile">
						 <el-input v-model="form._3dtilePath"></el-input>
					   </el-form-item>
					   <el-form-item label="预览地址">
						 <el-input v-model="form.viewAddr"></el-input>
					   </el-form-item>
					   <el-form-item>
						 <el-button type="primary" @click="onSubmit">修改</el-button>
					   </el-form-item>
					 </el-form>
				 </div>
			 </el-col>
			 <el-col :span="4"><div class="grid-content"></div></el-col>
		   </el-row>
	   </el-card>
   </el-tab-pane>
   </el-tabs>
</template>

<script>
import api from '@/api/webgis/index'
import store from '@/store/index.js'
let BASE_URL = 'http://localhost:8088'
export default {
   data() {
	   return {
		   tabPosition:'left',
		   activeName:'first',
		   form: {
		   },
		   pemFile: {},
		   keyFile: {},
		   url: BASE_URL + '/admin/sys/high/',
		   webviewStyles: {
			   progress: {
				   color: '#FF3333'
			   }
		   },
		   fileCrtList: [],
		   fileKeyList: [],

	   }
   },
   methods: {
	   async onSubmit() {
		   var that = this
		   console.log(this.form)
		   var head = {}
		   head.token = uni.getStorageSync('token');
		   var sslFile = []
		   sslFile.push(this.pemFile)
		   sslFile.push(this.keyFile)
		   uni.showLoading({
			   title: '修改中',
			   mask: true
		   })
		   uni.uploadFile({
			   url: BASE_URL + configUpdate,
			   files: sslFile,
			   header: head,
			   formData: that.form,  //顺带整个表单对象传给服务端
			   success: (uploadFileRes) => {
				   uni.hideLoading()
				   console.log(uploadFileRes.data);
				   this.$message.success("修改成功！")
			   },
			   fail: (err) => {
				   console.log('err', err)
				   msg('网络服务异常，请联系管理员！')
				   reject(err)
				   uni.hideLoading()
			   }
		   });
	   },
	   async initData() {
		   const res = await api.configList();
		   if (res.code == 200) {
			   this.form = res.data;
		   }
	   },
	   uploadPem() {
		   var that = this;
		   if (this.fileCrtList && this.fileCrtList.length == 1) {
			   that.form.servicePem = this.fileCrtList[0].name;
			   that.pemFile.name = 'pemFile'
			   that.pemFile.file = this.fileCrtList[0]
			   that.pemFile.uri = this.fileCrtList[0].path
		   }

		   this.$refs['pem'].blur()
	   },
	   uploadKey() {
		   var that = this;
		   uni.chooseFile({
			   count: 1, //默认100
			   extension: ['.key'],
			   success: function (res) {
				   console.log(res.tempFiles.name);
				   that.form.serviceKey = res.tempFiles[0].name;
				   that.keyFile.name = 'keyFile'
				   that.keyFile.file = res.tempFiles[0]
				   that.keyFile.uri = res.tempFiles[0].path
			   }
		   });
		   this.$refs['key'].blur()
	   },
   },
   created() {
	   this.initData();
   }
}
</script>

<style lang="scss" scoped>
.content {
   // background-color: #EEEEEE;
}

.page {
   height: 100%;
   overflow: auto;
   // display: flex;
   // padding: 20px 20px 20px 20px;
   // background-color: #EEEEEE;
}

.rowstyle {
   display: flex;
}

.el-row {
   margin-bottom: 20px;

   &:last-child {
	   margin-bottom: 0;
   }
}

.el-col {
   border-radius: 4px;
}

.bg-purple-dark {
   background: #99a9bf;
}

.bg-purple {
   background: #d3dce6;
}

.bg-purple-light {
   background: #e5e9f2;
}

.grid-content {
   border-radius: 4px;
   min-height: 36px;
}

.row-bg {
   padding: 10px 0;
   background-color: #f9fafc;
}
.el-card{
   border: 0px;
}
</style>
