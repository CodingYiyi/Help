<template>
  <div class="visit-detail">
    <msg title="入户走访"></msg>
    <div style="text-align:center;">
        <h5 class="item-classify">随访回访记录</h5>
        <h6 class="item-record">
            <span>{{recordTime | getDate}}</span>
            <span>{{recordTime | getTime}}</span>
        </h6>
        <h6 class="item-record">
            <span>{{doctorName}}</span>
        </h6>
    </div>
    <group>
      <cell primary="content" title="帮扶措施" :value="helpDetail"></cell>
    </group>
    <div v-transfer-dom>
      <loading :show="loading" text="数据加载中..."></loading>
    </div>
  </div>
</template>

<script>
import {
  Msg,
  Group,
  Cell,
  Loading,
  TransferDomDirective as TransferDom
} from "vux";

export default {
  directives: {
    TransferDom
  },
  components: {
    Msg,
    Group,
    Cell,
    Loading
  },
  mounted: function() {
    this.loading = true;
    axios
      .get("/assist/query", { params: { recordId: this.$route.params.id } })
      .then(response => {
        this.loading = false;
        if (response && response.data && response.data.success) {
          var data = response.data.data;
          this.recordTime = new Date(data.assistDetail.createTime).format(
            "yyyyMMddhhmm"
          );
          this.doctorName = data.familyDoctor.doctorName;
          this.helpDetail = data.assistDetail.assistDetail;
        } else {
          console.log("获取随访详情接口报错啦。。。");
        }
      })
      .catch(error => {
        this.loading = false;
      });
  },
  data() {
    return {
      loading: false,
      recordTime: "",
      doctorName: "",
      helpDetail: ""
    };
  },
  filters: {
    getDate: function(value) {
      if (!value || value.length < 4) return "";
      if (value.length < 8) return value.substring(0, 4);
      else
        return (
          value.substring(0, 4) +
          "-" +
          value.substring(4, 6) +
          "-" +
          value.substring(6, 8)
        );
    },
    getTime: function(value) {
      if (!value || value.length < 12) return "";
      else return value.substring(8, 10) + ":" + value.substring(10, 12);
    }
  }
};
</script>

<style scoped>
.item-classify {
  margin: 0;
  font-weight: 400;
  font-size: 18px;
  color: #454545;
}
.item-record {
  margin: 0;
  font-weight: 400;
  font-size: 13px;
  color: #888;
}
.item-record > span {
  margin-right: 6px;
}
</style>
<style>
.visit-detail .weui-msg__icon-area {
  margin-bottom: 16px;
}
.visit-detail .weui-icon_msg {
  font-size: 68px;
}
.visit-detail .weui-msg__opr-area {
  display: none;
}
.visit-detail .weui-msg__text-area {
  margin-bottom: 8px;
}
.visit-detail .weui-msg__text-area > .weui-msg__title {
  font-size: 24px;
}
.visit-detail .vux-cell-bd {
  margin-right: 10px;
}
.visit-detail .weui-cell__ft {
  text-align: left;
}
.visit-detail .weui-cells {
  font-size: 14px;
}
</style>

