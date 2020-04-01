//引入vue
import Vue from 'vue'
import Vuex from 'vuex'
//注册vuex
Vue.use(Vuex)

//状态
const state={
	userinfo:JSON.parse(localStorage.getItem('userinfo'))
}

//mutations 主要用来操作state
const mutations={
	//保存用户数据
	SAVE_USERINFO(state,userinfo){
		//先把数据存入本地数据库
		localStorage.setItem('userinfo',JSON.stringify(userinfo))
		//再更新数据
		state.userinfo = userinfo
	}
}


//创建store仓库暴露出去
export default new Vuex.Store({
	 state,
	 mutations
})
