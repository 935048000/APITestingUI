<!--DataReportMonth-->
<template>
  <div class="app-contion">
    <div class="table-box" style="height: 40px;">
      <!--<el-date-picker-->
      <!--v-model="value1"-->
      <!--type="datetimerange"-->
      <!--range-separator="至"-->
      <!--value-format="yyyy-MM-dd HH:mm:ss"-->
      <!--start-placeholder="必选开始日期"-->
      <!--end-placeholder="必选结束日期"-->
      <!--&gt;</el-date-picker>-->
      <el-date-picker
        v-model="value1"
        type="datetimerange"
        value-format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button type="primary" @click="dateSearchs">查询</el-button>
      <el-button type="primary" @click="searchs">刷新</el-button>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>

    <!-- 先展示表格设置，tableData是需要填入的数据-->
    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="id" label="测试结果ID"></el-table-column>
        <el-table-column prop="test_code" label="测试单号"></el-table-column>
        <el-table-column prop="test_username" label="测试用户名"></el-table-column>
        <el-table-column prop="testcase_id" label="测试用例ID"></el-table-column>
        <el-table-column prop="testcase_result" label="测试用例返回数据" :show-overflow-tooltip="true"></el-table-column>

        <el-table-column prop="testcase_recode" label="测试用例返回码"></el-table-column>
        <el-table-column prop="testcase_count" label="测试次数"></el-table-column>
        <el-table-column prop="create_at" label="测试时间"></el-table-column>

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
      exportExcel() {
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../vendor/Export2Excel");
          const tHeader = [
            "测试结果ID",
            "测试单号",
            "测试用户名",
            "测试用例ID",
            "测试用例返回数据",
            "测试用例返回码",
            "测试次数",
            "测试时间"
          ];
          // 上面设置Excel的表格第一行的标题
          const filterVal = [
            "id",
            "test_code",
            "test_username",
            "testcase_id",
            "testcase_result",
            "testcase_recode",
            "testcase_count",
            "create_at"
          ];
          // 上面的index、nickName、name是tableData里对象的属性
          const list = this.tableData; //把data里的tableData存到list
          const data = this.formatJson(filterVal, list);
          var dayTemp = new Date();
          dayTemp.setTime(dayTemp.getTime());
          var excelFlieName =
            dayTemp.getFullYear() +
            "-" +
            (dayTemp.getMonth() + 1) +
            "-" +
            dayTemp.getDate() +
            "测试结果";
          export_json_to_excel(tHeader, data, excelFlieName);
        });
      },
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
          .post(_self.ApiUrlData + "/testing/showTestResult", formData1)
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
      },
      dateSearchs() {
        let _self = this;
        console.log(_self.value1);
        let formData1 = new FormData();
        // 传的参数
        formData1.append("startDate", _self.value1[0]);
        formData1.append("stopDate", _self.value1[1]);
        console.log(formData1);
        _self.axios
        // 请求接口
          .post(_self.ApiUrlData + "/testing/showAppointTestResult", formData1)
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
