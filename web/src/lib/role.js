var role = {
    define: {
        superAdmin: [
            'color','customer','dyeAgent','machine','material','supplier',  // 基础数据维护
            'dayproduction','yieldrate','stocklist','stockdetails',         // 报表管理
            'production', 'proplan',                                        // 生产管理
            'dyestock','materialstock','stocklog',                          // 库存管理
            'user'
        ],
        // generalAdmin: [
        //     'color','customer','dyeAgent','machine','material','supplier',
        //     'dayproduction','yieldrate','stocklist','stockdetails',
        //     'production',
        //     'stock'
        // ],
        prodUser: [
            'color','customer','dyeAgent','machine','material','supplier',
            'dayproduction','yieldrate','stocklist','stockdetails',
            'production', 'proplan'
        ],
        stockUser: [
            'color','customer','dyeAgent','machine','material','supplier',
            'dayproduction','yieldrate','stocklist','stockdetails',
            'dyestock','materialstock','stocklog',
        ],
    },
    options: [
        { label: '管理员', value: 'superAdmin', ype: 0 },
        { label: '生产用户', value: 'prodUser', type: 1 },
        { label: '库存用户', value: 'stockUser', type: 1 },
    ]
}

export default role;