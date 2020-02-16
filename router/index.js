const router = require('koa-router')();
const axios = require('axios')
const { githubClientID, githubClientSecret, TokenURL, githubAPIURL } = require('../config/oauth')
const maxAge = 1000*60*60*24*7;
const cookieOptions = {
  domain: 'localhost',
  path: '/',
  maxAge,
  expires: new Date(Date.now() + maxAge),
  httpOnly: false
}
router.get('/response', async (ctx, next) => {
  
  let { code } = ctx.query;
  const data = await axios({
    method: 'get',
    url: TokenURL,
    params: {
      'client_id': githubClientID,
      'client_secret': githubClientSecret,
      code
    },
    // 设置请求头，否则会返回字符串
    headers: {
      Accept: 'application/json'
    }
  })
  let { access_token } = data.data;

  if (access_token) {
    const userInfo = await axios({
      method: 'get',
      url: githubAPIURL,
      headers: {
        Authorization: `token ${access_token}`
      }
    })
    // 设置cookie 
    ctx.cookies.set('usr', userInfo.data.login, cookieOptions)
    ctx.cookies.set('avatar_url', userInfo.data.avatar_url, cookieOptions)
    ctx.cookies.set('logged_in', true, {...cookieOptions, httpOnly: true})

    return ctx.response.redirect('http://localhost:8080')
    
  }
  ctx.body = {
    message: '认证环节出错',
    ownStatus: 1001
  }
 
})

module.exports = router;