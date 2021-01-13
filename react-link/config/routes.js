export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        name: 'login',
        path: '/login',
        component: './login',
      },
      {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            component: '../layouts/BasicLayout',
            // authority: ['admin', 'user'],
            routes: [
              {
                path: '/basicdata',
                name: '基础数据维护',
                routes: [
                  {
                    name: '原料管理',
                    path: '/basicdata/material',
                    component: './basicdata/material'
                  },
                  {
                    name: '染化剂管理',
                    path: '/basicdata/dyeAgent',
                    component: './basicdata/dyeAgent'
                  },
                  {
                    name: '色号管理',
                    path: '/basicdata/color',
                    component: './basicdata/color'
                  },
                  {
                    name: '设备管理',
                    path: '/basicdata/machine',
                    component: './basicdata/machine'
                  },
                  {
                    name: '客户管理',
                    path: '/basicdata/customer',
                    component: './basicdata/customer'
                  },
                  {
                    name: '供应商管理',
                    path: '/basicdata/supplier',
                    component: './basicdata/supplier'
                  },
                  {
                    component: './404',
                  },
                ]
              },
              {
                path: '/stock',
                name: '库存管理',
                routes: [
                  {
                    name: '染化剂库存',
                    path: '/stock/dyeAgent',
                    component: './stock/dyeAgent'
                  },
                  {
                    name: '原料库存',
                    path: '/stock/material',
                    component: './stock/material'
                  },
                  {
                    component: './404',
                  },
                ]
              },
              {
                path: '/report',
                name: '报表管理',
                routes: [
                  {
                    name: '设备生产记录',
                    path: '/report/productionRecords',
                    component: './report/productionRecords'
                  },
                  {
                    name: '订单详情记录',
                    path: '/report/orderRecords',
                    component: './report/orderRecords'
                  },
                  {
                    component: './404',
                  },
                ]
              },
              {
                name: 'list.table-list',
                icon: 'table',
                path: '/list',
                component: './ListTableList',
              },
              {
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
