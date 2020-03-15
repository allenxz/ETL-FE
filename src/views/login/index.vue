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
                  placeholder="Full Name"
                  class="forms_field-input"
                  required
                />
              </div>
              <div class="forms_field">
                <input
                  type="email"
                  placeholder="Email"
                  class="forms_field-input"
                  required
                />
              </div>
              <div class="forms_field">
                <input
                  type="password"
                  placeholder="Password"
                  class="forms_field-input"
                  required
                />
              </div>
            </fieldset>
            <div class="forms_buttons">
              <input
                type="submit"
                value="注册 "
                class="forms_buttons-action"
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
      password: ''
    }
  },
  mounted () {
    /**
     * Variables
     */
    const signupButton = document.getElementById('signup-button')
    const loginButton = document.getElementById('login-button')
    const userForms = document.getElementById('user_options-forms')

    /**
     * Add event listener to the "Sign Up" button
     */
    signupButton.addEventListener(
      'click',
      () => {
        userForms.classList.remove('bounceRight')
        userForms.classList.add('bounceLeft')
      },
      false
    )

    /**
     * Add event listener to the "Login" button
     */
    loginButton.addEventListener(
      'click',
      () => {
        userForms.classList.remove('bounceLeft')
        userForms.classList.add('bounceRight')
      },
      false
    )
  },
  methods: {
    async handleSubmit () {
      let params = new URLSearchParams()
      params.append('username', this.username)
      params.append('password', this.password)
      let res = await fetch.post('/login', params)
      if (res.exception === null) {
        localStorage.setItem('token', res.data.token)
        this.$message.success('登录成功')
        this.$router.push({ path: '/' })
      }
      return false
    }
  }
}
</script>
