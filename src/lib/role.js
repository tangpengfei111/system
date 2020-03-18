var role = {
    define: {
        superAdmin: [
            'color','customer','dyeAgent','machine','material','supplier',  // 基础数据维护
            'dayproduction','yieldrate','stocklist','stockdetails',         // 报表管理
            'production',
            'stock',
            'user'
        ],
        generalAdmin: [
            'color','customer','dyeAgent','machine','material','supplier',
            'dayproduction','yieldrate','stocklist','stockdetails',
            'production',
            'stock'
        ],
        prodUser: [
            'color','customer','dyeAgent','machine','material','supplier',
            'dayproduction','yieldrate','stocklist','stockdetails',
            'production',
        ],
        stockUser: [
            'color','customer','dyeAgent','machine','material','supplier',
            'dayproduction','yieldrate','stocklist','stockdetails',
            'stock',
        ],
    },
    options: [
        { label: '普通管理员', value: 'generalAdmin' },
        { label: '生产管理用户', value: 'prodUser' },
        { label: '库存管理用户', value: 'stockUser' },
    ]
}

export default role;