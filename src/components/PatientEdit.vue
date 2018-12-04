<template>
  <div class="edit-patient" style="margin-bottom:70px;">
    <group gutter="10px">
      <cell-box>
         <x-icon type="android-person"></x-icon>
         <span style="margin-left:6px">贫困户信息</span>
      </cell-box>
      <cell-box>
        <x-input title="姓名" placeholder="请输入姓名" v-model="patInfo.name" required></x-input>
      </cell-box>
      <cell-box>
        <span style="margin:0 18px 0 14px;color:#555">性别</span>
        <checker v-model="patInfo.sex" radio-required default-item-class="demo1-item" selected-item-class="demo1-item-selected">
          <checker-item value="1">男</checker-item>
          <checker-item value="0" style="margin-left:10px">女</checker-item>
        </checker>
      </cell-box>
      <cell-box>
        <x-input title="年龄" placeholder="请输入年龄" mask="999" v-model="patInfo.age" required></x-input>
        <span>岁</span>
      </cell-box>
      <cell-box>
        <x-input title="联系电话" placeholder="请输入联系电话" v-model="patInfo.telephone" required mask="999 9999 9999" :max="13" is-type="china-mobile"></x-input>
      </cell-box>
      <cell-box>
        <x-textarea title="家庭住址" placeholder="请输入家庭住址" v-model="patInfo.homeAddress" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
      <cell-box>
        <x-textarea title="家庭成员" placeholder="请输入家庭成员信息" v-model="patInfo.family" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
      <cell-box>
        <x-textarea title="紧急联系人" placeholder="请输入紧急联系人姓名及联系方式" v-model="patInfo.emergencyContact" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
      <cell-box>
        <x-textarea title="就诊医院" placeholder="请输入就诊医院" v-model="patInfo.hospital" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
      <cell-box>
        <x-input title="住院号" placeholder="请输入住院号" v-model="patInfo.hosNo" required></x-input>
      </cell-box>
      <cell-box>
        <datetime v-model="patInfo.startDate" placeholder="请选择入院时间" title="入院时间" format="YYYY/MM/DD" v-if="hackReset"></datetime>
      </cell-box>
       <cell-box>
        <datetime v-model="patInfo.endDate" placeholder="请选择出院时间" title="出院时间" format="YYYY/MM/DD" v-if="hackReset"></datetime>
      </cell-box>
      <cell-box>
        <x-textarea title="出院诊断" placeholder="请填写出院诊断" v-model="patInfo.diagnose" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
    </group>
    <group>
      <cell-box>
        <x-icon type="medkit"></x-icon>
        <span style="margin-left:6px">家庭医生信息</span>
      </cell-box>
      <cell-box>
        <x-input title="姓名" placeholder="请输入姓名" v-model="docInfo.docName" required></x-input>
      </cell-box>
      <cell-box>
        <x-input title="职务" placeholder="请输入从事职务" v-model="docInfo.docWork" required></x-input>
      </cell-box>
      <cell-box>
        <x-input title="联系电话" placeholder="请输入联系电话" v-model="docInfo.docPhone" required mask="999 9999 9999" :max="13" is-type="china-mobile"></x-input>
      </cell-box>
      <cell-box>
        <x-textarea title="工作单位" placeholder="请输入工作单位" v-model="docInfo.docHospital" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
    </group>
    <div v-transfer-dom>
      <loading :show="submitting" text="数据保存中..."></loading>
    </div>
    <div v-transfer-dom>
      <confirm v-model="showConfirm"
      show-input
      title="校验权限"
      :input-attrs="{type: 'password'}" 
      placeholder = "请输入管理员密码"
      @on-confirm="onConfirm">
      </confirm>
    </div>
    <toast v-model="showToast" type="text" :time="2000" is-show-mask text="密码校验失败" position="middle"></toast>
    <footer class="footer">
      <x-button type="primary" :show-loading="submitting" :disabled="submitting" @click.native="update">更新用户信息</x-button>
    </footer>
  </div>
</template>

<script>
import {
  Group,
  CellFormPreview,
  CellBox,
  XButton,
  XInput,
  XTextarea,
  Checker,
  CheckerItem,
  Datetime,
  Confirm,
  Loading,
  Toast,
  TransferDomDirective as TransferDom
} from "vux";
export default {
  directives: {
    TransferDom
  },
  components: {
    Group,
    CellBox,
    CellFormPreview,
    XButton,
    XInput,
    XTextarea,
    Checker,
    CheckerItem,
    Datetime,
    Loading,
    Confirm,
    Toast
  },
  data() {
    return {
      patInfo: {
        id: "",
        name: "",
        sex: "1",
        age: "",
        telephone: "",
        homeAddress: "",
        family: "",
        emergencyContact: "",
        hospital: "",
        hosNo: "",
        diagnose: ""
      },
      docInfo: {
        docName: "",
        docWork: "",
        docPhone: "",
        docHospital: ""
      },
      hackReset: false,
      submitting: false,
      showConfirm: false,
      showToast: false
    };
  },
  mounted: function() {
    let patientInfo = JSON.parse(window.sessionStorage.getItem("patientInfo"));
    let doctorInfo = JSON.parse(window.sessionStorage.getItem("doctorInfo"));
    let startDate = patientInfo.startTime ? new Date(patientInfo.startTime).format("yyyy/MM/dd"):"";
    let endDate = patientInfo.endTime ? new Date(patientInfo.endTime).format("yyyy/MM/dd"):"";
    this.patInfo = {
      id: patientInfo.patientId,
      name: patientInfo.patientName,
      sex: patientInfo.patientSex,
      age: patientInfo.patientAge === null ? "":patientInfo.patientAge,
      telephone: patientInfo.patientPhone,
      homeAddress: patientInfo.patientAddress,
      family: patientInfo.familyMember,
      emergencyContact: patientInfo.emergencyContact,
      hospital: patientInfo.patientAddress,
      hosNo: patientInfo.hospitalCode,
      startDate: startDate,
      endDate: endDate,
      diagnose: patientInfo.diagnosis
    };
    this.docInfo = {
      docName: doctorInfo.doctorName,
      docWork: doctorInfo.doctorWork,
      docPhone: doctorInfo.doctorPhone,
      docHospital: doctorInfo.doctorLocation
    };
    this.$nextTick(() => {
      this.hackReset = true;
    });
  },
  methods: {
    update() {
      if (
        window.sessionStorage.getItem("loginType") == "admin" &&
        new Date().getTime() - window.sessionStorage.getItem("loginTime") <
          3600000
      ) {
        this.updateInfo();
      } else {
        this.showConfirm = true;
      }
    },
    onConfirm(value) {
      if (value === "adminQZ") {
        window.sessionStorage.setItem("loginType", "admin");
        window.sessionStorage.setItem("loginTime", new Date().getTime());
        this.updateInfo();
      } else {
        this.showToast = true;
      }
    },
    updateInfo() {
      this.submitting = true;
      var params = this.$qs.stringify({
        patientId: this.patInfo.id,
        patientName: this.patInfo.name,
        patientSex: this.patInfo.sex,
        patientAge: this.patInfo.age,
        patientPhone: this.patInfo.telephone,
        patientAddress: this.patInfo.homeAddress,
        familyMember: this.patInfo.family,
        emergencyContact: this.patInfo.emergencyContact,
        hospitalName: this.patInfo.hospital,
        hospitalCode: this.patInfo.hosNo,
        startTime:
          this.patInfo.startDate == "" ? "" : new Date(this.patInfo.startDate).getTime(),
        endTime:
          this.patInfo.endDate == "" ? "" : new Date(this.patInfo.endDate).getTime(),
        diagnosis: this.patInfo.diagnose,
        doctorName: this.docInfo.docName,
        doctorPhone: this.docInfo.docPhone,
        doctorWork: this.docInfo.docWork,
        doctorLocation: this.docInfo.docHospital
      });
      this.$axios({ method: "post", url: "/patient/update.next", data: params })
        .then(response => {
          this.submitting = false;
          if (response && response.data && response.data.success) {
            this.$router.push({
              name: "patientDetail",
              params: { id: response.data.data }
            });
          } else {
            console.error("添加用户信息接口出错啦。。。");
          }
        })
        .catch(error => {
          this.submitting = false;
        });
    }
  }
};
</script>

<style scoped>
.demo1-item {
  border: 1px solid #ececec;
  padding: 5px 10px;
}
.demo1-item-selected {
  border: 1px solid green;
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
</style>

<style>
.edit-patient .weui-label,
.edit-patient .vux-datetime {
  color: #555;
}
.edit-patient .weui-cell_access .weui-cell__ft {
  margin-left: 20px;
}
.edit-patient .weui-cells {
  font-size: 14px;
}
</style>

