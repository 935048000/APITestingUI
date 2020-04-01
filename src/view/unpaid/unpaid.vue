<template>
	<div class="app-contion">

		<el-table :data="tableData" v-loading="loading" border style="width: 100%;"
		 tooltip-effect="dark"max-height="620">
			<el-table-column label="桌号" prop="seatNum">
			</el-table-column>
			<el-table-column prop="productNameArr" label="订单详情">
			</el-table-column>
			<el-table-column prop="comments" label="备注">
			</el-table-column>
			<el-table-column prop="orderState" label="订单状态">
			</el-table-column>
			<el-table-column prop="payAmount" label="订单金额">
			</el-table-column>
			<el-table-column prop="orderCode" label="订单号">
			</el-table-column>
			<el-table-column prop="actualAmount" label="实际金额">
			</el-table-column>
			<el-table-column fixed="right" label="操作" width="200">
				<template slot-scope="scope">
					<el-button size="mini" @click="paymentmodeil(scope.$index, scope.row)">移动付款</el-button>
					<el-button size="mini" type="success" @click="payment(scope.$index, scope.row)">现金付款</el-button>
				</template>
			</el-table-column>
		</el-table>
		<div style="position: fixed;bottom: 0.625rem;right: 0;">
			<el-pagination background layout="prev, pager, next" :total="total" @current-change="current_change">
			</el-pagination>
		</div>
		<!-- 支付弹框 -->
		<el-dialog title="付款码" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
			<!-- <el-input v-model="code" placeholder="请输入内容" ref="inputVal" @keypress="searchGoods" type="serch"></el-input> -->
			<form @submit.prevent action="#">
				<input v-model="code" placeholder="请输入搜索内容" ref="inputVal" type="serch" @keypress="searchGoods" class="keyinput">
			</form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [],
				dataindex: '',
				pagesize: 10,
				currentPage: 1,
				total: 0,
				loading: true,
				dialogVisible: false,
				code: '',
				pays: ''
			}
		},

		methods: {
			searchGoods(event) {

				let _self = this;
				if (event.keyCode == 13) {
					event.preventDefault(); //禁止默认事件（默认是换行）
					_self.keyword = event.target.value;
					console.log(_self.keyword)
					_self.dialogVisible = false
					var moneys = _self.dataindex.payAmount * 100;
					moneys = parseInt(moneys)
					let formData = new FormData();
					formData.append('auth_code', _self.keyword);
					formData.append('total_fee', moneys);
					formData.append('orderid', _self.dataindex.orderCode);
					formData.append('shop_name', _self.dataindex.shop);
					//发送请求
					_self.axios.post('https://dolphin.daisha.com.cn/weixinbydc/paym.php', formData, {
						// 单独配置
						withCredentials: false
					}).then(response => {

						if (response.data.result_code == 'SUCCESS') {
							_self.$message({
								type: 'success',
								message: '付款成功，请前往今日订单查看'
							});
							let formData2 = new FormData();
							formData2.append('state', 1);
							formData2.append('payCode', response.data.out_trade_no);
							formData2.append('orderCode', _self.dataindex.orderCode);
							formData2.append('payFeed', '成功');
							formData2.append('source', '微信');
							//发送请求
							_self.axios.post(_self.ApiUrls + '/buyer/getOrderPayTrace', formData2, {
								// 单独配置
								withCredentials: false
							}).then(response => {

								if (response.data.errcode == '0') {
									_self.$message({
										type: 'success',
										message: '付款成功，请前往今日订单查看'
									});
								} else {
									_self.$message.error('支付失败');
								}

							}).catch(function(error) {
								_self.$message.error('支付失败');
							});
							_self.getdata();
						} else {
							_self.$message.error('支付失败');
						}

					}).catch(function(error) {
						_self.$message.error('支付失败');
						let formData2 = new FormData();
						formData2.append('state', 0);
						formData2.append('payCode', response.data.out_trade_no);
						formData2.append('orderCode', _self.dataindex.orderCode);
						formData2.append('payFeed', '失败');
						formData2.append('source', '微信');
						//发送请求
						_self.axios.post(_self.ApiUrls + '/buyer/getOrderPayTrace', formData2, {
							// 单独配置
							withCredentials: false
						}).then(response => {
							console.log(response)
							_self.$message.error('支付失败');

						}).catch(function(error) {
							_self.$message.error('支付失败');
						});
					});

				}

			},
			getdata() {
				let _self = this
				let formData = new FormData();
				formData.append('shopCode', 'AIX');
				formData.append('pageNum', _self.currentPage);
				formData.append('pageSize', _self.pagesize);
				//发送请求
				_self.axios.post(_self.ApiUrl + '/catering/getShopAllNoPaymentOrder', formData).then(response => {
					if (response.data.errcode == '0') {
						_self.loading = false;
						_self.tableData = response.data.data.data.list;
						_self.total = _self.tableData.length
						for (var i = 0; i < response.data.data.data.list.length; i++) {
							if (response.data.data.data.list[i].orderState == '0') {
								_self.tableData[i].orderState = '未付款'
							} else if (response.data.data.data.list[i].orderState == '1') {
								_self.tableData[i].orderState = '以付款'
							} else if (response.data.data.data.list[i].orderState == '2') {
								_self.tableData[i].orderState = '已删除'
							} else if (response.data.data.data.list[i].orderState == '3') {
								_self.tableData[i].orderState = '已失效'
							} else if (response.data.data.data.list[i].orderState == '4') {
								_self.tableData[i].orderState = '已传菜'
							} else if (response.data.data.data.list[i].orderState == '5') {
								_self.tableData[i].orderState = '已核销'
							} else if (response.data.data.data.list[i].orderState == '6') {
								_self.tableData[i].orderState = '更换菜品'
							}
						}
					} else {
						_self.$message.error('数据错误，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('数据错误，请刷新重试');
						_self.$router.push('/login')
					_self.$store.commit('SAVE_USERINFO','')
				});
			},
			paymentmodeil(index) {
				let _self = this
				_self.code = '';
				_self.dialogVisible = true;
				console.log(index)
				console.log(_self.tableData[index])
				_self.dataindex = _self.tableData[index]
				_self.$nextTick(function() {
					//DOM 更新了
					_self.$refs.inputVal.focus()
				})

			},
			payment(index) {
				let _self = this
				let formData = new FormData();
				formData.append('orderCode', _self.tableData[index].orderCode);
				//发送请求
				_self.axios.post(_self.ApiUrl + '/catering/changeOrderTypeBtn', formData).then(response => {
					if (response.data.errcode == '0') {
						_self.$message({
							message: '付款成功',
							type: 'success'
						});
						_self.getdata()
					} else {
						_self.$message.error('数据错误，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('数据错误，请刷新重试');
				});
			}
		},
		created: function() {
			let _self = this;
			_self.getdata();
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

	.keyinput {
		-webkit-appearance: none;
		background-color: #fff;
		background-image: none;
		border-radius: 4px;
		border: 1px solid #dcdfe6;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
		color: #606266;
		display: inline-block;
		font-size: inherit;
		height: 40px;
		line-height: 40px;
		outline: 0;
		padding: 0 15px;
		-webkit-transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
		transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
		width: 100%;
	}
</style>
