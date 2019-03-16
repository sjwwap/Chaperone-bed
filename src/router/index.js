import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Agreement from '@/components/agreement'
import UsePro from '@/components/UsePro'
import ReturnPro from '@/components/ReturnPro'
import Project from '@/components/Project'
import Order from '@/components/Order'
import OrderDetails from '@/components/OrderDetails'
import Mine from '@/components/Mine'
import Truename from '@/components/Truename'
import TruenameSuccess from '@/components/TruenameSuccess'
import MineCollection from '@/components/MineCollection'
import MineInvitationCode from '@/components/MineInvitationCode'
import MineConsumeRecord from '@/components/MineConsumeRecord'
import MineConsumeDetails from '@/components/MineConsumeDetails'
import CooperationJoinIn from '@/components/CooperationJoinIn'
import CooperationJoinInFrom from '@/components/CooperationJoinInFrom'
import CooperationState from '@/components/CooperationState'
import Mapview from '@/components/Mapview'
import MineBadge from '@/components/MineBadge'



Vue.use(Router)
export default new Router({
  linkExactActiveClass: 'active',
  routes: [
    // =================主页====================
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: '金钯子科技',
        requireAuth: true,
        index: 0
      }
    },
    {
      path: '/agreement',
      name: 'Agreement',
      component: Agreement,
      meta: {
        title: '金钯子共享产品协议与隐私策略',
        requireAuth: true,
        index: 4
      }
    },
    {
      path: '/UsePro',
      name: 'UsePro',
      component: UsePro,
      meta: {
        title: '开始使用',
        requireAuth: true,
        index: 1
      }
    },
    {
      path: '/ReturnPro',
      name: 'ReturnPro',
      component: ReturnPro,
      meta: {
        title: '结束使用',
        requireAuth: true,
        index: 2
      }
    },
    // =================产品====================
    {
      path: '/Project',
      name: 'Project',
      component: Project,
      meta: {
        title: '共享产品',
        requireAuth: true,
        index: 0
      }
    },
    {
      path: '/Mapview',
      name: 'Mapview',
      component: Mapview,
      meta: {
        title: '共享陪护床',
        requireAuth: true,
        index: 1
      }
    },
    // =================订单====================
    {
      path: '/Order',
      name: 'Order',
      component: Order,
      meta: {
        title: '我的订单',
        requireAuth: true,
        index: 0
      }
    },
    {
      path: '/OrderDetails',
      name: 'OrderDetails',
      component: OrderDetails,
      meta: {
        title: '订单详情',
        requireAuth: true,
        index: 1
      }
    },
    // =================我的====================
    {
      path: '/Mine',
      name: 'Mine',
      component: Mine,
      meta: {
        title: '个人中心',
        requireAuth: true,
        index: 0
      }
    },
    {
      path: '/Truename',
      name: 'Truename',
      component: Truename,
      meta: {
        title: '实名认证',
        requireAuth: true,
        index: 3
      }
    },
    {
      path: '/TruenameSuccess',
      name: 'TruenameSuccess',
      component: TruenameSuccess,
      meta: {
        title: '实名认证成功',
        requireAuth: true,
        index: 4
      }
    },
    {
      path: '/MineCollection',
      name: 'MineCollection',
      component: MineCollection,
      meta: {
        title: '我的收藏',
        requireAuth: true,
        index: 2
      }
    },
    {
      path: '/MineInvitationCode',
      name: 'MineInvitationCode',
      component: MineInvitationCode,
      meta: {
        title: '我的邀请码',
        requireAuth: true,
        index: 2
      }
    },
    {
      path: '/MineConsumeRecord',
      name: 'MineConsumeRecord',
      component: MineConsumeRecord,
      meta: {
        title: '我的消费记录',
        requireAuth: true,
        index: 2
      }
    },
    {
      path: '/MineConsumeDetails',
      name: 'MineConsumeDetails',
      component: MineConsumeDetails,
      meta: {
        title: '我的消费详情',
        requireAuth: true,
        index: 3
      }
    },

    {
      path: '/CooperationJoinIn',
      name: 'CooperationJoinIn',
      component: CooperationJoinIn,
      meta: {
        title: '合作加盟',
        requireAuth: true,
        index: 2
      }
    },
    {
      path: '/CooperationJoinInFrom',
      name: 'CooperationJoinInFrom',
      component: CooperationJoinInFrom,
      meta: {
        title: '合作加盟',
        requireAuth: true,
        index: 4
      }
    },
    {
      path: '/CooperationState',
      name: 'CooperationState',
      component: CooperationState,
      meta: {
        title: '合作加盟',
        requireAuth: true,
        index: 4
      }
    },
    {
      path: '/MineBadge',
      name: 'MineBadge',
      component: MineBadge,
      meta: {
        title: '我的徽章',
        requireAuth: true,
        index: 4
      }
    },
    
  ]
})
