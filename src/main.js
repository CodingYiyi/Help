// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import patientList from './components/PatientList'
import addPatient from './components/AddPatient'
import patientDetail from './components/PatientDetail'
import patientEdit from './components/PatientEdit'
import policyList from './components/PolicyList'
import policyDetail from './components/PolicyDetail'
import visitItemDetail from './components/VisitItemDetail'
import addVisitItem from './components/AddVisitItem'
import qs from 'qs';
Vue.prototype.$qs = qs;

Vue.use(VueRouter)

/* eslint-disable */
const routes = [
  {
    path: '/',
    redirect: "/patientList"
  },
  {
    path: "/patientList",
    component: patientList
  },
  {
    path: "/addPatient",
    component: addPatient
  },
  {
    path: '/patientDetail/:id',
    name: 'patientDetail',
    component: patientDetail
  },
  {
    path: '/patientEdit',
    name: 'patientEdit',
    component: patientEdit
  },
  {
    path: '/policyList',
    name: 'policyList',
    component: policyList
  },
  {
    path: '/policyDetail/:id',
    name: 'policyDetail',
    component: policyDetail
  },
  {
    path: '/visitItemDetail/:id',
    name: 'visitDetail',
    component: visitItemDetail
  },
  {
    path: '/addVisitItem',
    name: 'addVisitItem',
    component: addVisitItem
  }
]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false
axios.defaults.baseURL = 'http://118.190.157.253:9447';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// Date原型链扩展
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    "S": this.getMilliseconds() //millisecond
  }
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(RegExp.$1,
        RegExp.$1.length == 1 ? o[k] :
        ("00" + o[k]).substr(("" + o[k]).length));
  return format;
}
/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
