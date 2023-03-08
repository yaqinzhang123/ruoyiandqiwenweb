<template>
  <div class="app-container">
    <div class="optionBar">
      <el-row>
        <el-col :span="18">
          <div class="iptstyle">
            <el-input
              class="ipt"
              placeholder="请输入要搜索的文件名"
              v-model="searchReqParam.searchName"
              clearable
            >
            </el-input>
            <el-select
              class="split"
              v-model="searchReqParam.resourceType"
              placeholder="请选择状态"
            >
              <el-option
                v-for="statuParam in statuParams"
                :key="statuParam.value"
                :label="statuParam.label"
                :value="statuParam.value"
              >
              </el-option>
            </el-select>
            <el-select
              class="split"
              v-model="searchReqParam.modelType"
              placeholder="请选择模型类型"
            >
              <el-option
                v-for="modelParam in modelParams"
                :key="modelParam.value"
                :label="modelParam.label"
                :value="modelParam.value"
              >
              </el-option>
            </el-select>
            <el-button type="primary" plain @click="searchList">查询</el-button>
          </div>
        </el-col>
        <el-col :span="6" class="btnstyle">
          <el-button type="primary" @click="handelUpload"
            >上传<i class="el-icon-upload el-icon--right"></i
          ></el-button>
        </el-col>
      </el-row>
    </div>
    <div id="list" class="list" ref="list">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">
            <el-table
              class="listcontent"
              stripe
              :data="searchRspData.data"
              style="width: 100%"
            >
              <el-table-column label="序号" width="70" type="index">
              </el-table-column>
              <el-table-column label="类型" width="100">
                <template slot-scope="scope">
                  <span>{{ getModelType(scope.row.modelType) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称" width="250">
                <template slot-scope="scope">
                  <span>{{ scope.row.resourceName }}</span>
                </template>
              </el-table-column>
              <el-table-column label="描述" width="250">
                <template slot-scope="scope">
                  <span>{{ scope.row.description }}</span>
                </template>
              </el-table-column>
              <el-table-column label="上传时间" width="180">
                <template slot-scope="scope">
                  <span>{{ formatDate1(scope.row.createTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="访问次数" width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.visitsNumber }}</span>
                </template>
              </el-table-column>
              <el-table-column label="数据状态" width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.resourceStatus }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-download"
                    @click="
                      downloadFile(scope.$index, scope.row.resourceDownUrl)
                    "
                    >下载</el-button
                  >
                  <el-button
                    size="mini"
                    icon="el-icon-view"
                    type="info"
                    @click="
                      showView(
                        scope.$index,
                        scope.row.resourceShareUrl,
                        scope.row
                      )
                    "
                    >预览</el-button
                  >
                  <el-button
                    size="mini"
                    type="success"
                    icon="el-icon-edit"
                    @click="
                      edit(scope.$index, scope.row.resourceApiUrl, scope.row)
                    "
                    >修改</el-button
                  >
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
                      icon="el-icon-delete"
                      >删除</el-button
                    >
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
    </div>

    <div type="flex" class="paginations">
      <el-pagination
        show-icon
        :page-size="searchRspData.pageSize"
        :current="searchRspData.currentPage"
        :total="searchRspData.totalCount"
        @change="changePage"
      />
    </div>
          <webupload
            :dialogVisible="dialogVisible"
            :fileNumLimit="fileNumLimit"
            :fileSize="fileSize"
            :chunkSize="chunkSize"
            :uploadSuffixUrl="uploadSuffixUrl"
            :options="options"
            :fileListData="fileList"
            @output="handelUpload"
            @initListData="initListData"
          >
          </webupload>
      <el-dialog :visible.sync="dialogVisible1" width="50%"    title="修改"
        >
	  <el-form :model="operation">
    <el-form-item label="类型" :label-width="formLabelWidth">
      <label>{{getModelType(operation.modelType ) }}</label>
    </el-form-item>
    <el-form-item label="名称" :label-width="formLabelWidth">
		<label>{{ operation.resourceName }}</label>
    </el-form-item>
	<el-form-item label="描述" :label-width="formLabelWidth">
		<el-input
			type="textarea"
			:rows="2"
			placeholder="请输入描述"
			v-model="operation.description">
			</el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="handleEdit">确 定</el-button>
  </div>
</el-dialog>


  </div>
</template>

<script>
import webupload from "@/components/Webgis/webUpload1.vue";
import api from "@/api/webgis/index";
import router from "@/router/index.js";
import { getToken } from "@/utils/auth";
import { formatDate } from "@/utils/index";
let BASE_URL = process.env.VUE_APP_BASE_API;
export default {
  components: { webupload },
  data() {
    return {
		formLabelWidth:'80px',
      fileList: [], //显示集合
      fileNumLimit: 200, //文件总数
      fileSize: 100 * 1024 * 1024 * 1024, //默认上传文件大小
      chunkSize: 50 * 1024 * 1024, //默认文件片段
      uploadSuffixUrl: BASE_URL,
      options: {
        //允许上传的文件
        fileType:
          "doc,docx,pdf,xls,xlsx,ppt,pptx,gif,jpg,jpeg,bmp,png,rar,zip,mp4,avi",
        fileUploadUrl: "/uploadResource/fileRecord/zone/upload", //上传地址
        fileCheckUrl: "/uploadResource/fileRecord/zone/upload/md5Check", //检测文件是否存在url
        checkChunkUrl: "/uploadResource/fileRecord/zone/upload/md5Check", //检测分片url
        mergeChunksUrl: "/uploadResource/fileRecord/zone/upload/merge/", //合并文件请求地址
        headers: {},
        projectId: "",
      },
      searchReqParam: {
        searchName: "",
        resourceType: 0,
        currentPage: 1,
        pageSize: 10,
        projectId: 51,
        modelType: 0,
      },
      searchRspData: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 0,
        totalPage: 1,
        data: [],
      },
      statuParams: [
        {
          label: "全部状态",
          value: 0,
        },
        {
          label: "解压中",
          value: 1,
        },
        {
          label: "转换中",
          value: 2,
        },
        {
          label: "转换完成",
          value: 3,
        },
      ],
      modelParams: [
        {
          label: "全部类型",
          value: 0,
        },
        {
          label: "倾斜摄影",
          value: 1,
        },
        {
          label: "Revit",
          value: 2,
        },
        {
          label: "3DMax",
          value: 3,
        },
        {
          label: "矢量数据",
          value: 4,
        },
        {
          label: "三维部件",
          value: 5,
        },
        {
          label: "全景影像",
          value: 6,
        },
      ],
      tableHeight: 500,
      input: "",
      formInline: {
        user: "",
        region: "",
      },
      tableData: [],
      dialogVisible: false,
      dialogVisible1: false,
      header: {
        Authorization: "Bearer " + getToken(),
      },
      fileList: [],
      uploadData: {
        projectId: "",
      },
      operation: {
        description: "",
        modelType: 0,
        projectId: 0,
        resourceApiUrl: "",
        resourceDownUrl: "",
        resourceId: 0,
        resourceName: "",
        resourceNo: "",
        resourcePath: "",
        resourceShareUrl: "",
        resourceStatus: "",
        visitsNumber: 0,
      },
    };
  },
  methods: {
    handelUpload(){
     this.dialogVisible=!this.dialogVisible
    },
    async initListData() {
      const res = await api.resourceList(this.searchReqParam);
      if (res.code == 200) {
        this.searchRspData.data = res.data.data;
        this.searchRspData.currentPage = res.data.currentPage;
        this.searchRspData.pageSize = res.data.pageSize;
        this.searchRspData.totalCount = res.data.totalCount;
        this.searchRspData.totalPage = res.data.totalPage;
        console.log(this.searchRspData);
      } else {
        this.$message.error(res.msg);
      }
    },
    formatDate1(value) {
      return formatDate(value);
    },
    changePage(e) {
      this.searchReqParam.currentPage = e.current;
      this.initListData();
    },
    searchList() {
      this.initListData();
    },
    downloadFile(index, row) {
      let dload = document.createElement("a");

      //  dload.download = '';// 设置下载的文件名，默认是'下载'
      dload.href = row;
      document.body.appendChild(dload);
      dload.click();
      dload.remove(); // 下载之后把创建的元素删除
      this.$message.success("正在下载");
    },
    getModelType(key) {
      let label = "";
      this.modelParams.map((item) => {
        if (item.value == key) {
          label = item.label;
        }
      });
      return label;
    },
    edit(index, row, obj) {
      this.dialogVisible1 = true;
		this.operation=obj
    },
	handleEdit(){
		if(this.operation.description!=""){
			let data={
				resourceId:this.operation.resourceId,
				description:this.operation.description,
			}		
			api.resourceEdit(data).then((res)=>{
				if(res.code==200){
					this.$message.success("修改成功！");
					this.dialogVisible1=false
					this.initListData()
				}
			})
		}
	},
	cancel(){
		this.operation={}
		this.dialogVisible1=false
	},
    showView(index, row, obj) {
      //判断数据是否转换完成
      if (obj.resourceStatus == "转换完成") {
        var params = {};
        params.id = obj.resourceId;
        api.visits(params).then((res) => {
            this.initListData();
        });
        row =
          process.env.VUE_APP_BASE_API +
          "/view" +
          row +
          "&ip=" +
          process.env.VUE_APP_BASE_API.split(":")[0];
        let dload = document.createElement("a");
        dload.target = "_blank";
        //  dload.download = '';// 设置下载的文件名，默认是'下载'
        dload.href = row;
        document.body.appendChild(dload);
        dload.click();
        dload.remove();
      } else {
        this.$message.error("等待数据转换完成，生成访问地址！");
      }
    },
    // openShare(index,row,obj){
    // 	//判断数据是否转换完成
    // 	if(obj.resourceStatus=="转换完成"){
    // 		// if(!row.indexOf(ProjectConfig.BASE_URL) != -1 ){
    // 		// 	//不含有
    // 		// 	row=row.replace(ProjectConfig.OUTSIDE_URL,ProjectConfig.BASE_URL)
    // 		// }
    // 		uni.showModal({
    // 		   title: '访问地址',
    // 		   confirmText: '复制',
    // 		   content: row,
    // 		   success: function (res) {
    // 		       if (res.confirm) {
    // 		           uni.setClipboardData({
    // 					   data:row,//要被复制的内容
    // 					 });
    // 		       }
    // 		   }
    // 		});
    // 		// confirm	Boolean	为 true 时，表示用户点击了确定按钮
    // 		// cancel	Boolean	为 true 时，表示用户点击了取消（用于 Android 系统区分点击蒙层关闭还是点击取消按钮关闭）

    // 		// this.$alert('<strong>这是 <i>http://123.183.159.205:10106\\672962b9408544838354f616478221bd</i> 片段</strong>', '访问地址', {
    // 		//           confirmButtonText: '复制',
    // 		// 		  dangerouslyUseHTMLString: true,
    // 		// 		  label-width:550,
    // 		//           callback: action => {

    // 		//           }
    // 		// });
    // 	}else{
    // 		this.$message.error('等待数据转换完成，生成访问地址！');
    // 	}
    // },
    async handleDelete(resourceId) {
      console.log(resourceId);
      var req = {};
      req.resourceId = resourceId;
      const res = await api.delResource(req);
      if (res.code == 200) {
        this.initListData();
      } else {
        this.$message.error(res.msg);
      }
    },
    beforeUpload(file) {
      console.log(file);
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "zip";
      const isLt2M = file.size / 1024 / 1024 < 20480;
      if (!extension) {
        this.$message({
          message: "上传文件只能是 zip格式!",
          type: "warning",
        });
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 20GB!",
          type: "warning",
        });
      }
      return extension && isLt2M;
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
    closeUpload() {
      this.searchReqParam.currentPage = 1;
      this.searchRspData.currentPage = 1;
      this.initListData();
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
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}?`);
    },
  },
  created() {
    // this.tableHeight=this.$refs.list.offsetHeight;
    // alert(this.$refs.list.offsetHeight)
    // this.tableHeight= '100%'
    // console.log(this.tableHeight)
    this.searchReqParam.projectId = 51;
    this.uploadData.projectId = 51;
    this.options.projectId = 51;
    this.initListData();
    // alert(option.projectId+"::"+option.projectType)
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.webuploader-pick {
  position: relative;
  display: inline-block;
  cursor: pointer;
  background: #409eff;
  padding: 8px 12px;
  color: #fff;
  font-size: 10px;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
}
.webuploader-pick-hover {
  background: #409eff;
}
.list {
  text-align: center;
  height: calc(100vh - 65px - var(--top-window-height));
  // overflow: auto;
  .listcontent {
    padding-bottom: 40px;
  }
}
.split {
  padding: 0px 10px 0px 10px;
}
.optionBar {
  background-color: #eeeeee;
  height: 90px;
  line-height: 90px;
  padding: 10px;
}
.iptstyle {
  text-align: left;
}
.btnstyle {
  text-align: right;
  padding-right: 20px;
}
.ipt {
  width: 300px;
  padding: 0px 10px 0px 10px;
}
.paginations {
  position: absolute;
  bottom: 10px;
  // height: 40px;
  width: 99%;
  background-color: white;
}
.btnPosition {
  margin-left: 20px;
}
label{
	font-size: 14px;
	font-weight: 500;
}
</style>
