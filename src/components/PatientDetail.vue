<template>
  <div class="patient_detail_page" style="margin-bottom:70px">
    <div class="propaganda_img"></div>
    <div style="height:36px;line-height:36px;text-align:center;color:#fc9f0e;background-color:#ffe6c6">手机远程会诊系统正在完善中···</div>
    <group gutter="10px" class="no-border" :class="{ fold: !isOpen }">
      <cell-box>
         <x-icon type="android-person"></x-icon>
         <span style="margin-left:6px">贫困户信息</span>
         <span v-if="canEdit" class="edit" @click="editInfo"><x-icon type="android-create"></x-icon>编辑</span>
      </cell-box>
      <cell-form-preview :list="userInfo"></cell-form-preview>
      <cell-box>
         <span>家庭医生</span>
      </cell-box>
      <cell-form-preview :list="doctorInfo"></cell-form-preview>
      <cell-box>
         <x-button mini plain type="primary" @click.native="showQR">查看用户二维码</x-button>
      </cell-box>
    </group>

    <div class="arrow_btn" @click="toogle" v-if="isOpen"><span style="margin-right:4px">收起</span><x-icon type="ios-arrow-up"></x-icon></div>
    <div class="arrow_btn" @click="toogle" v-else><span style="margin-right:4px">展开</span><x-icon type="ios-arrow-down"></x-icon></div>
    <group gutter="10px">
       <cell-box is-link :link="{ name: 'policyList'}">
         <x-icon type="ios-paper"></x-icon>
         <span style="margin-left:6px">扶贫政策</span>
      </cell-box>
    </group>
    <group gutter="10px">
       <cell-box>
         <x-icon type="clipboard"></x-icon>
         <span style="margin-left:6px">随访回访记录</span>
      </cell-box>
    </group>
    <load-more v-if="visitItems.length == 0" tip="暂无随访回访记录" :show-loading="false"></load-more>
    <visit-item v-for="item in visitItems" :key="item.visitID" style="margin:10px" 
    @click.native="goDetail(item.visitID)"
    :classify="item.classify"
    :title="item.title"
    :recordTime="item.recordTime"
    :doctor="item.doctor"
    ></visit-item>
     <footer class="footer">
      <x-button type="primary" @click.native="goToAdd">添加记录</x-button>
    </footer>

    <div v-transfer-dom>
      <popup v-model="isShowQR" height="100%">
        <div style="height:100%;width:100%">
          <img :src="QRCodeUrl" 
          style="position: absolute; width:80%; top: 50%; left: 50%; transform: translate(-50%,-70%);">
          <x-icon type="android-close" @click.native="isShowQR = false" style="position: absolute; bottom:20px;left:50%;margin-left:-30px;width:60px;height:60px;"></x-icon>
        </div>
      </popup>
    </div>

    <div v-transfer-dom>
      <loading :show="loading" text="数据加载中..."></loading>
    </div>

  </div>
</template>

<script>
import {
  TransferDom,
  Popup,
  Group,
  CellFormPreview,
  CellBox,
  Panel,
  XButton,
  LoadMore,
  Loading
} from "vux";
import visitItem from "./VisitItem";
export default {
  directives: {
    TransferDom
  },
  components: {
    Popup,
    Group,
    CellBox,
    CellFormPreview,
    Panel,
    XButton,
    LoadMore,
    Loading,
    visitItem
  },
  data() {
    return {
      isShowQR: false,
      isOpen: false,
      userInfo: [],
      doctorInfo: [],
      QRCodeUrl: "",
      visitItems: [],
      loading: false,
      canEdit: false
    };
  },
  doctorId: "",
  patientId: "",
  doctorName: "",
  mounted: function() {
    window.sessionStorage.getItem("loginType") == "admin"
      ? (this.canEdit = true)
      : "";
    this.loading = true;
    var patientId = this.$route.params.id;
    this.$axios
      .get("patient/queryPatientDetail.next", {
        params: { patientId: patientId }
      })
      .then(response => {
        this.loading = false;
        if (response && response.data) {
          if (response.data.success) {
            var data = response.data.data;
            this.doctorInfo = [
              {
                label: "姓名",
                value: data.familyDoctor.doctorName
              },
              {
                label: "职务",
                value: data.familyDoctor.doctorWork
              },
              {
                label: "工作单位",
                value: data.familyDoctor.doctorLocation
              },
              {
                label: "联系电话",
                value: data.familyDoctor.doctorPhone
              }
            ];
            this.userInfo = [
              {
                label: "姓名",
                value: data.patient.patientName
              },
              {
                label: "性别",
                value: data.patient.patientSex == 0 ? "女" : "男"
              },
              {
                label: "年龄",
                value:
                  (data.patient.patientAge > 0
                    ? data.patient.patientAge
                    : "0") + "岁"
              },
              {
                label: "联系电话",
                value: data.patient.patientPhone
              },
              {
                label: "家庭住址",
                value: data.patient.patientAddress
              },
              {
                label: "紧急联系人",
                value: data.patient.emergencyContact
              },
              {
                label: "住院单位",
                value: data.patient.hospitalName
              },
              {
                label: "住院号",
                value: data.patient.hospitalCode
              },
              {
                label: "住院时间",
                value: this.getInHosDays(
                  data.patient.startTime,
                  data.patient.endTime
                )
              },
              {
                label: "出院诊断",
                value: data.patient.diagnosis
              }
            ];
            for (var item of data.assistInfoVo) {
              this.visitItems.push({
                visitID: item.recordId,
                title: "入户走访",
                recordTime: this.formatDate(item.createTime),
                doctor: item.doctorName
              });
            }
            this.QRCodeUrl = data.patient.qrcodePath;
            this.doctorName = data.familyDoctor.doctorName;
            this.doctorId = data.familyDoctor.doctorId;
            this.patientId = data.patient.patientId;
            window.sessionStorage.setItem(
              "doctorInfo",
              JSON.stringify(data.familyDoctor)
            );
            window.sessionStorage.setItem(
              "patientInfo",
              JSON.stringify(data.patient)
            );
          }
        }
      })
      .catch(error => {
        this.loading = false;
      });
  },
  // 在 `methods` 对象中定义方法
  methods: {
    toogle() {
      this.isOpen = !this.isOpen;
    },
    goDetail(id) {
      this.$router.push({ name: "visitDetail", params: { id: id } });
    },
    showQR() {
      this.isShowQR = true;
    },
    getInHosDays(start, end) {
      if (start && end) {
        var startDate = new Date(start);
        var endDate = new Date(end);
        return (
          startDate.format("yyyy-MM-dd") + " 〜 " + endDate.format("yyyy-MM-dd")
        );
      }else{
        return ""
      }
    },
    goToAdd() {
      this.$router.push({
        name: "addVisitItem",
        query: {
          patientId: this.patientId,
          doctorId: this.doctorId,
          doctorName: this.doctorName
        }
      });
    },
    formatDate(time) {
      var date = new Date(time);
      return date.format("yyyyMMddhhmm");
    },
    editInfo() {
      this.$router.push("/patientEdit");
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.propaganda_img {
  height: 160px;
  background: url("../assets/fupin.jpg");
  background-size: cover;
}
.arrow_btn {
  padding: 8px;
  font-size: 14px;
  display: flex;
  justify-content: center;
  background: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  color: #272636;
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
.edit {
  display: flex;
  position: absolute;
  right: 20px;
}
</style>
<style>
.patient_detail_page .weui-form-preview__label {
  width: 90px;
}
.patient_detail_page .weui-form-preview__value {
  text-align: left;
  color: #2c2e32;
}
.patient_detail_page .weui-form-preview__label {
  margin-right: 2en;
  text-align: right;
}
.patient_detail_page .no-border > .weui-cells:after {
  border: none;
}
.patient_detail_page .no-border.fold > .weui-cells {
  height: 88px;
}
</style>
