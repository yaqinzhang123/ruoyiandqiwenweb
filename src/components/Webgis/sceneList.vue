<template>
	<div>
		<div class="optionBar">
			<el-row>
			  <el-col :span="12" >
				  <div class="iptstyle">
				  	<el-input
				  	  class="ipt"
				  	  placeholder="请输入内容"
				  	  v-model="listData.searchName"
				  	  clearable>
				  	</el-input>
				  	<el-button type="primary" plain @click="searchList">查询</el-button>
				  </div>
			  </el-col>
			  <el-col :span="12" class="btnstyle">
				  <el-button type="primary" @click="dialogFormVisible = true" >新建场景</el-button>
			  </el-col>
			</el-row>
		</div>
		<div class="list" >
			<div class="listcontent">
				<el-row>
				  <el-col v-for="(item,index) in routeCards" :key="index" :span="6">
					  <div  class="" >
					  	<el-card class="content" shadow="hover">
							<div class="scene" >
								<el-image class="image" v-if="item.img==''">
									<div slot="error" class="image-slot">
										<i class="el-icon-picture-outline">暂无图片</i>
									</div>
									</el-image>
								<img v-if="item.img!=''" :src="item.img" class="image">
					  		<!-- <div class="scene-name row">
					  			<span>场景名称：{{item.sceneName}}</span>
								  <span><svg-icon slot="prefix" icon-class="eye-open" class="el-input__icon input-icon mr-10" />{{item.visitsNumber}}</span>
					  		</div>
					  		<div class="row">
					  			<span>创建人：{{item.creator}}</span>
								  <span>创建时间：{{item.createTime}}</span>
					  		</div>
					  		<div class="sceneDesc">
					  			描述：<span>{{item.description}}</span>
					  		</div> -->
							  <el-descriptions class="margin-top" :title="item.sceneName" :column="2" size="small" >

								<template slot="extra">
									<i class="el-icon-view mr-10"></i>{{item.visitsNumber}}
								</template>
								<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-user"></i>
									创建人
								</template>
								{{item.creator}}
								</el-descriptions-item>
								<el-descriptions-item>
								<template slot="label">
									<i class="el-icon-time"></i>
									创建时间
								</template>
								{{item.createTime}}
								</el-descriptions-item>
								<el-descriptions-item>
									<template slot="label">
										<i class="el-icon-tickets"></i>
										备注
									</template>
									{{ item.description.length>25?item.description.substring(0,25)+"...":item.description }}
								</el-descriptions-item>
							</el-descriptions>
					  		</div>
					  		<div class="transition-box">
					  			<div>
					  				<el-row class="row">
					  					<el-col :span="8" class="switchServer" >
					  						<i class="el-icon-edit" @click="openUpdateDialog(item)">编辑</i>
					  					</el-col>
					  					<el-col :span="8" class="switchServer">
											<el-popconfirm
											  title="这是一段内容确定删除吗？"
											  @confirm="delProject(item.projectId)"
											>
											  <i slot="reference" class="el-icon-delete">删除</i>
											</el-popconfirm>
					  					</el-col>
					  				</el-row>
					  			</div>
					  		</div>
					  	</el-card>
					  </div>
				  </el-col>
				</el-row>
			</div>
		</div>
		<div class="paginations">
			<el-pagination
			  :page-size="page.pageSize"
			  :pager-count="11"
			  :current="page.pageCurrent" 
			  layout="prev, pager, next"
			  :total="page.total"
			  @current-change="handleCurrentChange"
				@size-change="handleSizeChange">
			</el-pagination>
		</div>
		<div class="dialog">
			<el-dialog title="新建场景" :visible.sync="dialogFormVisible">
				<el-form :model="form" status-icon :rules="check" ref="form" label-width="100px" class="demo-ruleForm">
				  <el-form-item label="场景名称" prop="sceneName">
				    <el-input v-model="form.sceneName" autocomplete="off"></el-input>
				  </el-form-item>
				 
				  <el-form-item label="场景描述" prop="description">
				    <el-input type="textarea" v-model="form.description"></el-input>
				  </el-form-item>

				  <el-form-item label="场景图片" prop="img">
				    <el-upload
  action="#"
  list-type="picture-card"
  :auto-upload="false"
   :limit=1
   :on-change="handleDownload"
   :file-list="fileList"
  >
    <i slot="default" class="el-icon-plus"></i>
    <div slot="file" slot-scope="{file}">
      <img
        class="el-upload-list__item-thumbnail"
        :src="file.url" alt=""
      >
      <span class="el-upload-list__item-actions">
        <span
          class="el-upload-list__item-preview"
          @click="handlePictureCardPreview(file)"
        >
          <i class="el-icon-zoom-in"></i>
        </span>
        <span
          v-if="!disabled"
          class="el-upload-list__item-delete"
          @click="handleRemove(file)"
        >
          <i class="el-icon-delete"></i>
        </span>
      </span>
    </div>
</el-upload>

				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="submitForm('form')">提交</el-button>
				    <el-button @click="resetForm('form')">重置</el-button>
				  </el-form-item>
				</el-form>
			</el-dialog>
			<el-dialog :visible.sync="dialogVisibleImg">
				<img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
		</div>
		<div class="dialog">
			<el-dialog title="编辑场景" :visible.sync="dialogFormUpdateVisible">
				<el-form :model="prepareCard" status-icon :rules="check" ref="upform" label-width="100px" class="demo-ruleForm">
				  <el-form-item label="场景名称" prop="projectName">
				    <el-input v-model="prepareCard.projectName" autocomplete="off"></el-input>
				  </el-form-item>
				  <el-form-item label="场景端口">
				    <el-input :disabled="true" v-model.number="prepareCard.projectPort"></el-input>
				  </el-form-item>
				  <el-form-item label="场景备注" prop="projectDesc">
				    <el-input type="textarea" v-model="prepareCard.projectDesc"  :rows="2"></el-input>
				  </el-form-item>
				  <el-form-item>
				    <el-button type="primary" @click="updateForm('upform')">更新</el-button>
				  </el-form-item>
				</el-form>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	import api from '@/api/webgis/index'
import svgIcons from '@/views/components/icons/svg-icons';
	export default {
    props: ["projectType"],
    data() {
        var checkPort = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("端口不能为空"));
            }
            setTimeout(() => {
                console.log(Number.isInteger(value));
                if (!Number.isInteger(value)) {
                    callback(new Error("请输入数字值"));
                }
                else {
                    callback();
                }
            }, 300);
        };
        return {
            //列表数据
            routeCards: [],
            //预备修改数据
            prepareCard: {},
            //列表搜索参数
            listData: {
                searchName: "",
                currentPage: 1,
                projectType: 1
            },
            //分页插件
            page: {
                pageSize: 10,
                pageCurrent: 1,
                total: 0,
            },
            //弹窗控制器
            dialogFormVisible: false,
            dialogFormUpdateVisible: false,
            //新增表单数据
            form: {
                sceneName: "",
                img: "",
                description: "",
            },
            //表单校验
            check: {
                sceneName: [
                    { required: true, message: "场景名称不能为空", trigger: "blur" },
                    { max: 15, message: "长度不超过 15 个字符", trigger: "blur" }
                ],
                description: [
                    { max: 40, message: "长度不超过 40 个字符", trigger: "blur" }
                ]
            },
			dialogImageUrl: '',
			dialogVisibleImg: false,
			disabled: false,
			fileList:[]
        };
    },
    methods: {
        async switchChange(projectId, switchTag) {
            var data = {};
            data.projectId = projectId;
            if (switchTag) {
                const res = api.openProject(data);
                this.$message.success("启动成功！");
            }
            else {
                const res = api.closeProject(data);
                this.$message.success("关闭成功！");
            }
        },
        toContent(projectId) {
            // uni.navigateTo({
            // 	url:'./routeContent?projectId='+projectId+'&projectType='+this.projectType
            // })
            // this.$router.push({name:'routeContent',query:{projectId:projectId,projectType:this.projectType}})
            this.$router.push(`/webgis/routeContent?projectId=${projectId}&projectType=${this.projectType}`);
        },
		handleRemove(file) {
			this.fileList=[];
			this.form.img=""
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleDownload(file,fileList) {
			this.fileList=fileList			
		},
		image2Base64(img) {//转base64的方法
			var canvas = document.createElement("canvas");
			canvas.width = img.width;
			canvas.height = img.height;
			var ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, img.width, img.height);
			var dataURL = canvas.toDataURL("image/png");//规定图片是什么格式，image/格式
			console.log(dataURL);
			return dataURL;
		},
        submitForm(formName) {
            this.$refs[formName].validate((check) => {
                if (check) {
                    this.insertRoute();
                    this.$refs[formName].resetFields();
                }
                else {
                    this.$message.error("请检查填写的数据!");
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        openUpdateDialog(item) {
            this.dialogFormUpdateVisible = true;
            this.prepareCard = item;
        },
        updateForm(formName) {
            this.$refs[formName].validate((check) => {
                if (check) {
                    this.updateRoute();
                    // this.$refs[formName].resetFields();
                }
                else {
                    this.$message.error("请检查填写的数据!");
                    return false;
                }
            });
        },
        async delProject(projectId) {
            var req = {};
            req.projectId = projectId;
            const res = await api.delRoute(req);
            if (res.code == 200) {
                this.$message.success("删除成功");
                this.initList();
            }
            else {
                this.$message.error(res.msg);
            }
        },
        searchList() {
            this.initList();
        },
        handleCurrentChange(currentPage) {
            this.page.currentPage = currentPage;
            this.initList();
        },
        handleSizeChange(pageCount) {
            this.page.pageSize = pageCount;
            this.initList();
        },
        async insertRoute() {
			if(this.fileList!=[]&&this.fileList.length>0){
				var img = new Image();
				img.src=this.fileList[0].url;
				this.form.img = this.image2Base64(img);
			}				
            var res = await api.addScene(this.form);
            if (res.code == 200) {
                this.$message.success("新增成功");
                this.dialogFormVisible = false;
                this.initList();
            }
            else {
                this.$message.error(res.msg);
            }
            // console.log(res)
        },
        async initList() {
            var res = await api.sceneList(this.listData);
            if (!res.code == 200) {
                this.$message.error(res.msg);
            }
            else {
                this.routeCards = res.data.data;
                this.page.pageCurrent = res.data.currentPage;
                this.page.pageSize = res.data.pageSize;
                this.page.total = res.data.totalCount;
            }
        },
        async updateRoute() {
            var res = await api.updateRoute(this.prepareCard);
            if (res.code == 200) {
                this.$message.success("编辑成功");
                this.dialogFormUpdateVisible = false;
                this.initList();
            }
            else {
                this.$message.error(res.msg);
            }
        },
        child() {
            console.log("执行child");
        }
    },
    components: { svgIcons }
}
</script>

<style lang="scss" scoped>
.optionBar{
	background-color: #eeeeee6e;
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
	text-align: center;
	height: calc(100vh - 65px - var(--top-window-height));
	// overflow: auto;
	.listcontent{
		padding-bottom: 40px;
	}
}
.paginations{
	position: absolute;
	bottom: 20px;
	// height: 40px;
	width: 99%;
	background-color: white;
}
 
 .content{
	box-shadow:3px 3px  4px #ccc;
 	width: 98%;
 	// height: 185px;
 	position: relative;
 	width: 95%;
	// height: 280px;
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
	border: #ccc solid 1px;
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
 .scene{
 	color: rgba(153,153,153,.7);
 	text-align: left;
 	padding: 10px 0px;
 	.scene-name{
 		
 		display: flex;
 		height: 40px;
 		line-height: 40px;
 		color: #5bb0cc;
 	}
	
 	.sceneDesc{
 		margin-top: 13px;
 		border-bottom: 1px dashed rgba(204,204,204,.65);
 		margin-bottom: 7px;
		height: 40px;
 	}
 }
 .status-open{
	 width: 15px;
	 height: 15px;
	 position: absolute;
	 background-color: #55ff7f;
	 border-radius: 10px;
	 top: 5px;
	 left: 5px;
 }
 .row{
		display: flex;
		justify-content: space-between;
	}
 .status-close{
	width: 15px;
	height: 15px;
	position: absolute;
	background-color: #ff0000;
	border-radius: 10px;
	top: 5px;
	left: 5px; 
 }
 .image{
	height: 200px;
	width:360px;
 }

</style>
