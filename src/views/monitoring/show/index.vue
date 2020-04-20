<template>
  <div class="monitoring-show">
    <a-empty description="暂无正在运行的部署" class="empty" v-if="deploymentDesc.length === 0"/>
    <a-card :id="deploymentIds[index]" :title="deploymentNames[index]" style="width: 100%" v-for="(item, index) of deploymentDesc" :key="index">
      <a href="#" slot="extra">
        <a-icon @click="updateDesc" type="reload" style="margin-right:20px;font-size:18px;"/>
        <!-- <a-icon type="fullscreen" v-if="!isFullscreen" @click="launchIntoFullscreen(deploymentIds[index])" style="font-size:18px;"/>
        <a-icon type="fullscreen-exit" v-else @click="exitFullscreen" style="font-size:18px;"/> -->
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
      deploymentNames: [],
      isFullscreen: false
    }
  },
  mounted () {
    this.checkQuestions()
    this.updateDesc()
  },
  methods: {
    // 刷新数据
    updateDesc () {
      this.isFullscreen = false
      this.getRunningDeploymentIds()
      setTimeout(() => {
        this.drawBarChart()
        this.drawleftGauge()
        this.drawRightGauge()
      }, 400)
    },
    // 获取正在运行的部署信息
    async getRunningDeploymentIds () {
      let res = await fetch.post('/getRunningDeployments')
      this.deploymentIds = res.data.deploymentIds
      this.deploymentNames = res.data.deploymentNames
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
    },
    // 进入全屏
    launchIntoFullscreen (id) {
      this.isFullscreen = true
      let element = document.getElementById(id)
      if (element.requestFullscreen) {
        element.requestFullscreen()
      } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen()
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen()
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen()
      }
    },
    // 退出全屏
    exitFullscreen () {
      this.isFullscreen = false
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      }
    },
    // 校验是否设置了密保问题
    async checkQuestions () {
      let res = await fetch.post('/getUserQuestions')
      if (res.data.questionAndAnswers.length === 0) {
        this.$message.warning('系统检测到您未设置密保问题，请设置！')
        this.$router.push({ path: '/personal-setting' })
      }
    }
  }
}

</script>
