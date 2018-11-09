<template>
  <div class="add-patient" style="margin-bottom:70px;">
    <group gutter="10px">
      <cell-box>
         <x-icon type="android-person"></x-icon>
         <span style="margin-left:6px">贫困户信息</span>
      </cell-box>
      <cell-box>
        <x-input title="姓名" placeholder="请输入姓名" v-model="name" required></x-input>
      </cell-box>
      <cell-box>
        <span style="margin:0 18px 0 14px;color:#555">性别</span>
        <checker v-model="sex" radio-required default-item-class="demo1-item" selected-item-class="demo1-item-selected">
          <checker-item value="1">男</checker-item>
          <checker-item value="0" style="margin-left:10px">女</checker-item>
        </checker>
      </cell-box>
      <cell-box>
        <x-input title="年龄" placeholder="请输入年龄" mask="999" v-model="age" required></x-input>
        <span>岁</span>
      </cell-box>
      <cell-box>
        <x-input title="联系电话" placeholder="请输入联系电话" v-model="telephone" required mask="999 9999 9999" :max="13" is-type="china-mobile"></x-input>
      </cell-box>
      <cell-box>
        <x-textarea title="家庭住址" placeholder="请输入家庭住址" v-model="homeAddress" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
      <cell-box>
        <x-textarea title="家庭成员" placeholder="请输入家庭成员信息" v-model="family" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
      <cell-box>
        <x-textarea title="紧急联系人" placeholder="请输入紧急联系人姓名及联系方式" v-model="emergencyContact" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
      <cell-box>
        <x-textarea title="就诊医院" placeholder="请输入就诊医院" v-model="hospital" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
      <cell-box>
        <x-input title="住院号" placeholder="请输入住院号" v-model="hosNo" required></x-input>
      </cell-box>
      <cell-box>
        <datetime v-model="startDate" placeholder="请选择入院时间" title="入院时间" format="YYYY/MM/DD" ></datetime>
      </cell-box>
       <cell-box>
        <datetime v-model="endDate" placeholder="请选择出院时间" title="出院时间" format="YYYY/MM/DD" ></datetime>
      </cell-box>
      <cell-box>
        <x-textarea title="出院诊断" placeholder="请填写出院诊断" v-model="diagnose" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
    </group>
    <group>
      <cell-box>
        <x-icon type="medkit"></x-icon>
        <span style="margin-left:6px">家庭医生信息</span>
      </cell-box>
      <cell-box>
        <x-input title="姓名" placeholder="请输入姓名" v-model="docName" required></x-input>
      </cell-box>
      <cell-box>
        <x-input title="职务" placeholder="请输入从事职务" v-model="docWork" required></x-input>
      </cell-box>
      <cell-box>
        <x-input title="联系电话" placeholder="请输入联系电话" v-model="docPhone" required mask="999 9999 9999" :max="13" is-type="china-mobile"></x-input>
      </cell-box>
      <cell-box>
        <x-textarea title="工作单位" placeholder="请输入工作单位" v-model="docHospital" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
    </group>
    <div v-transfer-dom>
      <loading :show="submitting" text="数据保存中..."></loading>
    </div>
    <footer class="footer">
      <x-button type="primary" :show-loading="submitting" :disabled="submitting" @click.native="add">保存用户信息</x-button>
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
  Loading,
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
    Loading
  },
  data() {
    return {
      name: "",
      sex: "1",
      age: "",
      telephone: "",
      homeAddress: "",
      family: "",
      emergencyContact: "",
      hospital: "",
      hosNo: "",
      startDate: "",
      endDate: "",
      diagnose: "",

      docName: "",
      docWork: "",
      docPhone: "",
      docHospital: "",

      submitting: false
    };
  },
  methods: {
    add: function() {
      this.submitting = true;
      var params = this.$qs.stringify({
        patientName: this.name,
        patientSex: this.sex,
        patientAge: this.age,
        patientPhone: this.telephone,
        patientAddress: this.homeAddress,
        familyMember: this.family,
        emergencyContact: this.emergencyContact,
        hospitalName: this.hospital,
        hospitalCode: this.hosNo,
        startTime: new Date(this.startDate).getTime(),
        endTime: new Date(this.endDate).getTime(),
        diagnosis: this.diagnose,
        doctorName: this.docName,
        doctorPhone: this.docPhone,
        doctorWork: this.docWork,
        doctorLocation: this.docHospital
      });
      this.$axios({ method: "post", url: "/patient/add.next", data: params })
        .then(response => {
          this.submitting = false;
          if(response && response.data && response.data.success){
            this.$router.push({ name: "patientDetail", params: { id: response.data.data } });
          }else{
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
.add-patient .weui-label,
.add-patient .vux-datetime {
  color: #555;
}
.add-patient .weui-cell_access .weui-cell__ft {
  margin-left: 20px;
}
.add-patient .weui-cells {
  font-size: 14px;
}
</style>

