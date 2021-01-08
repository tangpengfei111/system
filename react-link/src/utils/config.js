const API_NAT_HOST = {
    // basic: window.location.protocol + "//" + window.location.host + '/',
    basic: 'http://36.148.11.166:8888/' // 云端
}

const CONFIG = {
    API_HOST: window.location.host,
    // ROOT_URL: PROTOCOL + "//" + API_HOST,
    ROOT_URL: window.location.protocol + "//" + window.location.host,
    PAGE_NO: 1,
    PAGE_SIZE: 20,
    ApiNatToHost: (natKey = 'basic') => {
        return API_NAT_HOST[natKey]
    },
}

export { API_NAT_HOST }
export const API_ENTRY_PREFIX = 'basic'
export default CONFIG
