<template>
  <div class="personal-setting">
    <a-tabs tabPosition="left">
      <a-tab-pane key="1">
        <span slot="tab">
          <font-awesome-icon :icon="['fas', 'user-cog']"/>
          基本设置
        </span>
        <h1>基本设置</h1>
        <a-form :form="form" :label-col="{ span: 24 }" :wrapper-col="{ span: 12 }" @submit="handleSubmit">
          <a-form-item label="昵称">
            <a-input
              v-decorator="['nickName', { rules: [{ required: true, message: '请输入您的昵称!' }] }]"
              placeholder="给自己起个好听的名字吧"
            />
          </a-form-item>
          <a-form-item label="个人简介">
            <a-textarea placeholder="介绍一下自己吧" :rows="4"  v-decorator="['introduce', { rules: [{ required: false }] }]"/>
          </a-form-item>
          <a-form-item label="国家">
            <a-select v-decorator="['country']" placeholder="选择你的国家">
              <a-select-option v-for="(item, index) of countryOptions" :key="index" :value="item">{{item}}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="所在省市">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-select v-decorator="['province', { rules: [{ required: true, message: '请输入您的城市!' }] }]" @change="handleProvinceChange">
                  <a-select-option v-for="province in provinceData" :key="province">
                    {{province}}
                  </a-select-option>
                </a-select>
              </a-col>
              <a-col :span="12">
                <a-select v-decorator="['city', { rules: [{ required: true, message: '请输入您的城市!' }] }]">
                  <a-select-option v-for="city in cityData" :key="city">{{city}}</a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item label="街道地址">
            <a-input placeholder="XX区XX路 XX 号" v-decorator="['street', { rules: [{ required: false }] }]"/>
          </a-form-item>
          <a-form-item label="联系电话">
            <a-row :gutter="10">
              <a-col :span="6">
                <a-input placeholder="区号" v-decorator="['areaCode', { rules: [{ required: false }] }]"/>
              </a-col>
              <a-col :span="18">
                <a-input placeholder="电话号码" v-decorator="['phoneNumber', { rules: [{ required: false }] }]"/>
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
            <a-button type="primary" html-type="submit">
              更换基本信息
            </a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2">
        <span slot="tab">
          <font-awesome-icon :icon="['fas', 'user-lock']"/>
          安全设置
        </span>
        <h1>安全设置</h1>
        <section style="margin-bottom:15px;">
          <h2>密保问题一</h2>
          <a-input-group compact>
            <a-input style="width: 50%" placeholder="问题" v-model="questions[0].question"/>
            <a-input style="width: 50%" placeholder="答案" v-model="questions[0].answer"/>
          </a-input-group>
        </section>
        <section style="margin-bottom:15px;">
          <h2>密保问题二</h2>
          <a-input-group compact>
            <a-input style="width: 50%" placeholder="问题" v-model="questions[1].question"/>
            <a-input style="width: 50%" placeholder="答案" v-model="questions[1].answer"/>
          </a-input-group>
        </section>
        <section style="margin-bottom:15px;">
          <h2>密保问题三</h2>
          <a-input-group compact>
            <a-input style="width: 50%" placeholder="问题" v-model="questions[2].question"/>
            <a-input style="width: 50%" placeholder="答案" v-model="questions[2].answer"/>
          </a-input-group>
        </section>
        <section class="btn-layout">
          <a-button type="primary" @click="updateQuestions">更新密保问题</a-button>
        </section>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
import countryInfo from './country'
import provinceData from './province'
import cityData from './city'
export default {
  data () {
    return {
      userInfo: '',
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      countryOptions: countryInfo,
      provinceData,
      cityData: [],
      questions: []
    }
  },
  mounted () {
    this.getUserInfo()
    this.loadQuestions()
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      let res = await fetch.post('/getUserInformation')
      this.userInfo = res.data.userInformation
      this.loadUserInfo()
    },
    // 提交表单
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          this.updateInfo(values)
        }
      })
    },
    // 省市联动
    handleProvinceChange (value) {
      this.cityData = cityData[value]
    },
    // 更新用户信息
    async updateInfo (values) {
      let res = await fetch.post('/updateUserInformation', {
        nickName: values.nickName,
        introduce: values.introduce,
        country: values.country,
        province: values.province,
        city: values.city,
        street: values.street,
        areaCode: values.areaCode,
        phoneNumber: values.phoneNumber
      })
      if (res.data) {
        this.$message.success(res.data.message)
      } else {
        this.$message.error(res.exception)
      }
    },
    // 加载用户信息
    loadUserInfo () {
      this.form.setFieldsValue({
        nickName: this.userInfo.nickName,
        introduce: this.userInfo.introduce,
        country: this.userInfo.country,
        province: this.userInfo.province,
        city: this.userInfo.city,
        street: this.userInfo.street,
        areaCode: this.userInfo.areaCode,
        phoneNumber: this.userInfo.phoneNumber
      })
    },
    // 更新密保问题
    async updateQuestions () {
      for (let i = 0; i < 3; i++) {
        if (this.questions[i].question === '' || this.questions[i].answer === '') {
          this.$message.error('三项密保问题的设置中不允许有空')
          return
        }
      }
      let res = await fetch.post('/setUserQuestions', {
        data: JSON.stringify(this.questions)
      })
      if (res.data) {
        this.$message.success(res.data.message)
      } else {
        this.$message.error(res.exception)
      }
    },
    // 加载用户密保问题
    async loadQuestions () {
      let res = await fetch.post('/getUserQuestions')
      if (res.data.questionAndAnswers.length === 0) {
        this.questions = [
          {
            question: '',
            answer: ''
          },
          {
            question: '',
            answer: ''
          },
          {
            question: '',
            answer: ''
          }
        ]
      } else {
        this.questions = res.data.questionAndAnswers
      }
    }
  }
}

</script>
