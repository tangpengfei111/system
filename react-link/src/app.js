/*
 * PageName: 页面名称
 * Branch: 0
 * Autor: 唐鹏飞
 * Description: 
 */
export const dva = {
    // 解决dva报错 页面异常的情况
    config: {
        onError(e) {
            e.preventDefault();
            console.error('error:', e.message);
        },
    },
};