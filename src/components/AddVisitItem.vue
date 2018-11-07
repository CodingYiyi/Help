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
      <cell-box>
        <span style="color:#555;font-size:14px;margin:0 15px;">帮扶照片</span>
        <div v-for="(item, index) in selectedPic" class="img_box" :style="{marginRight:index != 2? '10px': 0}">
          <img :src="item.src" class="pic_item"  @click="showImg(index)">
          <span class="span_delete delete_btn" @click="deletePic(index)"></span>
        </div>
        <img v-if="canAddPic" src="../assets/add.png" style="width:60px" class="needsclick" @click="addPic">
      </cell-box>
    </group>
    <div v-transfer-dom>
      <loading :show="submitting" text="数据保存中..."></loading>
    </div>
    <div v-transfer-dom>
      <previewer :list="selectedPic" ref="previewer" :options="options"></previewer>
    </div>
    <input type="file" accept="image/*" style="display:none" id="selectPic" @change="selectPic">
    <footer class="footer">
      <x-button type="primary" :show-loading="submitting" :disabled="submitting" @click.native="add">保存随访记录</x-button>
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
  Datetime,
  Loading,
  Previewer,
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
    Datetime,
    Loading,
    Previewer
  },
  data() {
    return {
      docName: "",
      helpMeasure: "",
      helpDate: this.getNow(),
      submitting: false,
      selectedPic: [],
      canAddPic: true,

      options: {
        getThumbBoundsFn(index) {
          // find thumbnail element
          let thumbnail = document.querySelectorAll(".pic_item")[index];
          // get window scroll Y
          let pageYScroll =
            window.pageYOffset || document.documentElement.scrollTop;
          // optionally get horizontal scroll
          // get position of element relative to viewport
          let rect = thumbnail.getBoundingClientRect();
          // w = width
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
          // Good guide on how to get element coordinates:
          // http://javascript.info/tutorial/coordinates
        }
      }
    };
  },
  methods: {
    getNow: function() {
      var now = new Date();
      return now.format("yyyy/MM/dd hh:mm");
    },
    showImg(index) {
      this.$refs.previewer.show(index);
    },
    add: function() {
      this.submitting = true;
      var patientId = this.$route.query.patientId;
      var doctorId = this.$route.query.doctorId;
      // var params = this.$qs.stringify({
      //   patientId: patientId,
      //   doctorId: doctorId,
      //   assistDetail: this.helpMeasure,
      //   createTime: new Date(this.helpDate).getTime()
      // });
      var params = new FormData();
      for (let item of this.selectedPic) {
        params.append("assistImages", item.file);
      }
      params.append("patientId", patientId);
      params.append("doctorId", doctorId);
      params.append("assistDetail", this.helpMeasure);
      params.append("createTime", new Date(this.helpDate).getTime());
      let config = {
        timeout: 10000,
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      this.$axios.post("/assist/add", params ,config)
        .then(response => {
          this.submitting = false;
          if (response && response.data && response.data.success) {
            this.$router.push({
              name: "patientDetail",
              params: { id: this.$route.query.patientId }
            });
          }
        })
        .catch(error => {
          this.submitting = false;
        });
    },
    addPic: function() {
      var dom = document.getElementById("selectPic");
      dom.click();
    },
    selectPic: function(event) {
      console.log(event);
      var file = event.target.files[0];
      var url = URL.createObjectURL(file);
      this.selectedPic = [
        ...this.selectedPic,
        {
          src: url,
          file: file
        }
      ];
      if (this.selectedPic.length === 3) {
        this.canAddPic = false;
      }
    },
    deletePic: function(index) {
      console.log(index);
      this.selectedPic.splice(index, 1);
      this.canAddPic = true;
    }
  },
  mounted: function() {
    this.docName = this.$route.query.doctorName;
  }
};
</script>
<style scoped>
.img_box {
  position: relative;
  width: 60px;
  height: 80px;
  display: flex;
  align-items: center;
  overflow: hidden;
}
.pic_item {
  width: 60px;
}
.span_delete {
  border: 1px solid #fff;
  width: 20px;
  height: 20px;
  display: inline-block;
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: rgba(0, 0, 0, 0.4);
  box-sizing: border-box;
}

.delete_btn {
  border-radius: 50px;
  -webkit-border-radius: 50px;
  -moz-border-radius: 50px;
}
.delete_btn:before {
  content: "";
  height: 1px;
  width: 10px;
  display: block;
  background: #fff;
  position: absolute;
  top: 8.5px;
  left: 4px;
  transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  -ms-transform: rotate(-45deg);
}

.delete_btn:after {
  content: "";
  height: 1px;
  width: 10px;
  display: block;
  background: #fff;
  position: absolute;
  top: 8.5px;
  left: 4px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
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

