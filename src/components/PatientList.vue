<template>
  <div style="margin-bottom:70px;">
    <header class="header">
      钦州市因病扶贫人员名单
    </header>
    <group v-if="!loading && patientList.length>0" gutter="0px">
      <cell-box v-for="item in patientList" v-bind:key="item.patientId" is-link :link="{ name: 'patientDetail', params: { id: item.patientId }}">
        <img v-if="item.patientSex == 0" src="../assets/female.png" style="width: 20px">
        <img v-else src="../assets/male.png" style="width: 20px">
        <span class="patient-name">{{item.patientName}}</span>
      </cell-box>
    </group>
    <load-more v-if="loading" tip="正在加载"></load-more>
    <load-more v-if="!loading && patientList.length == 0" tip="暂无数据" :show-loading="false"></load-more>
    <footer class="footer">
      <x-button type="primary" link="/addPatient">新增患者</x-button>
    </footer>
  </div>
</template>

<script>
import { Group, CellBox, XButton, LoadMore } from "vux";

export default {
  components: {
    Group,
    CellBox,
    XButton,
    LoadMore
  },
  data() {
    return {
      patientList: [
      ],
      loading:false,
    };
  },
  mounted: function() {
    this.loading = true;
    axios
      .get("/patient/getPatientList")
      .then(response => {
        this.loading = false;
        this.patientList = response.data.data;
      })
      .catch(error => {
        this.loading = false;
      });
  }
};
</script>

<style scoped>
.header {
  padding: 15px;
  font-size: 16px;
  font-weight: 700;
}
.footer {
  position: fixed;
  bottom: 0;
  padding: 10px;
  width: 100%;
  background: #fff;
  box-sizing: border-box;
  border-top: 1px solid #e5e5e5;
}
/* .icon-person {
  margin-left: -40px;
  filter: drop-shadow(rgb(0, 204, 153) 40px 0px);
} */
.patient-name {
  color: #666;
  margin-left: 10px;
  font-size: 14px;
  font-weight: 400;
}
</style>
