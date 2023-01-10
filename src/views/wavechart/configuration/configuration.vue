<template>
    <el-dialog 
  title="通道配置信息"
  :visible.sync="show"
  :before-close="cancel"
  >
  <el-form  :model="data" class="dialog" size="small">
    <el-form-item label="名称" :label-width="formLabelWidth">
      <el-input v-model="data.name" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="显示状态" :label-width="formLabelWidth">
        <el-checkbox v-model="data.current" >显示当前</el-checkbox>
        <el-checkbox v-model="data.old" >显示历史</el-checkbox>
    </el-form-item>
    <el-form-item label="刻度(mm/div)" :label-width="formLabelWidth">
        <el-input v-model="data.scale" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="位移(divs)" :label-width="formLabelWidth">
        <el-input v-model="data.offset" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="颜色" :label-width="formLabelWidth">
        <el-color-picker v-model="data.color" ></el-color-picker>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="cancel">取 消</el-button>
    <el-button type="primary" @click="handleOK">确 定</el-button>
    <el-button type="primary" @click="handle">应用</el-button>
  </span>
</el-dialog>
</template>


<script>
export default {
    name: "configuration",
    props: {
        data:{},
        show: {
            type: Boolean,
        }, 
    },
    data() {
        return {
            formLabelWidth: '120px'
        }
    },
    methods: {
        handle(){
            this.cancel();
        },
        handleOK(){
            this.cancel();
        },
        cancel(){
            this.$emit("output",this.data)
        }
      
    }
}
</script>

<style scoped>
.dialog{
    width:100%
}
::v-deep .el-input__inner{
    width: 300px;
    cursor: pointer;
}
</style>
