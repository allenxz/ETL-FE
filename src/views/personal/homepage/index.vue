<template>
  <div class="personal-homepage">
    <a-row :gutter="16">
      <a-col :span="6">
        <div class="left">
          <div class="avatar-wrapper">
            <a-avatar :size="80" src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png" />
          </div>
          <h1>{{info.userName}}</h1>
          <span class="introduce">{{info.introduce}}</span>
          <span>
            <font-awesome-icon :icon="['fas', 'address-card']" style="margin-right:5px;" />
            {{info.country}}
          </span>
          <span>
            <font-awesome-icon :icon="['fas', 'map-marked-alt']" style="margin-right:5px;" />
            {{info.province}}-{{info.city}}-{{info.street}}
          </span>
          <span>
            <font-awesome-icon :icon="['fas', 'phone']" style="margin-right:5px;" />
            {{info.areaCode}}-{{info.phoneNumber}}
          </span>
          <a-divider />
          <span>
            <a-tag color="#f50">拥有流程数：{{resources.processCount}}</a-tag>
          </span>
          <span>
            <a-tag color="#2db7f5">拥有配置数：{{resources.confCount}}</a-tag>
          </span>
          <span>
            <a-tag color="#87d068">拥有部署数：{{resources.containDeploymentCount}}</a-tag>
          </span>
          <span>
            <a-tag color="#108ee9">拥有授权部署数：{{resources.authorizeDeploymentCount}}</a-tag>
          </span>
        </div>
      </a-col>
      <a-col :span="18">
        <div class="right">
          <h1>选择查看时间的范围</h1>
          <a-range-picker
            :defaultValue="defaultValue"
            :ranges="{ '今天': today, '本周': week, '本月': month, '今年': year }"
            @change="onChange"
            style="margin-bottom:20px;"/>
          <div id="report" :style="{width: '100%', height: '300px'}"></div>
          <div id="byte" :style="{width: '100%', height: '300px'}"></div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import './style.scss'
import moment from 'moment'
import formatBytes from '@/utils/bytes'
import fetch from '@/services/fetch'
export default {
  data () {
    return {
      info: {},
      resources: {},
      startTime: moment().startOf('month').format('YYYY-MM-DD'),
      endTime: moment().endOf('month').format('YYYY-MM-DD'),
      rangeData: {},
      defaultValue: [moment().startOf('month'), moment().endOf('month')],
      today: [moment(), moment()],
      month: [moment().startOf('month'), moment().endOf('month')],
      week: [moment().startOf('week'), moment().endOf('week')],
      year: [moment().startOf('year'), moment().endOf('year')],
      reportXAxis: [],
      reportSeries: [],
      byteXAxis: [],
      byteSeries: []
    }
  },
  mounted () {
    this.getUserInfo()
    this.getUserResource()
    this.getDataInRange()
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      let res = await fetch.post('/getUserInformation')
      if (res.data) {
        this.info = res.data.userInformation
      } else {
        alert('用户信息获取失败')
      }
    },
    // 获取用户所有资源信息
    async getUserResource () {
      let res = await fetch.post('/getAllUserResourceCount')
      if (res.data) {
        this.resources = res.data
      } else {
        alert('用户资源列表获取失败')
      }
    },
    // 更改时间范围
    onChange (date, dateString) {
      this.startTime = dateString[0]
      this.endTime = dateString[1]
      this.getDataInRange()
    },
    // 获取指定时间范围内的数据
    async getDataInRange () {
      let res = await fetch.post('/getStatisticalData', {
        startTime: this.startTime,
        endTime: this.endTime
      })
      if (res.data) {
        this.rangeData = res.data.result
        // 准备图表数据
        this.loadData()
        // 绘制任务相关柱状图
        this.drawBarChart('report', this.reportXAxis, this.reportSeries, '任务报告数统计')
        this.drawBarChart('byte', this.byteXAxis, this.byteSeries, '处理数据量统计')
      } else {
        alert('区间数据获取失败')
      }
    },
    // 装载图表数据
    loadData () {
      this.reportXAxis = ['成功任务报告数', '终止任务报告数', '失败任务报告数']
      this.reportSeries = [this.rangeData.successCount, this.rangeData.killedCount, this.rangeData.failedCount]
      // 重置数组
      this.byteXAxis = []
      this.byteSeries = []
      this.rangeData.readerType.forEach(i => {
        this.byteXAxis.push(i + '读取数据量')
      })
      this.rangeData.readBytes.forEach(i => {
        this.byteSeries.push(i)
      })
      this.rangeData.writerType.forEach(i => {
        this.byteXAxis.push(i + '写入数据量')
      })
      this.rangeData.writerBytes.forEach(i => {
        this.byteSeries.push(i)
      })
    },
    // 绘制柱状图
    drawBarChart (id, xAxis, series, title) {
      let chart = document.getElementById(id)
      let myChart = this.$echarts.init(chart)
      let colorList
      let unit
      if (id === 'report') {
        colorList = [
          '#d0e6a5',
          '#ffdd96',
          '#fc887b'
        ]
        unit = '份'
      } else {
        colorList = [
          '#c23531',
          '#2f4554',
          '#61a0a8',
          '#d48265',
          '#91c7ae',
          '#749f83'
        ]
        unit = 'B'
      }
      myChart.setOption({
        title: {
          text: title
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            let str
            let name = params[0].name
            let length = name.length
            if (name[length - 1] === '数') {
              str = name + ' : ' + params[0].value + unit
            } else {
              str = name + ' : ' + formatBytes(params[0].value) + unit
            }
            return str
          }
        },
        xAxis: {
          type: 'category',
          data: xAxis
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: series,
          type: 'bar',
          itemStyle: {
            normal: {
              // 每根柱子颜色设置
              color: function (params) {
                return colorList[params.dataIndex]
              }
            }
          }
        }]
      })
    }
  }
}
</script>
