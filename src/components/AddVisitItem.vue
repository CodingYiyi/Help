<template>
  <div class="add-visit-item" style="margin-bottom:70px">
    <group title="随访回访记录">
      <cell-box>
        <x-input title="家庭医生" v-model="docName" required readonly></x-input>
      </cell-box>
      <cell-box>
        <datetime title="帮扶时间" v-model="helpDate" placeholder="请选择入院时间" format="YYYY/MM/DD HH:mm" :minute-list="['00', '15', '30', '45']"></datetime>
      </cell-box>
      <cell-box>
        <x-textarea title="帮扶措施" v-model="helpMeasure" placeholder="请填写您采取的帮扶措施" :show-counter="false" :rows="1" autosize></x-textarea>
      </cell-box>
    </group>
    <div v-transfer-dom>
      <loading :show="submitting" text="数据保存中..."></loading>
    </div>
    <footer class="footer">
      <x-button type="primary" :show-loading="submitting" :disabled="submitting" @click.native="add">保存随访记录</x-button>
    </footer>
  </div>
</template>

<script>
import {
  Group,
  Cell,
  CellFormPreview,
  CellBox,
  XButton,
  XInput,
  XTextarea,
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
    Cell,
    CellBox,
    CellFormPreview,
    XButton,
    XInput,
    XTextarea,
    Datetime,
    Loading
  },
  data() {
    return {
      docName: "",
      helpMeasure: "",
      helpDate: this.getNow(),
      submitting: false
    };
  },
  methods: {
    getNow: function() {
      var now = new Date();
      return now.format("yyyy/MM/dd hh:mm");
    },
    add: function() {
      this.submitting = true;
      var patientId = this.$route.query.patientId;
      var doctorId = this.$route.query.doctorId;
      var params = this.$qs.stringify({
        patientId: patientId,
        doctorId: doctorId,
        assistDetail: this.helpMeasure,
        createTime: (new Date(this.helpDate)).getTime()
      });
      axios({ method: "post", url: "/assist/add", data: params })
        .then(response => {
          this.submitting = false;
          if(response && response.data && response.data.success){
            this.$router.push({ name: "patientDetail", params: { id: this.$route.query.patientId} });
          }
        })
        .catch(error => {
          this.submitting = false;
        });
    }
  },
  mounted: function() {
    this.docName = this.$route.query.doctorName;
  }
};
</script>
<style scoped>
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
.add-visit-item .weui-label,
.add-visit-item .vux-datetime {
  color: #555;
}
.add-visit-item .weui-cell_access .weui-cell__ft {
  margin-left: 20px;
}
.add-visit-item .weui-cells {
  font-size: 14px;
}
</style>

