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
                  }
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
