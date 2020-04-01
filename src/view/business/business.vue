<template>
	<div class="app-contion">
		<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
			<el-tab-pane :label="item.categoryName" v-for='item in category' :key="item.categoryName" class="category-box">
				<div class="fenlei-box">
					<span :class="{'border-color':clickeds==index}" v-for="(good,index) in type0Goods" :key="good.productionName"
					 @click="checkinlist(index)">{{good.productionName}}
						<i class="fenlei-i">￥{{good.price}}元</i>
					</span>
				</div>
			</el-tab-pane>
		</el-tabs>
		<!-- 底部菜单 -->
		<div class="footer">
			<!-- 菜单 -->
			<el-table :data="menudate" border style="width: 100%" max-height="620">
				<el-table-column prop="productionName" label="商品名称">
				</el-table-column>
				<el-table-column prop="price" label="商品单价">
				</el-table-column>
				<el-table-column label="商品数量">
					<template slot-scope="scope">
					<el-button  @click="cuts((scope.$index, scope.row))">-</el-button>
					 <span style="width: 120px;display: inline-block;text-align: center;">{{scope.row.order_amount}}</span>
					 <el-button   @click="add((scope.$index, scope.row))">+</el-button>
                   </template>
				</el-table-column>
			</el-table>
			 <el-button type="primary" plain @click='check' class="check" style="width: 97%;">下单</el-button>
		</div>
		<!-- 弹框 -->
		<el-dialog :title="production.productionName" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
			<div class="flower">
				<div class="guige-title">规格</div>
				<span :class="{'border-color':clicked==index}" v-for="(item,index) in production.productionSizes" :key="item.size"
				 @click="prosize(index)">{{item.size}}</span>
				<span style="border: 1px solid #409EFF;" v-if="production.productionSizes==null">默认</span>
				<div class="guige-title">备注</div>
				<el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea">
				</el-input>
				<div class="tan-price">￥{{price}}元</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addmenu(tab)">添 加</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
		import {
		mapState
	} from 'vuex';
	export default {
			computed: {
			...mapState({
				username: state => state.userinfo.account,
				token: state => state.userinfo.token,
				shopcode: state => state.userinfo.shopcode
			})
		},
		data() {
			return {
				menudate: [],
				allmenudate:[],
				type0Goods: [],
				checkList: [],
				category: [],
				ins: '',
				guige: '',
				productionSizes: '',
				production: [],
				dialogVisible: false,
				clicked: 0,
				clickeds: -1,
				textarea: '',
				price: '',
			
			}
		},
		methods: {
			//切换菜单
			handleClick(tab, event) {
				let _self = this;
				_self.clickeds = -1;
				_self.ins = tab.index;
				let formData = new FormData();
				formData.append('token', _self.token);
				formData.append('shopCode',_self.shopcode);
				formData.append('seatNum', '');
				_self.axios.post(_self.ApiUrls+'/buyer/getShopProductionCaregory', formData, {
        // 单独配置
        withCredentials: false
    }).then(response => {
					
					if (response.data.errcode == '0') {
						_self.category = response.data.data.data
						let formData2 = new FormData();
						formData2.append('token',_self.token);
						formData2.append('shopCode',_self.shopcode);
						formData2.append('seatNum', '');
						formData2.append('categoryCode', response.data.data.data[_self.ins].categoryCode);
						_self.axios.post(_self.ApiUrls+'/buyer/getShopProductionName', formData2, {
        // 单独配置
        withCredentials: false
    }).then(response => {
						if (response.data.errcode == '0') {
								_self.type0Goods = response.data.data.data;
						} else {
								_self.$message.error('数据错误，请刷新重试');
							}
						}).catch(function(error) {
							_self.$message.error('数据错误，请刷新重试');
						});
					} else {
						_self.$message.error('数据错误，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('数据错误，请刷新重试');
				});
			},
			//选择菜品
			checkinlist(index) {
				let _self = this;
				_self.textarea = '';
				_self.dialogVisible = true
				this.clickeds = index;
				_self.production = _self.type0Goods[index]
				if (_self.production.productionSizes == null) {
					_self.price = _self.production.price;
				} else {
					_self.price = _self.production.productionSizes[0].price;
				}
			},
			prosize(index) {
				let _self = this;
				_self.clicked = index;
				if (_self.production.productionSizes == null) {
					_self.price = _self.production.price;
				} else {
					_self.price = _self.production.productionSizes[index].price;
				}
			
			},
			//初始化加载
			getuser() {
				let _self = this
				let formData = new FormData();
				formData.append('token', _self.token);
				formData.append('shopCode', _self.shopcode);
				formData.append('seatNum', '');
				_self.axios.post(_self.ApiUrls+'/buyer/getShopProductionCaregory', formData, {
        // 单独配置
        withCredentials: false
    }).then(response => {
				if (response.data.errcode == '0') {
						_self.category = response.data.data.data
						let formData2 = new FormData();
						formData2.append('token', _self.token);
						formData2.append('shopCode',_self.shopcode);
						formData2.append('seatNum', '');
						formData2.append('categoryCode', response.data.data.data[0].categoryCode);
						_self.axios.post(_self.ApiUrls+'/buyer/getShopProductionName', formData2, {
        // 单独配置
        withCredentials: false
    }).then(response => {
							if (response.data.errcode == '0') {
								_self.type0Goods = response.data.data.data
						_self.shopdetail();
							} else {
								_self.$message.error('数据错误，请刷新重试');
							}
						}).catch(function(error) {
							_self.$message.error('数据错误，请刷新重试');
						});
					} else {
						_self.$message.error('数据错误，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('数据错误，请刷新重试');
						_self.$router.push('/login')
					_self.$store.commit('SAVE_USERINFO','')
				});

			},
			shopdetail(){
				let _self=this
						let formData2 = new FormData();
								formData2.append('token', _self.token);
								formData2.append('shopCode',_self.shopcode);
								formData2.append('seatNum', '');
								_self.axios.post(_self.ApiUrls+'/buyer/getShoppingCarDetail', formData2, {
        // 单独配置
        withCredentials: false
    }).then(response => {
									if (response.data.errcode == '0') {
									_self.allmenudate=response.data.data
									_self.menudate=response.data.data.data
									} else {
										_self.$message.error('数据错误，请刷新重试');
									}
								}).catch(function(error) {
									_self.$message.error('数据错误，请刷新重试');
								});	
			},
			//添加到购物车
			addmenu(){
				let _self=this;
			_self.dialogVisible = false;
			if(_self.production.productionSizes==null){
				var productionCodes=_self.production.productionCode
			}else{
				var productionCodes=_self.production.productionSizes[_self.clicked].productionCode
			}
					let formData = new FormData();
				formData.append('token', _self.token);
				formData.append('shopCode',_self.shopcode);
				formData.append('seatNum', '');
				formData.append('productionCode',productionCodes);
             formData.append('amount','1');
             formData.append('price',_self.price);
             formData.append('comments',_self.textarea);
			 
				_self.axios.post(_self.ApiUrls+'/buyer/addProductionToShoppingCar', formData, {
        // 单独配置
        withCredentials: false
    }).then(response => {
					
					if (response.data.errcode == '0') {
					_self.shopdetail()
					} else {
						_self.$message.error('数据错误，请刷新重试');
					}
				}).catch(function(error) {
					_self.$message.error('数据错误，请刷新重试');
				});
			},
			
			// 数量加
			add(index){
					let _self=this;
				_self.dialogVisible = false;
				let formData = new FormData();
					formData.append('token', _self.token);
					formData.append('shopCode',_self.shopcode);
					formData.append('seatNum', '');
					formData.append('productionCode', index.production_code);
					formData.append('amount', '1');
					formData.append('price', index.price);
					_self.axios.post(_self.ApiUrls+'/buyer/addProductionToShoppingCar', formData, {
        // 单独配置
        withCredentials: false
    }).then(response => {
					
						if (response.data.errcode == '0') {
						_self.shopdetail()
						} else {
							_self.$message.error('数据错误，请刷新重试');
						}
					}).catch(function(error) {
						_self.$message.error('数据错误，请刷新重试');
					});
			},
			//数量减
			cuts(index){
					let _self=this;
				_self.dialogVisible = false;
				let formData = new FormData();
					formData.append('token', _self.token);
					formData.append('productionCode', index.production_code);
					_self.axios.post(_self.ApiUrls+'/buyer/deleteShoppingCarSingleProduction', formData, {
        // 单独配置
        withCredentials: false
    }).then(response => {
						if (response.data.errcode == '0') {
						_self.shopdetail()
						} else {
							_self.$message.error('数据错误，请刷新重试');
						}
					}).catch(function(error) {
						_self.$message.error('数据错误，请刷新重试');
					});
			},
			//添加到未支付订单
			
			check() {
				console.log(this.menudate)
				let _self=this;
				let formData = new FormData();
					formData.append('token', _self.token);
					formData.append('shopCode',_self.shopcode);
					formData.append('seatNum', '');
					formData.append('payment',_self.allmenudate.allPayment);
					formData.append('code', '');
					formData.append('state','1');
					_self.axios.post(_self.ApiUrls+'/buyer/createUserOrder ', formData, {
        // 单独配置
        withCredentials: false
    }).then(response => {
						if (response.data.errcode == '0') {
							_self.$message({
								message: '添加成功',
								type: 'success'
							});
						_self.getuser()
						} else {
							_self.$message.error('添加错误，请刷新重试');
						}
					}).catch(function(error) {
						_self.$message.error('数据错误，请刷新重试');
					});
			}
		},
		created: function() {
			let _self = this
			_self.getuser()
		}
	}
</script>

<style>
	.app-contion {
		margin: 10px;
		overflow: hidden;
	}

	.xuanfu {
		margin: 10px 0;
	}

	.guige-title {
		margin: 10px 0;
		color: #CAC6C6;
	}

	.xuanfu [class*=el-col-] {
		float: none;
	}

	.el-tabs__item {
		height: 100px;
		line-height: 100px;
		width: 111px;
		text-align: center;
	}

	.category-box {
		height: 420px;
		overflow: hidden;
		overflow-y: scroll;
	}

	.el-card {
		text-align: center;
		margin: 10px;
		width: 120px;
		height: 120px;
		line-height: 60px;
	}

	.el-card__body {
		padding: 0;
	}

	.clear {
		clear: both;
	}

	.cookList {
		display: flex;
		flex-wrap: wrap
	}

	.cookList li div {
		font-size: 15px;
	}

	.red-color {
		color: brown;
	}

	.flag {
		background: ghostwhite;
	}

	.box {
		height: 180px !important;
		width: 180px !important;
		padding: 5px;
		margin: 5px;
		line-height: 180px !important;
	}

	.el-checkbox__label {
		font-size: 15px;
	}

	.el-checkbox__input {
		vertical-align: top;
	}

	.footer {
		width: 83%;
		position: fixed;
		bottom: 0;
		left: 200px;
		padding: 15px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
		height:170px;
		overflow: hidden;
		overflow-y: scroll;
		z-index: 1000;
	}

	.el-dialog__body {
		padding: 20px 20px;
	}

	.guige-check {
		margin: 10px;
	}

	.flower span {
		display: inline-block;
		line-height: 1;
		white-space: nowrap;
		cursor: pointer;
		background: #fff;
		border: 1px solid #dcdfe6;
		color: #606266;
		-webkit-appearance: none;
		text-align: center;
		box-sizing: border-box;
		outline: none;
		margin: 0;
		transition: .1s;
		font-weight: 500;
		-moz-user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		padding: 12px 20px;
		font-size: 14px;
		border-radius: 4px;
		margin: 10px;
	}

	.border-color {
		border: 1px solid #409eff !important;
	}

	.fenlei-box span {
		padding: 9px 20px 9px 10px;
		border-radius: 4px;
		display: inline-block;
		border: 1px solid #dcdfe6;
		box-sizing: border-box;
		margin: 5px;
		line-height: 90px;
		height: 180px;
		text-align: center;
		width: 180px;
		color: #606266;
		font-weight: 500;
		font-size: 18px;
		cursor: pointer;
	}

	.fenlei-i {
		font-style: normal;
		color: #A52A2A;
		display: block;
	}

	.tan-price {
		color: #409EFF;
		margin-top: 30px;
		font-size: 18px;
	}
	.check{
		margin: 15px;
		width: 87%;
	}
</style>
