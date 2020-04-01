<template>
	<div class="app-contion">
		<div class="block">
			<el-date-picker v-model="datetime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" range-separator="至"
			 start-placeholder="起始时间" end-placeholder="结束时间">
			</el-date-picker>
			<el-button type="primary" plain @click="search">搜索</el-button>
			<span class="titles">实时流水金额：<span class="titles title-color">{{streamsum}}</span>元</span>
			<span class="titles">搜索总金额：<span class="titles title-color">{{searchsum}}</span>元</span>
		</div>
		<el-table  :data="tableData" border v-loading="loading" style="width: 100%;"tooltip-effect="dark" max-height="620">
			<el-table-column prop="orderCode" label="订单号">
			</el-table-column>
			<el-table-column prop="productNameArr" label="订单详情">
			</el-table-column>
			<el-table-column prop="comments" label="备注">
			</el-table-column>
			<el-table-column prop="orderType" label="订单类型">
			</el-table-column>
			<el-table-column prop="payAmount" label="订单金额">
			</el-table-column>
			<el-table-column prop="actualAmount" label="实际金额">
			</el-table-column>
			<el-table-column prop="orderWay" label="下单方式">
			</el-table-column>
			<el-table-column prop="source" label="支付方式">
			</el-table-column>
			<el-table-column prop="operation" label="操作人">
			</el-table-column>
			
		</el-table>
		 <div style="position: fixed;bottom: 0.625rem;right: 0;">
		  <el-pagination
		    background
		    layout="prev, pager, next"
		    :total="total"
		    @current-change="current_change">
		  </el-pagination>
		</div>
	</div>
</template>

<script>
import {
		mapState
	} from 'vuex';
	export default {
		computed: {
			...mapState({
				id: state => state.userinfo.id,
				shopcode:state => state.userinfo.shopcode
			})
		},
		data() {
			return {
				tableData: [],
				datetime: [],
				loading: true,
				streamsum:'0',
				searchsum:'0',
				pagesize:10,
				currentPage:1,
				  total: 0
			}
		},
		methods: {
			 current_change:function(currentPage){
				 let _self=this;
				 
			  _self.currentPage = currentPage;
			  let formData = new FormData();
			  formData.append('shopCode',_self.shopcode);
			  formData.append('pageNum', _self.currentPage);
			  formData.append('pageSize', _self.pagesize);
			  //发送请求
			  _self.axios.post(_self.ApiUrl+'/catering/getShopAllOrder', formData).then(response => {
			  		
			  		if(response.data.errcode=='0'){
			  			_self.loading = false;
			  				_self.tableData = response.data.data.data.list;
			  				_self.total = response.data.data.data.total
							for(var i=0;i<_self.tableData.length;i++){
								if(_self.tableData[i].comments=='null'){
									_self.tableData[i].comments=''
								}
							}
			  				// 搜索金額
			  					let formData2 = new FormData();
			  				formData2.append('shopCode', _self.shopcode);
			  				formData2.append('userId', _self.id);
			  				_self.axios.post(_self.ApiUrl+'/catering/getTodayOperationOrderFee', formData2).then(response => {
			  				if(response.data.errcode=='0'){
			  						if(response.data.data.data!=null){comments
			  							 _self.streamsum=response.data.data.data.actualAmount
			  							_self.searchsum=response.data.data.data.payAmount
										
			  							}else{
			  								 _self.streamsum='0'
			  								 _self.searchsum='0'
			  							}
			  					}else{
			  						 _self.$message.error('数据错误，请刷新重试');
			  					}
			  					
			  				}).catch(function(error) {
			  					 _self.$message.error('数据错误，请刷新重试');
			  					});
			  		}else{
			  			 _self.$message.error('数据错误，请刷新重试');
			  		}
			  }).catch(function(error) {
			  _self.$message.error('数据错误，请刷新重试');
			  });
			},
			getdata() {
					let _self = this
				let formData = new FormData();
				formData.append('shopCode',_self.shopcode);
			  formData.append('pageNum', _self.currentPage);
			formData.append('pageSize', _self.pagesize);
				//发送请求
				_self.axios.post(_self.ApiUrl+'/catering/getShopAllOrder', formData).then(response => {
						
						if(response.data.errcode=='0'){
							_self.loading = false;
								_self.tableData = response.data.data.data.list;
							_self.total = response.data.data.data.total
							for(var i=0;i<response.data.data.data.list.length;i++){
								if(_self.tableData[i].comments=='null'){
									_self.tableData[i].comments=''
								}
								if(response.data.data.data.list[i].orderType=="COMMON_ORDER"){
									_self.tableData[i].orderType="客户订单"
								}else if(response.data.data.data.list[i].orderType=="WAITER_ORDER"){
									_self.tableData[i].orderType="中台订单"
								}else if(response.data.data.data.list[i].orderType=="WITHDRAW_ORDER"){
									_self.tableData[i].orderType="退款订单"
								}
							}
								// 搜索金額
									let formData2 = new FormData();
								formData2.append('shopCode',_self.shopcode);
								formData2.append('userId', _self.id);
								_self.axios.post(_self.ApiUrl+'/catering/getTodayOperationOrderFee', formData2).then(response => {
								if(response.data.errcode=='0'){
										if(response.data.data.data!=null){
											 _self.streamsum=response.data.data.data.actualAmount
											_self.searchsum=response.data.data.data.payAmount
											}else{
												 _self.streamsum='0'
												 _self.searchsum='0'
											}
									}else{
										 _self.$message.error('数据错误，请刷新重试');
									}
									
								}).catch(function(error) {
									 _self.$message.error('数据错误，请刷新重试');
									});
						}else{
							 _self.$message.error('数据错误，请刷新重试');
						}
				}).catch(function(error) {
				_self.$message.error('数据错误，请刷新重试');
					_self.$router.push('/login')
				_self.$store.commit('SAVE_USERINFO','')
				});
			},
			search() {
				let formData = new FormData();
				let _self = this
				_self.loading = true;
				formData.append('shopCode',_self.shopcode);
			 formData.append('pageNum', _self.currentPage);
			formData.append('pageSize', _self.pagesize);
				formData.append('startTime', _self.datetime[0]);
				formData.append('endTime', _self.datetime[1]);
				//发送请求
				_self.axios.post(_self.ApiUrl+'/catering/timeSearchOrder', formData).then(response => {
					if(response.data.errcode=='0'){
							_self.loading = false;
						_self.tableData = response.data.data.data.list
						let formData2 = new FormData();
						formData2.append('shopCode',_self.shopcode);
						formData2.append('startTime', _self.datetime[0]);
						formData2.append('endTime', _self.datetime[1]);
						_self.axios.post(_self.ApiUrl+'/catering/getSearchOrderPayamount', formData2).then(response => {
						if(response.data.errcode=='0'){
									if(response.data.data.data!=null){
								 _self.streamsum=response.data.data.data.actualAmount
								_self.searchsum=response.data.data.data.payAmount
								}else{
									 _self.streamsum='0'
									 _self.searchsum='0'
								}
							}else{
								_self.$message.error('数据错误，请刷新重试');
							}
								
						}).catch(function(error) {
							_self.$message.error('数据错误，请刷新重试');
						});
					}else{
						_self.$message.error('数据错误，请刷新重试');
					}
				
				}).catch(function(error) {
					_self.$message.error('数据错误，请刷新重试');
				
				});
			}
		},
		created: function() {
			let _self = this
			_self.getdata()
		}
	}
</script>
<style>
	.app-contion {
		margin: 10px;
	}

	.block {
		margin-bottom: 15px;
	}

	.titles {
		font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
		font-size: 14px;
		margin: 0 15px;
	}

	.title-color {
		color: red;
	}
	.el-button--primary{
		width: 73px;
	}
</style>
