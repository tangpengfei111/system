/*
 * PageName: 滚动函数
 * Branch: 0
 * Autor: 唐鹏飞
 * Description: 
 */


export function bodyScroll(event){  
    event.preventDefault();  
}
 
var top1 = 0

export function stopBodyScroll(isFixed) {
	var bodyEl = document.body
	if (isFixed) {
		top1 = window.scrollY
		bodyEl.style.position = 'fixed'
		bodyEl.style.top = -top1 + 'px'
	}else{
		bodyEl.style.position = ''
		bodyEl.style.top = ''
		window.scrollTo(0, top1) // 回到原先的top
	}
}