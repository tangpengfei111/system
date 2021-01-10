import React from 'react'
import { Redirect } from 'umi'
import { stringify } from 'querystring'
import { getCache } from '@/utils/common'



export default function SecurityLayout(props) {
  const { children } = props

  const isLogin = getCache('authority')
  const queryString = stringify({
    redirect: window.location.href,
  });




  if (!isLogin && window.location.pathname !== '/login') {
    return <Redirect to={`/login?${queryString}`} />;
  }

  return children;
}