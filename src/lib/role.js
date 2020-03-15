var role = {
    define: {
        superAdmin: [
            'color',
            'customer',
            'dyeAgent',
            'machine',
            'material',
            'supplier',
            'production',
            'report',
            'stock',
            'user'
        ],
        generalAdmin: [
            'color',
            'customer',
            'dyeAgent',
            'machine',
            'material',
            'supplier',
            'production',
            'report',
            'stock'
        ],
        prodUser: [
            'color',
            'customer',
            'dyeAgent',
            'machine',
            'material',
            'supplier',
            'production',
            'report'
        ],
        stockUser: [
            'color',
            'customer',
            'dyeAgent',
            'machine',
            'material',
            'supplier',
            'stock',
            'report'
        ],
    },
    options: [
        { label: '普通管理员', value: 'generalAdmin' },
        { label: '生产管理用户', value: 'prodUser' },
        { label: '库存管理用户', value: 'stockUser' },
    ]
}

export default role;