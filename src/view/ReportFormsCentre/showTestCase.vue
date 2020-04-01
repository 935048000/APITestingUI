<!--DataReportMonth-->
<template>
  <div class="app-contion">
    <div class="table-box" style="height: 40px;">
      <!--<el-date-picker-->
      <!--v-model="value1"-->
      <!--type="daterange"-->
      <!--range-separator="至"-->
      <!--value-format="yyyy-MM-dd"-->
      <!--start-placeholder="必选开始日期"-->
      <!--end-placeholder="必选结束日期"-->
      <!--&gt;</el-date-picker>-->
      <el-button type="primary" @click="searchs">查询</el-button>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>

    <!-- 先展示表格设置，tableData是需要填入的数据-->
    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="id" label="测试用例ID"></el-table-column>
        <el-table-column prop="host" label="测试服务主机"></el-table-column>
        <el-table-column prop="port" label="测试端口"></el-table-column>
        <el-table-column prop="url" label="测试API"></el-table-column>
        <el-table-column prop="requests_data" label="测试请求内容" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="result" label="测试指定响应内容" :show-overflow-tooltip="true"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  export default {

    data() {
      return {
        tableData: [],
        value1: "",
        tableHeight: window.innerHeight - 200
      };
    },

    methods: {
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      },

      // 点击查询按钮触发的事件
      searchs() {
        let _self = this;
        console.log(_self.value1);
        let formData1 = new FormData();
        // 传的参数
        // formData1.append("startDate", _self.value1[0]);
        // formData1.append("stopDate", _self.value1[1]);
        // console.log(formData1);
        _self.axios
        // 请求接口
          .post(_self.ApiUrlData + "/testing/showTestCase", formData1)
          .then(response => {
            if (response.data.errcode == "0") {
              console.log(response);
              _self.tableData = response.data.data.data;
            } else {
              _self.$message.error("数据找不到啦，请刷新重试");
            }
            console.log(response.data.data.data);
          })
          .catch(function(error) {
            // console.log(error);
            _self.$message.error("响应时间过长，请重试11111");
          });
      }
    },
    created: function() {
      let _self = this;
      _self.searchs();
    }
  };
</script>

<style>
  .app-contion {
    margin: 10px;
  }

  .el-card__body {
    font-size: 16px;
  }

  .el-card {
    width: 100%;
  }

  .people {
    display: inline-block;
    margin: 10px 0;
  }

  .table-box {
    margin: 10px 0;
    position: relative;
  }

  .footerdeom {
    position: fixed;
    right: 10px;
    bottom: 10px;
  }

  .daochu {
    position: absolute;
    right: 5px;
    top: 0;
  }

  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
  }

  .el-table__body-wrapper {
    overflow-x: auto;
    overflow-y: auto;
  }

  .collapse-title {
    flex: 1 0 90%;
    order: 1;
  }

  .el-collapse-item__header {
    flex: 1 0 auto;
    order: -1;
  }
  /*!*滚动条的宽度*!*/
  /*::-webkit-scrollbar {*/
  /*width: 15px;*/
  /*height: 10px;*/
  /*}*/
  /*!*滚动条的滑块*!*/
  /*::-webkit-scrollbar-thumb {*/
  /*background-color: #a1a3a9;*/
  /*border-radius: 3px;*/
  /*}*/

  /*滚动条的宽度*/
  /*.el-table__body-wrapper::-webkit-scrollbar {*/
  /*width: 6px; // 横向滚动条*/
  /*height: 6px; // 纵向滚动条 必写*/
  /*}*/
  /*滚动条的滑块*/
  /*.el-table__body-wrapper::-webkit-scrollbar-thumb {*/
  /*background-color: #ddd;*/
  /*border-radius: 3px;*/
  /*}*/
</style>
