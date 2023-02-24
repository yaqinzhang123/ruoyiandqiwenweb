<template>
	<div  class="app-container">
		<div class="optionBar">
			<el-row>
			  <el-col :span="12" >
				  <div class="iptstyle">
				  	<el-input
				  	  class="ipt"
				  	  placeholder="请输入要搜索的文件名 或 ID名称"
				  	  v-model="searchReqParam.searchName"
				  	  clearable>
				  	</el-input>
					<el-select class="split" v-model="searchReqParam.resourceType" placeholder="请选择">
					    <el-option
					      v-for="statuParam in statuParams"
					      :key="statuParam.value"
					      :label="statuParam.label"
					      :value="statuParam.value">
					    </el-option>
					</el-select>
					<el-button type="primary" plain @click="searchList">查询</el-button>
				  </div>
			  </el-col>
			  <el-col :span="12" class="btnstyle">
				  <el-button type="primary" @click="dialogVisible = true">上传<i class="el-icon-upload el-icon--right"></i></el-button>
			  </el-col>
			</el-row>
		</div>
		<div id="list" class="list" ref="list" >
			<el-row>
			  <el-col :span="24">
				  <div class="grid-content bg-purple-dark">
					  <el-table class="listcontent" stripe  :data="searchRspData.data" style="width: 100%" >
					      <el-table-column
					        label="名称"
					        width="250">
					        <template slot-scope="scope">
					          <span style="margin-left: 10px">{{ scope.row.resourceName }}</span>
					        </template>
					      </el-table-column>
					      <el-table-column
					        label="ID编号"
					        width="270">
					        <template slot-scope="scope">
					          <span style="margin-left: 10px">{{ scope.row.resourceNo }}</span>
					        </template>
					      </el-table-column>
					  	<el-table-column
					  	  label="上传时间"
					  	  width="180">
					  	  <template slot-scope="scope">
					  	    <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
					  	  </template>
					  	</el-table-column>
					  	<el-table-column
					  	  label="数据状态"
					  	  width="150">
					  	  <template slot-scope="scope">
					  	    <span style="margin-left: 10px">{{ scope.row.resourceStatus }}</span>
					  	  </template>
					  	</el-table-column>
					      <el-table-column label="操作" >
					        <template slot-scope="scope">
					          <el-button
					            size="mini"
								type="primary"
								icon="el-icon-download"
					            @click="downloadFile(scope.$index, scope.row.resourceDownUrl)">下载</el-button>
							  <el-button
							    size="mini"
								icon="el-icon-view"
								type="info"
							    @click="showView(scope.$index, scope.row.resourceShareUrl,scope.row)">预览</el-button>
							  <el-button
					            size="mini"
								type="success"
								icon="el-icon-share"
					            @click="openShare(scope.$index, scope.row.resourceApiUrl,scope.row)">分享</el-button>
								<el-popconfirm
								  class="btnPosition"
								  title="这是一段内容确定删除吗？"
								  @confirm="handleDelete(scope.row.resourceId)"
								>
								  <!-- <i slot="reference" class="el-icon-delete">删除</i> -->
								  <el-button
									  slot="reference"
									  size="mini"
									  type="danger"
									  icon="el-icon-delete">删除</el-button>
								</el-popconfirm>
							   
					        </template>
					      </el-table-column>
					    </el-table>
				  </div>
			  </el-col>
			</el-row>
		</div>
		
		<div type="flex" class="paginations">
			<uni-pagination show-icon :page-size="searchRspData.pageSize" :current="searchRspData.currentPage" :total="searchRspData.totalCount"
				@change="changePage" />
		</div>
		<div>
			<el-dialog
			  :visible.sync="dialogVisible"
			  @close="closeUpload"
			  width="50%">
			  <div class="">
				  <webupload
						  :fileNumLimit="fileNumLimit"
						  :fileSize="fileSize"
						  :chunkSize="chunkSize"
						  :uploadSuffixUrl="uploadSuffixUrl"
						  :options="options"
						  :fileListData="fileList"
				  > </webupload>
				  <!-- <el-card shadow="always">
					<el-upload
					  class="upload-demo"
					  ref="upload"
					  action="http://localhost:8889/api/resource/uploadResourceFiles"
					  :on-preview="handlePreview"
					  :beforeUpload="beforeUpload"
					  :on-remove="handleRemove"
					  :file-list="fileList"
					  :headers="header"
					  :data="uploadData"
					  multiple
					  :auto-upload="false">
					  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
					  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
					</el-upload>
				</el-card> -->
			  </div>
			</el-dialog>
			
		</div>
	</div>
</template>

<script>
	import upload from '@/components/Webgis/upload.vue'
	import webupload from '@/components/Webgis/webUpload.vue'
	import api from '@/api/webgis/index'
	import router from '@/router/index.js'
	import { getToken } from '@/utils/auth'
	let BASE_URL = process.env.VUE_APP_BASE_API
	export default {
		components: {upload,webupload},
		data() {
			return {
				fileList:[],//显示集合
				fileNumLimit:200,//文件总数
				fileSize:100*1024*1024*1024,//默认上传文件大小
				chunkSize:50*1024*1024,//默认文件片段
				uploadSuffixUrl:BASE_URL,
				options:{
					//允许上传的文件
					fileType:"doc,docx,pdf,xls,xlsx,ppt,pptx,gif,jpg,jpeg,bmp,png,rar,zip,mp4,avi",
					fileUploadUrl:"/uploadResource/fileRecord/zone/upload",//上传地址
					fileCheckUrl:"/uploadResource/fileRecord/zone/upload/md5Check",//检测文件是否存在url
					checkChunkUrl:"/uploadResource/fileRecord/zone/upload/md5Check",//检测分片url
					mergeChunksUrl:"/uploadResource/fileRecord/zone/upload/merge/",//合并文件请求地址
					headers:{},
					projectId:''
				},
				searchReqParam:{
					searchName:'',
					resourceType:0,
					currentPage:1,
					pageSize: 10,
					projectId:1
				},
				searchRspData:{
					currentPage:1,
					pageSize: 10,
					totalCount: 0,
					totalPage: 1,
					data:[]
				},
				statuParams:[{
					  label:'全部状态',
					  value:0
					},{
					  label:'解压中',
					  value:1
					},{
					  label:'转换中',
					  value:2
					},{
					  label:'转换完成',
					  value:3
				}],
				tableHeight:500,
				input:'',
				formInline: {
				  user: '',
				  region: ''
				},
				tableData: [],
				dialogVisible: false,
				header: {
					Authorization:'Bearer '+getToken()
				},
				fileList: [],
				uploadData: {
					projectId: ""
				}
			}
		},
		methods: {
			async initListData(){
				const res = await api.resourceList(this.searchReqParam)
				if(res.code==200){
					this.searchRspData.data=res.data.data
					this.searchRspData.currentPage=res.data.currentPage
					this.searchRspData.pageSize=res.data.pageSize
					this.searchRspData.totalCount=res.data.totalCount
					this.searchRspData.totalPage=res.data.totalPage
					console.log(this.searchRspData)
				}else{
					this.$message.error(res.msg)
				}
			},
			changePage(e){
				this.searchReqParam.currentPage=e.current
				this.initListData()
			},
			searchList(){
				this.initListData()
			},
			downloadFile(index, row) {
			 let dload = document.createElement("a");
			
			//  dload.download = '';// 设置下载的文件名，默认是'下载'
			 dload.href = row;
			 document.body.appendChild(dload);
			 dload.click();
			 dload.remove(); // 下载之后把创建的元素删除
			 this.$message.success("正在下载")
		    },
			showView(index,row,obj){
				//判断数据是否转换完成
				if(obj.resourceStatus=="转换完成"){
					row=process.env.VUE_APP_BASE_API+'/view'+row+"&ip="+process.env.VUE_APP_BASE_API.split(":")[0];
					let dload = document.createElement("a");
					dload.target ='_blank'
					//  dload.download = '';// 设置下载的文件名，默认是'下载'
					 dload.href = row;
					 document.body.appendChild(dload);
					 dload.click();
					 dload.remove();
				}else{
					this.$message.error('等待数据转换完成，生成访问地址！');
				}
			},
			openShare(index,row,obj){
				//判断数据是否转换完成
				if(obj.resourceStatus=="转换完成"){
					// if(!row.indexOf(ProjectConfig.BASE_URL) != -1 ){
					// 	//不含有
					// 	row=row.replace(ProjectConfig.OUTSIDE_URL,ProjectConfig.BASE_URL)
					// }
					uni.showModal({
					   title: '访问地址',
					   confirmText: '复制',
					   content: row,
					   success: function (res) {
					       if (res.confirm) {
					           uni.setClipboardData({
								   data:row,//要被复制的内容
								 });
					       }
					   }
					});
					// confirm	Boolean	为 true 时，表示用户点击了确定按钮
					// cancel	Boolean	为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）

					// this.$alert('<strong>这是 <i>http://123.183.159.205:10106\\672962b9408544838354f616478221bd</i> 片段</strong>', '访问地址', {
					//           confirmButtonText: '复制',
					// 		  dangerouslyUseHTMLString: true,
					// 		  label-width:550,
					//           callback: action => {
					            
					//           }
					// });
				}else{
					this.$message.error('等待数据转换完成，生成访问地址！');
				}
			},
		    async handleDelete(resourceId) {
				console.log(resourceId)
				var req={}
				req.resourceId=resourceId
				const res = await api.delResource(req)
				if(res.code==200){
					this.initListData()
				}else{
					this.$message.error(res.msg)
				}
		    },
			beforeUpload(file) {
			     console.log(file)
			     var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
			     const extension = testmsg === 'zip'
			     const isLt2M = file.size / 1024 / 1024  < 20480
			    if(!extension) {
					
			        this.$message({
			            message: '上传文件只能是 zip格式!',
			            type: 'warning'
			        });
			    }
			    if(!isLt2M) {
			        this.$message({
			            message: '上传文件大小不能超过 20GB!',
			            type: 'warning'
			        });
			    }
			    return extension && isLt2M
			    // return extension || extension2
			},
			submitUpload() {
				this.$refs.upload.submit();
				// let formData = new FormData();
				//       //所需参数
				//       this.fileList.forEach((item) => {
				//         formData.append("resources", item.raw);
				//       });
				      
				//      //接口
				// 	 formData.append("projectId", 1);
				//       this.getUploadFjApi(formData);
			  },
			  closeUpload(){
				 this.searchReqParam.currentPage=1
				 this.searchRspData.currentPage=1
				 this.initListData()
			  },
			 //  async getUploadFjApi(formData){
				// const res = await api.uploadResourceFile(format);
				//  if(res.code!=200){
				//  	this.toastError(res.msg);
				//  }else{
				//  	this.toastSuccess("数据上传成功")
				//  }
			 //  },
			handleRemove(file, fileList) {
			        console.log(file, fileList);
			      },
		  handlePreview(file) {
			console.log(file);
		  },
		  handleExceed(files, fileList) {
			this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
		  },
		  beforeRemove(file, fileList) {
			return this.$confirm(`确定移除 ${ file.name }?`);
		  }
		},
		created() {
			// this.tableHeight=this.$refs.list.offsetHeight;
			// alert(this.$refs.list.offsetHeight)
			// this.tableHeight= '100%'
			// console.log(this.tableHeight)
			this.searchReqParam.projectId=router.currentRoute.query.projectId
			this.uploadData.projectId=router.currentRoute.query.projectId
			this.options.projectId=router.currentRoute.query.projectId
			this.initListData()
			// alert(option.projectId+"::"+option.projectType)
		},
		mounted() {
			
			
		}
	}
</script>

<style lang="scss">
.webuploader-pick {
        position: relative;
        display: inline-block;
        cursor: pointer;
        background:#409eff;
        padding: 8px 12px;
        color: #fff;
        font-size: 10px;
        text-align: center;
        border-radius: 3px;
        overflow: hidden;
    }
    .webuploader-pick-hover {
        background: #409EFF;
    }
.list{
	text-align: center;
	height: calc(100vh - 65px - var(--top-window-height));
	// overflow: auto;
	.listcontent{
		padding-bottom: 40px;
	}
}
.split{
	padding: 0px 10px 0px 10px;
}
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
.paginations{
	position: absolute;
	bottom: 10px;
	// height: 40px;
	width: 99%;
	background-color: white;
}
.btnPosition{
	margin-left: 20px;
}
</style>
