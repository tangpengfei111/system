/**
 * 接口type类型 跟 接口路径的映射关系
 * KEY => API_PATHNAME
 * KEY的规则: model的namespace加上model中effects方法的命名,
 * 如: employee/add
 * 举个栗子:
 * 'employee/add': ['basic', '/api.php/index/addemp']
 * 上面的含义为：namespace为employee的model, 在当前model的effects中有个add方法, 此方法调用的接口路径为/api.php/index/addemp
 * 'login/select': ['amap', 'v3/config/district'],   //引用amap的host   具体在config.js中配置
 * 注意: 接口后面写下对应的功能是实现什么的, 然后顺带写上自己的名字
 */

/*
* ★★★★★★★★★★★★★★重要更新说明（2019/07/01）★★★★★★★★★★★★★★
* 有关接口调试的说明
* 重要说明：跑在生产或者测试环境中的项目，if(API[KEY][0] == "yapi") 满足这个条件那就是错了，接口会走yapi的地址。
* 			所以在提交此文件到svn前，把yapi 替换为变量 API_ENTRY_PREFIX
*
* 思考：如果在此项目中，部分接口走pre环境，部分接口走sit环境，部分接口走dev，部分接口走yapi，应该如何实现？
*/

import { API_ENTRY_PREFIX } from '@/utils/config'

const API = {

    /** **** 公共接口 ******/
    'common/login': [API_ENTRY_PREFIX, '/factory/userController/login'], // 登录 tpf
    'common/logout': [API_ENTRY_PREFIX, '/login'], // 退出 tpf

    'common/querySupplierList': [API_ENTRY_PREFIX, '/factory/supplierController/queryAvailableSupplier'], // 可用供应商列表
    'common/queryCustomerList': [API_ENTRY_PREFIX, '/factory/customerController/queryAvailableCustomer'], // 可用客户列表
    'common/queryMaterialList': [API_ENTRY_PREFIX, '/factory/materialController/queryAvailableMaterial'], // 可用原料
    'common/queryDyeAgentList': [API_ENTRY_PREFIX, '/factory/dyeAgentController/queryAvailableDyeAgent'], // 可用染化剂
    'common/queryColorList': [API_ENTRY_PREFIX, '/factory/colorController/queryAvailableColor'], // 可用色号
    'common/queryMachineList': [API_ENTRY_PREFIX, '/factory/machineController/queryAvailableMachine'], // 可用设备
    


    'common/queryMaterialStock': [API_ENTRY_PREFIX, '/factory/materialStockController/getStockByMaterial'], // 查询原料库存
    'common/queryAgentStock': [API_ENTRY_PREFIX, '/factory/agentStockController/getStockByAgent'], // 查询染化剂库存


    /**  用户设置  */
    'user/select': [API_ENTRY_PREFIX, '/factory/userController/pageList'], // 查询所有用户
    'user/add': [API_ENTRY_PREFIX, '/factory/userController/addUser'], // 添加用户(非管理员)
    'user/modify': [API_ENTRY_PREFIX, '/factory/userController/modifyUser'], // 修改用户信息
    'user/remove': [API_ENTRY_PREFIX, '/factory/userController/removeUser'], // 删除用户

    /** 基础数据维护 */

    // 原料管理
    'material/select': [API_ENTRY_PREFIX, '/factory/materialController/pageList'], // 列表查询
    'material/add': [API_ENTRY_PREFIX, '/factory/materialController/addMaterial'], // 添加
    'material/modify': [API_ENTRY_PREFIX, '/factory/materialController/modifyMaterial'], // 修改
    'material/remove': [API_ENTRY_PREFIX, '/factory/materialController/removeMaterial'], // 删除

    // 染化剂管理
    'dyeAgent/select': [API_ENTRY_PREFIX, '/factory/dyeAgentController/pageList'], // 列表查询
    'dyeAgent/add': [API_ENTRY_PREFIX, '/factory/dyeAgentController/addDyeAgent'], // 添加
    'dyeAgent/modify': [API_ENTRY_PREFIX, '/factory/dyeAgentController/modifyDyeAgent'], // 修改
    'dyeAgent/remove': [API_ENTRY_PREFIX, '/factory/dyeAgentController/removeDyeAgent'], // 删除

    // 色号管理
    'color/select': [API_ENTRY_PREFIX, '/factory/colorController/pageList'], // 列表查询
    'color/add': [API_ENTRY_PREFIX, '/factory/colorController/addColor'], // 添加
    'color/modify': [API_ENTRY_PREFIX, '/factory/colorController/modifyColor'], // 修改
    'color/remove': [API_ENTRY_PREFIX, '/factory/colorController/removeColor'], // 删除

    // 设备管理
    'machine/select': [API_ENTRY_PREFIX, '/factory/machineController/pageList'], // 列表查询
    'machine/add': [API_ENTRY_PREFIX, '/factory/machineController/addMachine'], // 添加
    'machine/modify': [API_ENTRY_PREFIX, '/factory/machineController/modifyMachine'], // 修改
    'machine/remove': [API_ENTRY_PREFIX, '/factory/machineController/removeMachine'], // 删除

    // 客户管理
    'customer/select': [API_ENTRY_PREFIX, '/factory/customerController/pageList'], // 列表查询
    'customer/add': [API_ENTRY_PREFIX, '/factory/customerController/addCustomer'], // 添加
    'customer/modify': [API_ENTRY_PREFIX, '/factory/customerController/modifyCustomer'], // 修改
    'customer/remove': [API_ENTRY_PREFIX, '/factory/customerController/removeCustomer'], // 删除

    // 供应商管理
    'supplier/select': [API_ENTRY_PREFIX, '/factory/supplierController/pageList'], // 列表查询
    'supplier/add': [API_ENTRY_PREFIX, '/factory/supplierController/addSupplier'], // 添加
    'supplier/modify': [API_ENTRY_PREFIX, '/factory/supplierController/modifySupplier'], // 修改
    'supplier/remove': [API_ENTRY_PREFIX, '/factory/supplierController/removeSupplier'], // 删除

    /** 生产管理 */

    // 订单管理
    'order/select': [API_ENTRY_PREFIX, '/factory/orderController/queryOrder'], // 列表查询
    'order/add': [API_ENTRY_PREFIX, '/factory/orderController/addOrder'], // 添加
    'order/edit': [API_ENTRY_PREFIX, '/factory/orderController/editOrder'], // 编辑
    'order/changeStatus': [API_ENTRY_PREFIX, '/factory/orderController/changeStatus'], // 修改状态

    // 生产计划
    'productplan/select': [API_ENTRY_PREFIX, '/factory/productionController/queryProdByOrder'], // 列表查询
    'productplan/add': [API_ENTRY_PREFIX, '/factory/productionController/addProduction'], // 添加计划
    'productplan/edit': [API_ENTRY_PREFIX, '/factory/productionController/editProduction'], // 编辑计划
    'productplan/print': [API_ENTRY_PREFIX, '/factory/productionController/export'], // 打印计划
    'productplan/fillQuality': [API_ENTRY_PREFIX, '/factory/productionController/fillQuality'], // 填写合格品
    'productplan/select': [API_ENTRY_PREFIX, '/factory/orderController/getOrderById'], // 查询订单详情


    /** 库存管理 */
    // 染化剂库存
    'agentStock/select': [API_ENTRY_PREFIX, '/factory/agentStockController/queryByCondition'], // 列表查询
    'agentStock/modifystock': [API_ENTRY_PREFIX, '/factory/agentStockLogController/addAgentStockLog'], // 添加库存
    'agentStock/log': [API_ENTRY_PREFIX, '/factory/agentStockLogController/queryLogsByName'], // 染化剂库存日志

    // 原料库存
    'materialStock/select': [API_ENTRY_PREFIX, '/factory/materialStockController/queryByCondition'], // 列表查询
    'materialStock/modifystock': [API_ENTRY_PREFIX, '/factory/materialStockLogController/addMaterialStockLog'], // 添加库存
    'materialStock/log': [API_ENTRY_PREFIX, '/factory/materialStockLogController/queryLogsByName'], // 原料库存日志


    /** 报表管理 */
    'productRecord/select': [API_ENTRY_PREFIX, '/factory/reportController/dailyProduction'], // 生产记录列表查询
    'orderRecord/select': [API_ENTRY_PREFIX, '/factory/orderController/queryOrder'], // 订单记录列表查询

}
export default API
