export const issuesRoutes = [
  {
    path: '/issues/701',
    name: '#701: primitive :object',
    component: () => import('../../pages/issues/701/index.vue'),
  },
  {
    path: '/issues/701-cientos-v4',
    name: '#701: <primitive> in Cientos v4',
    component: () => import('../../pages/issues/701-cientos-v4/index.vue'),
  },
  {
    path: '/events/711-fps-drops-repro',
    name: '#711: FPS Drops Reproduction (events)',
    component: () => import('../../pages/issues/711/index.vue'),
  },
  {
    path: '/issues/717vIf',
    name: '#717: v-if',
    component: () => import('../../pages/issues/717/index.vue'),
  },
  {
    path: '/issues/749-attach-detach',
    name: '#749: attach-detach',
    component: () => import('../../pages/issues/749/index.vue'),
  },
  {
    path: '/issues/796',
    name: '#796: unmounted',
    component: () => import('../../pages/issues/796/index.vue'),
  },

]
