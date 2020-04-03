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
      <el-button type="primary" @click="searchs">刷新</el-button>
      <el-button type="success" style="padding: 12px 20px;" @click="add">新增测试用例</el-button>
      <el-button type="success" class="daochu" @click="exportExcel">导出</el-button>
    </div>

    <!-- 先展示表格设置，tableData是需要填入的数据-->
    <div id="tableid">
      <el-table :data="tableData" border style="width: 100%" :height="tableHeight">
        <el-table-column prop="id" label="测试用例ID"></el-table-column>
        <el-table-column prop="host" label="测试服务主机"></el-table-column>
        <el-table-column prop="host_id" label="测试服务主机ID"></el-table-column>
        <el-table-column prop="port" label="测试端口"></el-table-column>
        <el-table-column prop="url" label="测试API"></el-table-column>
        <el-table-column prop="requests_data" label="测试请求内容" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="result" label="测试指定响应内容" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹出编辑 -->
    <el-dialog title="编辑" :visible.sync="dialogVisible2" width="20%" :before-close="handleClose">
      <div style="margin-bottom: 15px;">
        <span>测试服务主机ID：</span>
        <el-input v-model="t_host_id" placeholder="请修改" class="width-input"></el-input>
      </div>
      <div style="margin-bottom: 15px;">
        <span>测试URL：</span>
        <el-input v-model="t_url" placeholder="请修改" class="width-input"></el-input>
      </div>
      <div style="margin-bottom: 15px;">
        <span>测试请求内容：</span>
        <el-input v-model="t_requests_data" placeholder="请修改" class="width-input"></el-input>
      </div>
      <div style="margin-bottom: 15px;">
        <span>测试指定响应内容：</span>
        <el-input v-model="t_result" placeholder="请修改" class="width-input"></el-input>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleEditupdate">确 定</el-button>
      </span>
    </el-dialog>

    <!--新增弹框-->
    <el-dialog title="新增测试用例" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="title-box">
        <label class="titles w-30">服务主机ID：</label>
        <el-input v-model="t_host_id" placeholder="请输入内容" style="width:60%;"></el-input>
      </div>
      <div class="title-box">
        <label class="titles w-30">服务API：</label>
        <el-input v-model="t_url" placeholder="请输入内容" style="width:60%;"></el-input>
      </div>
      <div class="title-box">
        <label class="titles w-30">测试请求内容：</label>
        <el-input v-model="t_requests_data" placeholder="请输入内容" style="width:60%;"></el-input>
      </div>
      <div class="title-box">
        <label class="titles w-30">测试指定响应内容：</label>
        <el-input v-model="t_result" placeholder="请输入内容" style="width:60%;"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addup" v-bind:style="{ display: display2 }">提 交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  export default {

    data() {
      return {
        tableData: [],
        value1: "",
        t_host_id:"",
        t_url:"",
        t_requests_data:"",
        dialogVisible2:false,
        dialogVisible:false,
        t_result:"",
        tableHeight: window.innerHeight - 200
      };
    },

    methods: {

      exportExcel() {
        require.ensure([], () => {
          const { export_json_to_excel } = require("../../vendor/Export2Excel");
          const tHeader = [
            "测试用例ID",
            "测试服务主机",
            "测试服务主机ID",
            "测试端口",
            "测试API",
            "测试请求内容",
            "测试指定响应内容"
          ];
          // 上面设置Excel的表格第一行的标题
          const filterVal = [
            "id",
            "host",
            "host_id",
            "port",
            "url",
            "requests_data",
            "result"
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
            "测试用例";
          export_json_to_excel(tHeader, data, excelFlieName);
        });
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]));
      },
      handleEdit(index, row) {
        this.dialogVisible2 = true;
        this.id = this.tableData[index].id;
        this.t_host_id = this.tableData[index].host_id;
        this.t_url = this.tableData[index].url;
        this.t_requests_data = this.tableData[index].requests_data;
        this.t_result = this.tableData[index].result;
      },
      handleEditupdate() {
        let _self = this;
        let formData = new FormData();
        formData.append('testcase_id', _self.id);
        formData.append('url', _self.t_url);
        formData.append('requests_data', _self.t_requests_data);
        formData.append('result', _self.t_result);
        formData.append('host_id', _self.t_host_id);
        _self.axios.post(_self.ApiUrlData + "/testing/updateTestCase", formData).then(response => {
          if (response.data.errcode == '0') {
            _self.dialogVisible2 = false
            console.log("修改成功")
            _self.searchs()
          } else {
            _self.$message.error('编辑失败');
          }
        }).catch(function(error) {
          _self.$message.error('数据响应时间过长，请重试');
        });
      },


      add() {
        let _self = this;
        _self.dialogVisible = true;
        _self.disableds = false;
        _self.display1 = "none";
        _self.display2 = "block";
        _self.t_host_id = "";
        _self.t_url = "";
        _self.t_requests_data = "";
        _self.t_result = "";
        let formData3 = new FormData();
      },
      addup() {
        let _self = this;
        let formData = new FormData();
        formData.append('host_id', _self.t_host_id);
        formData.append('url', _self.t_url);
        formData.append('requests_data', _self.t_requests_data);
        formData.append('result', _self.t_result);
        _self.axios.post(_self.ApiUrlData + "/testing/addTestCase", formData).then(response => {
          if (response.data.errcode == '0') {
            _self.dialogVisible = false;
            _self.$message({
              message: "新增成功",
              type: "success"
            });
            console.log("新增成功")
            _self.searchs()
          } else {
            _self.$message.error('新增失败');
          }
        }).catch(function(error) {
          _self.$message.error('数据响应时间过长，请重试');
        });
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
  .title-box {
    margin: 10px 0;
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
