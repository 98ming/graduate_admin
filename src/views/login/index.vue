<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="loginForm"
               ref="loginForm"
               label-position="left">
        <div style="text-align: center">
          <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
        </div>
        <h2 class="login-title color-main">nice商品在线购物管理端</h2>
        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model.trim="loginForm.username"
                    autoComplete="on"
                    placeholder="请输入用户名">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    v-model.trim="loginForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="login">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
  </div>
</template>

<script>
  import login_center_bg from '@/assets/images/login_center_bg.png'
  import foowwLocalStorage from '../../api/localStorage'

  export default {
    name: 'login',
    data() {
      return {
        loginForm: {
          username: '',
          password: '',
        },
        loading: false,
        pwdType: 'password',
        login_center_bg
      }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
      login() {
        if (this.loginForm.username === '' || this.loginForm.password === '') {
          this.$message({
            type: 'warning',
            message: '请输入用户名和密码'
          });
          return;
        }
        this.$axios.post('/admin/login', this.loginForm).then(res => {
          if (res.status === 200 && res.data.err_code === 0) {
            this.$store.state.admin.avatar = res.data.admin.avatar;
            foowwLocalStorage.set('admin', res.data.admin._id, 1000 * 60 * 60 * 24);
            this.$message({
              type: 'success',
              message: '登录成功'
            });
            this.$router.push('/home');
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
</style>
