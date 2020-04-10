<template>
  <div class="monitoring-show">
    <a-empty class="empty" v-if="deploymentDesc.length === 0"/>
    <a-card title="Default size card" style="width: 100%" v-for="(item, index) of deploymentDesc" :key="index">
      <a href="#" slot="extra">
        <a-icon @click="updateDesc" type="reload" />
      </a>
      <h2>数据处理进度</h2>
      <ProgressBar :valuenow="countValue(item)"></ProgressBar>
      <a-row style="margin-top:50px;">
        <a-col :span="24">
          <div :id="deploymentIds[index] + 'bar'" :style="{width: '100%', height: '300px'}"></div>
        </a-col>
      </a-row>
      <a-row style="margin-top:50px;">
        <a-col :span="12">
          <div :id="deploymentIds[index] + 'left'" :style="{width: '100%', height: '300px'}"></div>
        </a-col>
        <a-col :span="12">
          <div :id="deploymentIds[index] + 'right'" :style="{width: '100%', height: '300px'}"></div>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
import ProgressBar from '@/components/progress-bar'
export default {
  components: {
    ProgressBar
  },
  data () {
    return {
      deploymentIds: [],
      deploymentDesc: [],
      valuenow: 80
    }
  },
  mounted () {
    this.updateDesc()
  },
  methods: {
    // 刷新数据
    updateDesc () {
      this.getRunningDeploymentIds()
      setTimeout(() => {
        this.drawBarChart()
        this.drawleftGauge()
        this.drawRightGauge()
      }, 400)
    },
    // 获取正在运行的部署Id
    async getRunningDeploymentIds () {
      let res = await fetch.post('/getRunningDeploymentIds')
      this.deploymentIds = res.data.DeploymentIds
      this.getDesc()
    },
    // 获取详情
    async getDesc () {
      let tmp = []
      this.deploymentIds.forEach(async function (i) {
        let res = await fetch.post('/getRunningInformation', {
          deploymentId: i
        })
        tmp.push(res.data)
      })
      this.deploymentDesc = tmp
    },
    // 计算进度
    countValue (item) {
      let finishTasks = item.finishTasks || 0
      let res = Math.round(finishTasks / item.taskNum * 100)
      return res === 0 ? 1 : res
    },
    // 绘制柱状图
    drawBarChart () {
      if (this.deploymentDesc.length === 0) {
        return
      }
      this.deploymentIds.forEach((id, index) => {
        let chart = document.getElementById(id + 'bar')
        let myChart = this.$echarts.init(chart)
        myChart.setOption({
          title: {
            text: '统计数据柱状图'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: ['读取', '写入']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
          },
          yAxis: {
            type: 'category',
            data: ['ETL的数据条数', '数据字节数', '数据条数']
          },
          series: [
            {
              name: '读取',
              type: 'bar',
              data: [
                this.deploymentDesc[index].readSucceedRecords || 0,
                this.deploymentDesc[index].readSucceedBytes || 0,
                this.deploymentDesc[index].totalInputETLRecords || 0
              ]
            },
            {
              name: '写入',
              type: 'bar',
              data: [
                this.deploymentDesc[index].writeSucceedRecords || 0,
                this.deploymentDesc[index].writeSucceedBytes || 0,
                this.deploymentDesc[index].totalOutPutETLRecords || 0
              ]
            }
          ]
        })
      })
    },
    // 绘制左仪表盘
    drawleftGauge () {
      if (this.deploymentDesc.length === 0) {
        return
      }
      this.deploymentIds.forEach((id, index) => {
        let chart = document.getElementById(id + 'left')
        let myChart = this.$echarts.init(chart)
        myChart.setOption({
          tooltip: {
            formatter: '<br/>{b} : {c}Bytes/s'
          },
          series: [
            {
              title: {
                show: true,
                offsetCenter: ['0', '-30'],
                textStyle: {
                  color: '#444A56',
                  fontSize: 14,
                  fontFamily: 'Microsoft YaHei'
                }
              },
              type: 'gauge',
              data: [{ value: this.deploymentDesc[index].byteSpeed || 0, name: '数据处理速度' }]
            }
          ]
        })
      })
    },
    // 绘制右仪表盘
    drawRightGauge () {
      if (this.deploymentDesc.length === 0) {
        return
      }
      this.deploymentIds.forEach((id, index) => {
        let chart = document.getElementById(id + 'right')
        let myChart = this.$echarts.init(chart)
        myChart.setOption({
          tooltip: {
            formatter: '{b} : {c}条/秒'
          },
          series: [
            {
              title: {
                show: true,
                offsetCenter: ['0', '-30'],
                textStyle: {
                  color: '#444A56',
                  fontSize: 14,
                  fontFamily: 'Microsoft YaHei'
                }
              },
              type: 'gauge',
              data: [{ value: this.deploymentDesc[index].recordSpeed || 0, name: '记录处理速度' }]
            }
          ]
        })
      })
    }
  }
}

</script>