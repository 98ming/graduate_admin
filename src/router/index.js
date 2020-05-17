import Vue from 'vue'
import Router from 'vue-router'

import Layout from '../views/layout/Layout'
import {Message} from "element-ui";
import foowwLocalStorage from '../api/localStorage'

Vue.use(Router);

const router = new Router({
  routes: [
    {path: '/404', component: () => import('@/views/404')},
    {path: '/login', component: () => import('@/views/login/index')},
    {
      path: '',
      component: Layout,
      redirect: '/login',
      children: [{
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: {title: '首页', icon: 'home'}
      }]
    },
    {
      path: '/pms',
      component: Layout,
      redirect: '/pms/product',
      name: 'pms',
      meta: {title: '商品', icon: 'product'},
      children: [{
        path: 'product',
        name: 'product',
        component: () => import('@/views/pms/product/index'),
        meta: {title: '商品列表', icon: 'product-list'}
      },
        {
          path: 'addProduct',
          name: 'addProduct',
          component: () => import('@/views/pms/product/add'),
          meta: {title: '添加商品', icon: 'product-add'}
        },
        {
          path: 'updateProduct',
          name: 'updateProduct',
          component: () => import('@/views/pms/product/update'),
          meta: {title: '修改商品', icon: 'product-add'},
          hidden: true
        },
        {
          path: 'productCate',
          name: 'productCate',
          component: () => import('@/views/pms/productCate/index'),
          meta: {title: '商品分类', icon: 'product-cate'}
        },
        {
          path: 'addProductCate',
          name: 'addProductCate',
          component: () => import('@/views/pms/productCate/add'),
          meta: {title: '添加商品分类'},
          hidden: true
        },
        {
          path: 'updateProductCate',
          name: 'updateProductCate',
          component: () => import('@/views/pms/productCate/update'),
          meta: {title: '修改商品分类'},
          hidden: true
        },
        {
          path: 'productAttr',
          name: 'productAttr',
          component: () => import('@/views/pms/productAttr/index'),
          meta: {title: '商品类型', icon: 'product-attr'}
        },
        {
          path: 'productAttrList',
          name: 'productAttrList',
          component: () => import('@/views/pms/productAttr/productAttrList'),
          meta: {title: '商品属性列表'},
          hidden: true
        },
        {
          path: 'addProductAttr',
          name: 'addProductAttr',
          component: () => import('@/views/pms/productAttr/addProductAttr'),
          meta: {title: '添加商品属性'},
          hidden: true
        },
        {
          path: 'updateProductAttr',
          name: 'updateProductAttr',
          component: () => import('@/views/pms/productAttr/updateProductAttr'),
          meta: {title: '修改商品属性'},
          hidden: true
        }
      ]
    },
    {
      path: '/oms',
      component: Layout,
      redirect: '/oms/order',
      name: 'oms',
      meta: {title: '订单', icon: 'order'},
      children: [
        {
          path: 'order',
          name: 'order',
          component: () => import('@/views/oms/order/index'),
          meta: {title: '订单列表', icon: 'product-list'}
        },
        {
          path: 'orderDetail',
          name: 'orderDetail',
          component: () => import('@/views/oms/order/orderDetail'),
          meta: {title: '订单详情'},
          hidden: true
        },
        {
          path: 'deliverOrderList',
          name: 'deliverOrderList',
          component: () => import('@/views/oms/order/deliverOrderList'),
          meta: {title: '发货列表'},
          hidden: true
        },
        {
          path: 'orderSetting',
          name: 'orderSetting',
          component: () => import('@/views/oms/order/setting'),
          meta: {title: '订单设置', icon: 'order-setting'}
        },
        {
          path: 'returnApply',
          name: 'returnApply',
          component: () => import('@/views/oms/apply/index'),
          meta: {title: '退货申请处理', icon: 'order-return'}
        },
        {
          path: 'returnReason',
          name: 'returnReason',
          component: () => import('@/views/oms/apply/reason'),
          meta: {title: '退货原因设置', icon: 'order-return-reason'}
        },
        {
          path: 'returnApplyDetail',
          name: 'returnApplyDetail',
          component: () => import('@/views/oms/apply/applyDetail'),
          meta: {title: '退货原因详情'},
          hidden: true
        }
      ]
    },
    {
      path: '/sms',
      component: Layout,
      redirect: '/sms/coupon',
      name: 'sms',
      meta: {title: '营销', icon: 'sms'},
      children: [
        {
          path: 'coupon',
          name: 'coupon',
          component: () => import('@/views/sms/coupon/index'),
          meta: {title: '优惠券列表', icon: 'sms-coupon'}
        },
        {
          path: 'addCoupon',
          name: 'addCoupon',
          component: () => import('@/views/sms/coupon/add'),
          meta: {title: '添加优惠券'},
          hidden: true
        },
        {
          path: 'updateCoupon',
          name: 'updateCoupon',
          component: () => import('@/views/sms/coupon/update'),
          meta: {title: '修改优惠券'},
          hidden: true
        },
        {
          path: 'couponHistory',
          name: 'couponHistory',
          meta: {title: '优惠券领取详情'},
          component: () => import('@/views/sms/coupon/history'),
          hidden: true
        },
        {
          path: 'new',
          name: 'homeNew',
          component: () => import('@/views/sms/new/index'),
          meta: {title: '新品推荐', icon: 'sms-new'}
        },
        {
          path: 'hot',
          name: 'homeHot',
          component: () => import('@/views/sms/hot/index'),
          meta: {title: '人气推荐', icon: 'sms-hot'}
        }
      ]
    },
    {
      path: '/ums',
      component: Layout,
      redirect: '/ums/admin',
      name: 'ums',
      meta: {title: '权限', icon: 'ums'},
      children: [
        {
          path: 'admin',
          name: 'admin',
          component: () => import('@/views/ums/admin/index'),
          meta: {title: '用户列表', icon: 'ums-admin'}
        }
      ]
    },
    {path: '*', redirect: '/404', hidden: true}
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login'){
    next()
  }
  else{
    if (foowwLocalStorage.get('admin') === null){
      Message({
        type:'warning',
        message:'请先登录'
      });
      router.push('/login');
    }
    else{
      next();
    }
  }
});

export default router;
