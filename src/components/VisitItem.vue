<template>
   <div class="item-box">
        <h5 class="item-classify">{{classify}}</h5>
        <h3 class="item-title">{{title}}</h3>
        <h6 class="item-record">
            <span>{{recordTime | getDate}}</span>
            <span>{{recordTime | getTime}}</span>
            <span>{{doctor}}</span>
        </h6>
        <span class="kyee-arrow-right"></span>
    </div>
</template>

<script>
export default {
  name: "visit-item",
  props: {
    classify: {
      type: String,
      default: "随访回访记录"
    },
    title: String,
    recordTime: String,
    doctor: String
  },
  data() {
    return {};
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

<style>
.item-box {
  position: relative;
  border-left: 6px solid #eee;
  border-radius: 4px;
  background: #fff;
  padding: 16px;
}
.item-classify {
  margin: 0;
  font-weight: 400;
  font-size: 13px;
  color: #555;
}
.item-title {
  margin: 6px 0 0 0;
  height: 30px;
  font-weight: 600;
  font-size: 18px;
  color: #666;
}
.item-record {
  margin: 0;
  font-weight: 400;
  font-size: 12px;
  color: #bbb;
}
.item-record > span {
  margin-right: 6px;
}
.kyee-arrow-right:after {
  content: " ";
  display: inline-block;
  height: 6px;
  width: 6px;
  border-width: 2px 2px 0 0;
  border-color: #c8c8cd;
  border-style: solid;
  -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
  position: absolute;
  top: 50%;
  margin-top: -4px;
  right: 20px;
}
</style>
