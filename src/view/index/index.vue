<template>
<!--{{$store.state.userinfo}}-->
<div class="index">
	<el-container style="height: 500px; border: 1px solid #eee">
		<!--左侧导航-->
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
  	<!--<div class="top-header">
  		<h1 class="title">首页</h1>
  	</div>-->    
    <el-menu :default-openeds="['1']" router  background-color="#304156" text-color="#fff"
      active-text-color="#ffd04b">
        <el-menu-item index="/" class="top">
        <i class="el-icon-setting"></i>	
        	测试后台
        </el-menu-item>
      <!--<el-submenu index="1">-->
        <!--<template slot="title"><i class="el-icon-tickets"></i>订单管理</template>-->
        <!--<el-menu-item-group>-->
          <el-menu-item index="todaylist">今日订单</el-menu-item>
						<!--<el-menu-item index="unpaid">未支付订单</el-menu-item>-->
          <!--<el-menu-item index="alllist">全部订单</el-menu-item>-->
				 <!--</el-menu-item-group>-->
       <!--</el-submenu>-->
      <!--<el-submenu index="2">-->
        <!--<template slot="title"><i class="el-icon-menu"></i>商家端点餐系统</template>-->
        <!--<el-menu-item-group>-->
           <!--<el-menu-item index="business">商家点餐</el-menu-item>-->
        <!--</el-menu-item-group>-->
      
       <!--</el-submenu>-->
      <!--<el-submenu index="3">
        <template slot="title"><i class="el-icon-setting"></i>导航三</template>
        <el-menu-item-group>
        
          <el-menu-item index="3-1">选项1</el-menu-item>
          <el-menu-item index="3-2">选项2</el-menu-item>
        </el-menu-item-group>
       
      </el-submenu>-->
    </el-menu>
  </el-aside>
  <!--右侧-->
  <el-container>
     <el-header style="text-align: right; font-size: 12px">
     	
      <!--<el-dropdown>-->
      	<!--<span class="username">{{username}}</span>-->
        <!--<i class="el-icon-caret-bottom username" style="margin-right: 15px"></i>-->
        <!--<el-dropdown-menu slot="dropdown">-->
          <!--<el-dropdown-item></el-dropdown-item>-->
       <span class="username" @click="layout">退出</span>
       <i class="el-icon-caret-bottom username" style="margin-right: 15px"></i>
        <!--</el-dropdown-menu>-->
      <!--</el-dropdown>-->
      
    </el-header>
    
    <!--路由出口-->
    <router-view></router-view>
  </el-container>
</el-container>
</div>
	
</template>

<script>
	import {mapState} from 'vuex';
	export default{
			computed:{
//		 		username(){
//		 			return this.$store.state.userinfo.name
//		 		},
               //辅助函数获取state
		 		...mapState({
		 			userinfo:state => state.userinfo,
		 			username:state => state.userinfo.account
		 		})
		 	},
		 data() {
		return {
        tableData:[
     
        ]
      }
   },
   methods:{
   	layout(){
   		let _self=this;
				// _self.axios.post(_self.ApiUrl+'/logout').then(response => {
			// if(response.data.code=='200'){
					_self.$store.commit('SAVE_USERINFO','')
					 _self.$router.push('/login')
					_self.$message({
				  type: 'success',
				  message: '退出成功'
				});
			// }else{
			// _self.$router.push('/login')
			// 	 		_self.$store.commit('SAVE_USERINFO','')
			// 		_self.$message({
			// 	  type: 'error',
			// 	  message: '退出失败'
			// 	});
			//
			// }
			//
			// }).catch(function(error) {
			// 	 _self.$router.push('/login')
			// 	 	_self.$store.commit('SAVE_USERINFO','')
			// 	_self.$message.error('登出失败');
			//
			// });
			 						
   	},
		logins(){
			let _self=this;
				if(_self.$store.state.userinfo==''||_self.$store.state.userinfo==undefined||_self.$store.state.userinfo==null){
					 _self.$router.push('/login')
				}
		}
   },
	 created: function (){
	 			this.logins()
	 }
	}
</script>

<style>
	 .el-header {
    background-color: #263445;
    color: #333;
    line-height: 56px;
    height: 56px!important;
  }
  
  .el-aside {
    background-color: rgb(48, 65, 86) !important;
  }
  html,body,#app,.index{
  	height: 100%;
  }
  .el-container{
  	height: 100%!important;
  }
  .el-menu{
  	border-right: 0;
  }
    .top-header{
    	text-align: center;
    	padding: 18px 0;
    	background: #333333;
    }
  .top-header .title{
  	color: #fff;
  	font-weight: bold;
  }
  .top{
  	background: #263445 !important;
  }
  .username{
  	font-size: 16px;
  	color: #fff;
  }
</style>
