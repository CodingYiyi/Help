<template>
  <div>    
    <group v-if="policyList.length>0" title="扶贫政策列表">
      <cell style="color:#666" v-for="item in policyList" v-bind:key="item.policyID" is-link :title="item.policyTitle" @click.native="showPolicyDetail(item.policyUrl)"></cell>
    </group>
    <load-more v-if="policyList.length == 0" tip="暂无数据" :show-loading="false"></load-more>
    <div v-transfer-dom>
      <loading :show="loading" text="数据加载中..."></loading>
    </div>
  </div>
</template>

<script>
import {
  Group,
  Cell,
  LoadMore,
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
    LoadMore,
    Loading
  },
  data() {
    return {
      policyList: [],
      loading: false
    };
  },
  mounted: function() {
    this.loading = true;
    this.$axios
      .get("/policy/getPolicyList.next")
      .then(response => {
        this.loading = false;
        if (response && response.data && response.data.success) {
          var res = response.data;
          for (var item of res.data) {
            this.policyList.push({
              policyID: item.recordId,
              policyTitle: item.itemName,
              policyUrl: item.itemUrl
            });
          }
        } else {
          console.log("请求扶贫政策列表接口出错啦。。。");
        }
      })
      .catch(error => {
        this.loading = false;
      });
  },
  methods: {
    showPolicyDetail: function(url) {
      window.open(url);
    }
  }
};
</script>

<style scoped>
</style>
