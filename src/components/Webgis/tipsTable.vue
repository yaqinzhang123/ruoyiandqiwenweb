<template>
    <div>
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      :cell-style="{ 'text-align': 'center' }"
      :header-cell-style="{
        'text-align': 'center',
        background: '#f6f8fa',
        color: '#333',
      }"
      border
      size="mini"
      fit
      stripe
      style="width: 100%">
      <el-table-column
        prop="type"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="extendName"
        label="格式">
      </el-table-column>
      <el-table-column
        prop="descript"
        label="上传要求">
      </el-table-column>    
    </el-table>
    </div>
</template>
<script>
import { tableData } from '@/libs/tips';
export default{
    name:'tipsTabel',
    data(){
        return {
          tableData,
            //合并表格
      columnArr: ["type","extendName",'descript'],
      spanArr: [], //临时组
      spanData: [], // 组合的合并组
        }
    },
    methods:{
// 计算需要合并的单元格
getSpanData(data) {
      this.spanData = [];
      this.columnArr.forEach((element) => {
        let contactDot = 0;
        this.spanArr = [];
        data.forEach((item, index) => {
          if (index === 0) {
            this.spanArr.push(1);
          } else {
            if (item[element] === data[index - 1][element]) {
              this.spanArr[contactDot] += 1;
              this.spanArr.push(0);
            } else {
              contactDot = index;
              this.spanArr.push(1);
            }
          }
        });
        this.spanData.push(this.spanArr);
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.columnArr.includes(column.property)) {
        if (this.spanData[columnIndex][rowIndex]) {
          return {rowspan: this.spanData[columnIndex][rowIndex],
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    },
    created(){
        this.getSpanData(this.tableData);
    }
}
</script>