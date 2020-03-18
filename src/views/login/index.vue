<template>
  <section class="user">
    <div class="user_options-container">
      <div class="user_options-text">
        <div class="user_options-unregistered">
          <h2 class="user_unregistered-title">ETL数据平台</h2>
          <p class="user_unregistered-text">
            ETL，Extraction-Trasformation-Loading，即数据读取，转换，装载的过程，是构建数据仓库的重要环节。信息是现代企业的重要资源，是企业运用科学管理、决策分析的基础。
          </p>
          <button class="user_unregistered-signup" id="signup-button">
            注册账户
          </button>
        </div>

        <div class="user_options-registered">
          <h2 class="user_registered-title">ETL数据平台</h2>
          <p class="user_registered-text">
            ETL，Extraction-Trasformation-Loading，即数据读取，转换，装载的过程，是构建数据仓库的重要环节。信息是现代企业的重要资源，是企业运用科学管理、决策分析的基础。
          </p>
          <button class="user_registered-login" id="login-button">登录系统</button>
        </div>
      </div>

      <div class="user_options-forms" id="user_options-forms">
        <div class="user_forms-login">
          <h2 class="forms_title">Login</h2>
          <form class="forms_form">
            <fieldset class="forms_fieldset">
              <div class="forms_field">
                <input
                  type="text"
                  placeholder="用户名"
                  class="forms_field-input"
                  required
                  autofocus
                  v-model="username"
                />
              </div>
              <div class="forms_field">
                <input
                  type="password"
                  placeholder="Password"
                  class="forms_field-input"
                  required
                  v-model="password"
                />
              </div>
            </fieldset>
            <div class="forms_buttons">
              <button type="button" class="forms_buttons-forgot">
                忘记密码?
              </button>
              <input
                type="submit"
                value="登录"
                class="forms_buttons-action"
                @click.prevent="handleSubmit"
              />
            </div>
          </form>
        </div>
        <div class="user_forms-signup">
          <h2 class="forms_title">Sign Up</h2>
          <form class="forms_form">
            <fieldset class="forms_fieldset">
              <div class="forms_field">
                <input
                  type="text"
                  placeholder="用户名"
                  class="forms_field-input"
                  required
                  v-model="username"
                />
              </div>
              <div class="forms_field">
                <input
                  type="password"
                  placeholder="密码"
                  class="forms_field-input"
                  required
                  v-model="password"
                />
              </div>
              <div class="forms_field">
                <input
                  type="password"
                  placeholder="重复密码"
                  class="forms_field-input"
                  required
                  v-model="rPassword"
                />
              </div>
            </fieldset>
            <div class="forms_buttons">
              <input
                type="submit"
                value="注册 "
                class="forms_buttons-action"
                @click.prevent="handleRegister"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import './style.scss'
import fetch from '@/services/fetch'
export default {
  data () {
    return {
      username: '',
      password: '',
      rPassword: ''
    }
  },
  mounted () {
    /**
     * 获取相关的DOM结点
     */
    const signupButton = document.getElementById('signup-button')
    const loginButton = document.getElementById('login-button')
    const userForms = document.getElementById('user_options-forms')

    /**
     * 为"注册帐号"按钮绑定事件
     */
    signupButton.addEventListener(
      'click',
      () => {
        this.reset()
        userForms.classList.remove('bounceRight')
        userForms.classList.add('bounceLeft')
      },
      false
    )

    /**
     * 为"登录系统"按钮绑定事件
     */
    loginButton.addEventListener(
      'click',
      () => {
        this.reset()
        userForms.classList.remove('bounceLeft')
        userForms.classList.add('bounceRight')
      },
      false
    )
  },
  methods: {
    // 重置输入框
    reset () {
      this.username = ''
      this.password = ''
      this.rPassword = ''
    },
    // 登录
    async handleSubmit () {
      let res = await fetch.post('/login', {
        username: this.username,
        password: this.password
      })
      if (!res.exception) {
        localStorage.setItem('userInfo', JSON.stringify(res.data))
        this.$message.success('登录成功')
        this.$router.push({ path: '/' })
      } else {
        this.$message.error(res.exception)
        this.reset()
      }
      return false
    },
    // 注册
    async handleRegister () {
      if (this.password !== this.rPassword) {
        this.$message.error('两次输入的密码不一致')
        this.reset()
        return
      }

      let res = await fetch.post('/register', {
        username: this.username,
        password: this.password
      })
      if (!res.exception) {
        this.$message.success('注册成功，请前往登录')
        this.reset()
        const userForms = document.getElementById('user_options-forms')
        userForms.classList.remove('bounceLeft')
        userForms.classList.add('bounceRight')
      } else {
        this.$message.error(res.exception)
        this.reset()
      }
    }
  }
}
</script>
