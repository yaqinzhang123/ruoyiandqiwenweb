<template>
  <div class="select-column">
    <div class="text" @click="handleSetShowColumnBtnClick">
      <i class="el-icon-s-operation"></i>
      设置显示字段
    </div>
    <div class="text" @click="handleSetShowColumnBtnClick1">
      <i class="el-icon-coin"></i>
      查看存储大小
    </div>
    <!-- 对话框 当点击"设置显示列"按钮时弹出对话框 -->
    <el-dialog
      title="设置表格列显隐"
      width="700px"
      :append-to-body="true"
      :visible.sync="dialogVisible"
    >
      <!-- 多选框组件 勾选需要在表格中显示的列 -->
      <el-checkbox-group v-model="selectedColumn">
        <el-checkbox
          v-for="item in columnOptions"
          :key="item.value"
          :label="item.value"
          >{{ item.label }}</el-checkbox
        >
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOk()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="查看存储空间"
      width="700px"
      :append-to-body="true"
      :visible.sync="dialogVisible1"
    >
      <!-- 存储信息显示 -->
      <div class="storage-wrapper" :class="{ fold: isCollapse }">
        <el-progress
          :percentage="storagePercentage"
          :color="storageColor"
          :show-text="false"
          :type="isCollapse ? 'circle' : 'line'"
          :width="32"
          :stroke-width="isCollapse ? 4 : 6"
          stroke-linecap="square"
        ></el-progress>
        <div class="text" v-show="!isCollapse">
          <span class="label">存储</span>
          <span>
            {{ $file.calculateFileSize(storageValue) }} /
            {{ $file.calculateFileSize(totalStorageValue) }}
          </span>
        </div>
        <div class="text" v-show="isCollapse">
          <span>{{ $file.calculateFileSize(storageValue) }}</span>
        </div>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
			<span>总存储空间(M):</span>
		</el-col>
		<el-col :span="10">
			<el-input placeholder="请输入大小" v-model="totalStorage" :disabled="buttonVisiabled">
				<template slot="append">M</template>
          </el-input>
		</el-col>
		<el-col :span="8">
          <el-button v-if="buttonVisiabled"
            type="primary"
            icon="el-icon-edit"
            @click="buttonVisiabled=false"
          ></el-button>
		  </el-col
      ></el-row>
      <span slot="footer" class="dialog-footer" v-if="!buttonVisiabled">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="dialogOk1()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setTotalStorage } from '@/api/file/file'
export default {
  name: "SelectColumn",
  data() {
    return {
      isCollapse: false, //  控制菜单收缩展开
      //  自定义进度条颜色，不同占比，进度条颜色不同
      storageColor: [
        { color: "#67C23A", percentage: 50 },
        { color: "#E6A23C", percentage: 80 },
        { color: "#F56C6C", percentage: 100 },
      ],
      dialogVisible: false,
      dialogVisible1: false,
      selectedColumn: [], //  被选中的表格需要显示的列
      columnOptions: [
        {
          value: "extendName",
          label: "类型",
        },
        {
          value: "fileSize",
          label: "大小",
        },
        {
          value: "uploadTime",
          label: "修改日期",
        },
        {
          value: "deleteTime",
          label: "删除日期",
        },
      ],
	  buttonVisiabled:true,
      totalStorage:0,
      usedstorageValue:0,
    };
  },
  methods: {
    /**
     * 设置显示列按钮点击事件
     * @description 获取 Vuex 中存储的表格显示列
     *              并打开对话框
     */
    handleSetShowColumnBtnClick() {
      this.selectedColumn = this.$store.getters.selectedColumnList;
      this.dialogVisible = true;
    },
    handleSetShowColumnBtnClick1() {
      this.selectedColumn = this.$store.getters.selectedColumnList;
      this.dialogVisible1 = true;
    },
    /**
     * 对话框 确定按钮点击事件
     * @description 通过提交 mutation 更新表格显示列
     *              并关闭对话框
     */
    dialogOk() {
      this.$store.commit("changeSelectedColumnList", this.selectedColumn);
      this.dialogVisible = false;
    },
    dialogOk1() {
		if(this.totalStorage!=this.$store.state.sideMenu.totalStorageValue&&this.totalStorage>this.usedstorageValue){
			this.$store.commit("setTotalStorageValue", this.totalStorage*1024*1024);
			let params={
			totalStorage:this.totalStorage
		}
		setTotalStorage(params).then((res)=>{
			if(res.code==200){
				this.dialogVisible1 = false;
				this.buttonVisiabled = true;
			}else{
				this.$message.error(res.msg)
			}
		})
		}else{
			this.$message.error(`总存储大小需大于已用存储大小！已用存储:${this.usedstorageValue.toFixed(1)}M,设置容量大小：${this.totalStorage} M。`)
		}  
		
  
    },
  },
  computed: {
    // 存储容量
    storageValue() {
		this.usedstorageValue=this.$store.state.sideMenu.storageValue/1024/1024
      return this.$store.state.sideMenu.storageValue;
    },
    totalStorageValue() {
		this.totalStorage=this.$store.state.sideMenu.totalStorageValue/1024/1024
      return this.$store.state.sideMenu.totalStorageValue;
    },
    // 存储百分比
    storagePercentage() {
      return this.totalStorageValue
        ? (this.storageValue / this.totalStorageValue) * 100
        : 0;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/varibles.scss";

.select-column {
  .text {
    padding-top: 8px;

    &:hover {
      cursor: pointer, color $Primary;
    }
  }
}

.storage-wrapper {
  box-shadow: 0 -2px 12px 0 $BorderExtralight;
  box-sizing: border-box;
  width: calc(100% - 11px);
  height: 66px;
  padding: 16px;
  z-index: 2;
  color: $PrimaryText;

  .text {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    flex-wrap: wrap;
  }
}

.storage-wrapper.fold {
  padding: 0;

  v-deep .el-progress--circle {
    margin: 0 auto;
    width: 32px;
    display: block;
  }

  .text {
    font-size: 12px;
    justify-content: center;
  }
}
</style>
