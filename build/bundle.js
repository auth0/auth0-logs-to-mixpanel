module.exports=function(e){function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}var t={};return n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=22)}([function(e,n){e.exports=require("auth0-extension-tools@1.2.1")},function(e,n){e.exports=require("auth0-extension-express-tools@1.0.1")},function(e,n,t){"use strict";e.exports=t(0).config()},function(e,n,t){"use strict";var o=t(33);o.emitErrs=!0;var i=new o.Logger({transports:[new o.transports.Console({timestamp:!0,level:"debug",handleExceptions:!0,json:!1,colorize:!0})],exitOnError:!1});e.exports=i,e.exports.stream={write:function(e){i.info(e.replace(/\n$/,""))}}},function(e,n){e.exports=require("express@4.12.4")},function(e,n,t){function o(e){if(null===e||void 0===e)throw new c.ArgumentError("Must provide an options object");if(null===e.domain||void 0===e.domain)throw new c.ArgumentError("Must provide a valid domain");if("string"!=typeof e.domain||0===e.domain.length)throw new c.ArgumentError("The provided domain is invalid: "+e.domain);if(null===e.clientId||void 0===e.clientId)throw new c.ArgumentError("Must provide a valid clientId");if("string"!=typeof e.clientId||0===e.clientId.length)throw new c.ArgumentError("The provided clientId is invalid: "+e.clientId);if(null===e.clientSecret||void 0===e.clientSecret)throw new c.ArgumentError("Must provide a valid clientSecret");if("string"!=typeof e.clientSecret||0===e.clientSecret.length)throw new c.ArgumentError("The provided clientSecret is invalid: "+e.clientSecret);this.options=e,this.tokenCache=e.tokenCache||{getToken:function(){return i.resolve()},setToken:function(){return i.resolve()}}}const i=t(8),r=t(11),s=t(29),c=t(0);o.prototype.getAccessToken=function(){var e=this;return new i(function(n,t){r.post("https://"+e.options.domain+"/oauth/token").send({audience:"https://"+e.options.domain+"/api/v2/",client_id:e.options.clientId,client_secret:e.options.clientSecret,grant_type:"client_credentials"}).set("Accept","application/json").end(function(o,i){if(o&&401===o.status)return t(new c.ManagementApiError("unauthorized","Invalid credentials for "+e.options.clientId,o.status));if(o&&i&&i.body&&i.body.error)return t(new c.ManagementApiError(i.body.error,i.body.error_description||i.body.error,o.status));if(o)return t(o);if(!i.ok||!i.body.access_token)return t(new c.ManagementApiError("unknown_error","Unknown error from Management API or no access_token was provided: "+(i.text||i.status)));const r=new Date;return n({token:i.body.access_token,expiresAt:r.setSeconds(r.getSeconds()+i.body.expires_in)})})})},o.prototype.getAccessTokenCached=function(){var e=this;return e.tokenCache.getToken().then(function(n){if(n&&n.token){const t=(new Date).valueOf();if(n.expiresAt-t>1e4)return n}return e.getAccessToken(e.options).then(function(n){return e.tokenCache.setToken(n).then(function(){return n})})})},o.prototype.getLogs=function(e){const n=this;return new i(function(t,o){n.getAccessTokenCached(n.options,n.storage).then(function(i){const a=s.stringify(e);r.get("https://"+n.options.domain+"/api/v2/logs?"+a).set("Authorization","Bearer "+i.token).set("Content-Type","application/json").end(function(e,n){return e&&n&&n.body&&n.body.error?o(new c.ManagementApiError(n.body.error,n.body.error_description||n.body.error,e.status)):e?o(e):n.ok?t({logs:n.body,limits:{limit:n.headers["x-ratelimit-limit"],remaining:n.headers["x-ratelimit-remaining"],reset:n.headers["x-ratelimit-reset"]}}):o(new c.ManagementApiError("unknown_error","Unknown error from Management API: "+(n.text||n.status)))})})})},e.exports=o},function(e,n){const t={s:{name:"Success Login",icon:"icon-budicon-448",level:1},ssa:{name:"Success Silent Auth",icon:"icon-budicon-448",level:1},fsa:{name:"Failed Silent Auth",icon:"icon-budicon-448",level:3},seacft:{name:"Success Exchange",description:"Authorization Code for Access Token",icon:"icon-budicon-456",level:1},feacft:{name:"Failed Exchange",description:"Authorization Code for Access Token",icon:"icon-budicon-456",level:3},seccft:{name:"Success Exchange",description:"Client Credentials for Access Token",icon:"icon-budicon-456",level:1},feccft:{name:"Failed Exchange",description:"Client Credentials for Access Token",icon:"icon-budicon-456",level:3},sepft:{name:"Success Exchange",description:"Password for Access Token",icon:"icon-budicon-456",level:1},fepft:{name:"Failed Exchange",description:"Password for Access Token",icon:"icon-budicon-456",level:3},sertft:{name:"Success Exchange",description:"Refresh Token for Access Token",icon:"icon-budicon-456",level:1},fertft:{name:"Failed Exchange",description:"Refresh Token for Access Token",icon:"icon-budicon-456",level:3},seoobft:{name:"Success Exchange",description:"Password and OOB Challenge for Access Token",icon:"icon-budicon-456",level:1},feoobft:{name:"Failed Exchange",description:"Password and OOB Challenge for Access Token",icon:"icon-budicon-456",level:3},seotpft:{name:"Success Exchange",description:"Password and OTP Challenge for Access Token",icon:"icon-budicon-456",level:1},feotpft:{name:"Failed Exchange",description:"Password and OTP Challenge for Access Token",icon:"icon-budicon-456",level:3},sercft:{name:"Success Exchange",description:"Password and MFA Recovery code for Access Token",icon:"icon-budicon-456",level:1},fercft:{name:"Failed Exchange",description:"Password and MFA Recovery code for Access Token",icon:"icon-budicon-456",level:3},f:{name:"Failed Login",icon:"icon-budicon-448",level:3},w:{name:"Warning",icon:"icon-budicon-354",level:2},du:{name:"Deleted User",icon:"icon-budicon-311",level:3},fu:{name:"Failed Login (invalid email/username)",icon:"icon-budicon-311",level:3},fp:{name:"Failed Login (wrong password)",icon:"icon-budicon-311",level:3},fc:{name:"Failed by Connector",icon:"icon-budicon-313",level:3},fco:{name:"Failed by CORS",icon:"icon-budicon-313",level:3},con:{name:"Connector Online",icon:"icon-budicon-143",level:1},coff:{name:"Connector Offline",icon:"icon-budicon-143",level:3},fcpro:{name:"Failed Connector Provisioning",icon:"icon-budicon-143",level:4},ss:{name:"Success Signup",icon:"icon-budicon-314",level:1},fs:{name:"Failed Signup",icon:"icon-budicon-311",level:3},cs:{name:"Code Sent",icon:"icon-budicon-243",level:1},cls:{name:"Code/Link Sent",icon:"icon-budicon-781",level:1},sv:{name:"Success Verification Email",icon:"icon-budicon-781",level:1},fv:{name:"Failed Verification Email",icon:"icon-budicon-311",level:3},scp:{name:"Success Change Password",icon:"icon-budicon-280",level:1},fcp:{name:"Failed Change Password",icon:"icon-budicon-266",level:3},sce:{name:"Success Change Email",icon:"icon-budicon-266",level:1},fce:{name:"Failed Change Email",icon:"icon-budicon-266",level:3},scu:{name:"Success Change Username",icon:"icon-budicon-266",level:1},fcu:{name:"Failed Change Username",icon:"icon-budicon-266",level:3},scpn:{name:"Success Change Phone Number",icon:"icon-budicon-266",level:1},fcpn:{name:"Failed Change Phone Number",icon:"icon-budicon-266",level:3},svr:{name:"Success Verification Email Request",icon:"icon-budicon-781",level:0},fvr:{name:"Failed Verification Email Request",icon:"icon-budicon-311",level:3},scpr:{name:"Success Change Password Request",icon:"icon-budicon-280",level:1},fcpr:{name:"Failed Change Password Request",icon:"icon-budicon-311",level:3},fn:{name:"Failed Sending Notification",icon:"icon-budicon-782",level:3},sapi:{name:"API Operation",icon:"icon-budicon-546",level:1},fapi:{name:"Failed API Operation",icon:"icon-budicon-546",level:3},limit_wc:{name:"Blocked Account",icon:"icon-budicon-313",level:4},limit_mu:{name:"Blocked IP Address",icon:"icon-budicon-313",level:4},limit_ui:{name:"Too Many Calls to /userinfo",icon:"icon-budicon-313",level:4},api_limit:{name:"Rate Limit On API",icon:"icon-budicon-313",level:4},limit_delegation:{name:"Too Many Calls to /delegation",icon:"icon-budicon-313",level:4},sdu:{name:"Successful User Deletion",icon:"icon-budicon-312",level:1},fdu:{name:"Failed User Deletion",icon:"icon-budicon-311",level:3},slo:{name:"Success Logout",icon:"icon-budicon-449",level:1},flo:{name:"Failed Logout",icon:"icon-budicon-449",level:3},sd:{name:"Success Delegation",icon:"icon-budicon-456",level:1},fd:{name:"Failed Delegation",icon:"icon-budicon-456",level:3},gd_unenroll:{name:"Unenroll device account",icon:"icon-budicon-298",level:1},gd_update_device_account:{name:"Update device account",icon:"icon-budicon-257",level:1},gd_module_switch:{name:"Module switch",icon:"icon-budicon-329",level:1},gd_tenant_update:{name:"Guardian tenant update",icon:"icon-budicon-170",level:1},gd_start_auth:{name:"Second factor started",icon:"icon-budicon-285",level:1},gd_start_enroll:{name:"Enroll started",icon:"icon-budicon-299",level:1},gd_user_delete:{name:"User delete",icon:"icon-budicon-298",level:1},gd_auth_succeed:{name:"OTP Auth suceed",icon:"icon-budicon-mfa-login-succeed",level:1},gd_auth_failed:{name:"OTP Auth failed",icon:"icon-budicon-mfa-login-failed",level:3},gd_send_pn:{name:"Push notification sent",icon:"icon-budicon-mfa-send-pn",level:1},gd_auth_rejected:{name:"OTP Auth rejected",icon:"icon-budicon-mfa-login-failed",level:3},gd_recovery_succeed:{name:"Recovery succeed",icon:"icon-budicon-mfa-recovery-succeed",level:1},gd_recovery_failed:{name:"Recovery failed",icon:"icon-budicon-mfa-recovery-failed",level:3},gd_send_sms:{name:"SMS Sent",icon:"icon-budicon-799",level:1},gd_otp_rate_limit_exceed:{name:"Too many failures",icon:"icon-budicon-435",level:2},gd_recovery_rate_limit_exceed:{name:"Too many failures",icon:"icon-budicon-435",level:2},fui:{name:"Users import",icon:"icon-budicon-299",level:2},sui:{name:"Users import",icon:"icon-budicon-299",level:1},pwd_leak:{name:"Breached password",icon:"icon-budicon-313",level:3}};e.exports=t,e.exports.get=function(e){return t[e]&&t[e].name||"Unknown Log Type: "+e}},function(e,n,t){function o(e){if(null===e||void 0===e)throw new s.ArgumentError("Must provide an options object");r.call(this,{objectMode:!0}),this.client=new c(e),this.options=e,this.remaining=50,this.lastBatch=0,this.previousCheckpoint=e.checkpointId||null,this.lastCheckpoint=e.checkpointId||null,this.status={start:new Date,end:null,logsProcessed:0}}const i=t(32),r=t(30).Readable,s=t(0),c=t(5);i.inherits(o,r),o.prototype.getQuery=function(e){return e&&e.length?"type:"+e.join(" OR type:"):""},o.prototype.done=function(){this.status.end=new Date,this.push(null)},o.prototype.next=function(e){const n=this;if(n.remaining<1)return n.status.warning="Auth0 Management API rate limit reached.",n.done();const t=n.lastCheckpoint?{take:e||100,from:n.lastCheckpoint}:{per_page:e||100,page:0};return t.q=n.getQuery(n.options.types),t.sort="date:1",n.client.getLogs(t).then(function(e){const t=e.logs;n.remaining=e.limits.remaining,t&&t.length?(n.lastCheckpoint=t[t.length-1]._id,n.lastBatch+=t.length,n.push(e)):(n.status.end=new Date,n.push(null))}).catch(function(e){n.emit("error",e)})},o.prototype.batchSaved=function(){this.status.logsProcessed+=this.lastBatch,this.previousCheckpoint=this.lastCheckpoint,this.lastBatch=0},o.prototype._read=function(){},e.exports=o},function(e,n){e.exports=require("bluebird@3.4.6")},function(e,n){e.exports=require("lodash@3.10.1")},function(e,n){e.exports=require("path")},function(e,n){e.exports=require("superagent@1.2.0")},function(e,n,t){"use strict";(function(n){var o=(t(31),t(10)),i=t(28),r=t(4),s=t(24),c=t(0),a=t(1),l=t(20),u=t(21),d=t(18),p=t(3),f=t(2),h=t(17);e.exports=function(e,t){f.setProvider(e);var m=t?new c.WebtaskStorageContext(t,{force:1}):new c.FileStorageContext(o.join(n,"./data.json"),{mergeWrites:!0}),g=new r;return g.use(i(":method :url :status :response-time ms - :res[content-length]",{stream:p.stream})),g.use(h(m)),g.use(s.json()),g.use(s.urlencoded({extended:!1})),g.use(a.routes.dashboardAdmins({secret:f("EXTENSION_SECRET"),audience:"urn:logs-to-mixpanel",rta:f("AUTH0_RTA").replace("https://",""),domain:f("AUTH0_DOMAIN"),baseUrl:f("PUBLIC_WT_URL")||f("WT_URL"),clientName:"Logs to Mixpanel",urlPrefix:"",sessionStorageKey:"logs-to-mixpanel:apiToken",scopes:"read:logs"})),g.use("/meta",u()),g.use("/.extensions",d()),g.use("/app",r.static(o.join(n,"../dist"))),g.use("/",l(m)),g.use(a.middlewares.errorHandler(p.error.bind(p))),g}}).call(n,"/")},function(e,n,t){const o=t(15);e.exports.LogsProcessor=t(14),e.exports.LogsApiClient=t(5),e.exports.LogsApiStream=t(7),e.exports.logTypes=t(6),e.exports.reporters={SlackReporter:o}},function(e,n,t){function o(e,n){if(null===n||void 0===n)throw new r.ArgumentError("Must provide an options object");this.storage=new a(e),this.options=i.assign({},{batchSize:100,maxRetries:5,maxRunTimeSeconds:20},n)}const i=t(9),r=t(0),s=t(6),c=t(7),a=t(16);o.prototype.hasTimeLeft=function(e){const n=(new Date).getTime();return e+1e3*this.options.maxRunTimeSeconds>=n},o.prototype.getLogFilter=function(e){var n=e.logTypes||[];return e.logLevel&&(n=n.concat(i.keys(i.filter(s,function(n){return n.level>=e.logLevel})))),i.uniq(n)},o.prototype.createStream=function(e){const n=this;return n.storage.getCheckpoint(e.startFrom).then(function(t){return new c({checkpointId:t,types:n.getLogFilter(e),domain:e.domain,clientId:e.clientId,clientSecret:e.clientSecret,tokenCache:n.storage})})},o.prototype.run=function(e){const n=this;return new Promise(function(t,o){const i=(new Date).getTime();var r=0,s=0,c=[];const a=n.storage,l=n.options.batchSize,u=n.options.maxRetries,d=function(e,n,i){n.error=e,a.done(n,i).then(function(){return t({status:n,checkpoint:i})}).catch(o)},p=function(e,n){if(e.logsProcessed>0){return(new Date).getTime()-s>=6048e5&&(e.warning="Logs are outdated more than for week. Last processed log has date is "+new Date(s)),a.done(e,n).then(function(){return t({status:e,checkpoint:n})}).catch(o)}return t({status:e,checkpoint:n})},f=function(){var e=l;return e-=c.length,e>100&&(e=100),e},h=function(t,o,s){if(!n.hasTimeLeft(i))return d(t,o.status,o.previousCheckpoint);if(r<u)return r+=1,e(c,s);const a=["Skipping logs from "+o.previousCheckpoint+" to "+o.lastCheckpoint+" after "+u+" retries.",t];return d(a,o.status,o.lastCheckpoint)};n.createStream(n.options).then(function(t){t.next(f()),t.on("data",function(o){const r=o.logs;if(c=c.concat(r),r&&r.length&&(s=new Date(r[r.length-1].date).getTime()),c.length<l)return t.next(f());const a=function(e){return e?h(e,t,a):(c=[],n.hasTimeLeft(i)?(t.batchSaved(),t.next(f())):t.done())};return e(c,a)}),t.on("end",function(){const n=function(e){return e?h(e,t,n):(t.batchSaved(),p(t.status,t.lastCheckpoint))};e(c,n)}),t.on("error",function(e){d(e,t.status,t.previousCheckpoint)})}).catch(o)})},e.exports=o},function(e,n,t){function o(e){this.options=e||{}}const i=t(8),r=t(11);o.prototype.send=function(e,n){if(!e||"object"!=typeof e)throw new Error("object status is required");const t=this.options,o=this.createMessage(this.options,e,n);return new i(function(e,n){return t.hook?r.post(t.hook).send(o).set("Accept","application/json").end(function(t){return t?n(t):e()}):e()})},o.prototype.createMessage=function(e,n,t){const o={username:e.username||"auth0-logger",icon_emoji:e.icon||":rocket:",attachments:[]},i=e.title||"Auth0 Logger",r=n.error?i+" Error":i+" Success",s=n.error?n.error.message||n.error[0]||"Error occurred":null,c={fallback:e.fallback||r,text:e.text||r,fields:[{title:"Start time",value:n.start,short:!0},{title:"End time",value:n.end,short:!0},{title:"Logs processed",value:n.logsProcessed,short:!0},{title:"Last checkpoint",value:t,short:!0}],error_field:{title:"Error",value:s,short:!1}},a=e.url?" (<"+e.url+"|Details>)":null,l=c.fields;return n.error&&l.push(c.error_field),o.attachments.push({color:"#7CD197",fallback:c.fallback,text:c.fallback+(a||""),fields:l}),o},e.exports=o},function(e,n,t){function o(e,n){if(!e)throw new r("The storageContext is required");this.storageContext=e,this.options=i({},{limit:400},n)}const i=t(9).assign,r=t(0).ArgumentError;o.prototype.read=function(){return this.storageContext.read().then(function(e){const n=e||{};return n.logs=n.logs||[],n})},o.prototype.write=function(e){return this.storageContext.write(e)},o.prototype.getCheckpoint=function(e){const n=this;return n.read().then(function(t){return e&&e!==t.startFrom?(t.startFrom=e,t.checkpointId=e,n.write(t).then(function(){return t.checkpointId||e||null})):t.checkpointId})},o.prototype.getToken=function(){return this.read().then(function(e){return e.logs_access_token||null})},o.prototype.setToken=function(e){const n=this;return n.read().then(function(t){return t.logs_access_token=e,n.write(t)})},o.prototype.done=function(e,n){const t=this;return t.read().then(function(o){return Buffer.byteLength(JSON.stringify(o),"utf8")>=1024*t.options.limit&&o.logs&&o.logs.length&&o.logs.splice(0,5),e.checkpoint=n,o.logs.push(e),o.checkpointId=n,t.write(o)})},e.exports=o},function(e,n,t){"use strict";var o=t(27),i=t(13),r=t(2),s=t(3);e.exports=function(e){return function(n,t,c){var a=n.webtaskContext&&n.webtaskContext.body||n.body||{};if(!a.schedule||"active"!==a.state)return c();var l=function(e){return e.map(function(e){return{name:e.name,message:e.message,stack:e.stack}})},u=o.init(r("MIXPANEL_TOKEN"),{key:r("MIXPANEL_KEY")}),d=function e(n,t){n&&n.length||t(),u.import_batch(n,function(o){if(o&&o.length>0){if(n.length>10){var i=n.splice(0,10);return u.import_batch(i,function(o){return o&&o.length>0?(s.error(o),t(l(o))):(s.info(i.length+" events successfully sent to mixpanel."),e(n,t))})}return s.error(o),t(l(o))}return s.info(n.length+" events successfully sent to mixpanel."),t()})},p=function(e,n){if(!e||!e.length)return n();var t=Date.now(),o=e.map(function(e){var n=i.getLogType(e.type);return e.time=t,e.distinct_id=e.user_id||e.user_name||e.client_id||e._id,{event:n,properties:e}});d(o,n)},f=new i.reporters.SlackReporter({hook:r("SLACK_INCOMING_WEBHOOK_URL"),username:"auth0-logs-to-mixpanel",title:"Logs To Mixpanel"}),h={domain:r("AUTH0_DOMAIN"),clientId:r("AUTH0_CLIENT_ID"),clientSecret:r("AUTH0_CLIENT_SECRET"),batchSize:r("BATCH_SIZE"),startFrom:r("START_FROM"),logTypes:r("LOG_TYPES"),logLevel:r("LOG_LEVEL")};return new i.LogsProcessor(e,h).run(p).then(function(e){f.send(e.status,e.checkpoint),t.json(e)}).catch(function(e){f.send({error:e,logsProcessed:0},null),c(e)})}}},function(e,n,t){"use strict";var o=t(4).Router,i=t(1).middlewares,r=t(2),s=t(3);e.exports=function(){var e=o(),n=i.validateHookToken(r("AUTH0_DOMAIN"),r("WT_URL"),r("EXTENSION_SECRET"));return e.use("/on-uninstall",n("/.extensions/on-uninstall")),e.use(i.managementApiClient({domain:r("AUTH0_DOMAIN"),clientId:r("AUTH0_CLIENT_ID"),clientSecret:r("AUTH0_CLIENT_SECRET")})),e.delete("/on-uninstall",function(e,n){var t=r("AUTH0_CLIENT_ID");e.auth0.clients.delete({client_id:t}).then(function(){s.debug("Deleted client "+t),n.sendStatus(204)}).catch(function(e){s.debug("Error deleting client: "+r("AUTH0_CLIENT_ID")),s.error(e),n.sendStatus(204)})}),e}},function(e,n,t){"use strict";(function(n){var o=(t(26),t(25)),i=(t(10),t(1).urlHelpers),r=t(2);e.exports=function(){var e='\n  <!DOCTYPE html>\n  <html lang="en">\n  <head>\n    <title><%= config.TITLE %></title>\n    <meta charset="UTF-8" />\n    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <link rel="shortcut icon" href="https://cdn.auth0.com/styleguide/4.6.13/lib/logos/img/favicon.png">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css" />\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1672/css/index.min.css" />\n    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.6.13/index.min.css" />\n    <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>" /><% } %>\n    <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="//cdn.auth0.com/extensions/auth0-logs-to-mixpanel/assets/auth0-logs-to-mixpanel.ui.<%= assets.version %>.css" /><% } %>\n    <% if (assets.customCss) { %><link rel="stylesheet" type="text/css" href="<%= assets.customCss %>" /><% } %>\n  </head>\n  <body>\n    <div id="app"></div>\n    <script type="text/javascript" src="//cdn.auth0.com/w2/auth0-7.0.4.min.js"><\/script>\n    <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1672/js/bundle.js"><\/script>\n    <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;<\/script>\n    <% if (assets.vendors) { %><script type="text/javascript" src="<%= assets.vendors %>"><\/script><% } %>\n    <% if (assets.app) { %><script type="text/javascript" src="<%= assets.app %>"><\/script><% } %>\n    <% if (assets.version) { %>\n    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-logs-to-mixpanel/assets/auth0-logs-to-mixpanel.ui.vendors.<%= assets.version %>.js"><\/script>\n    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-logs-to-mixpanel/assets/auth0-logs-to-mixpanel.ui.<%= assets.version %>.js"><\/script>\n    <% } %>\n  </body>\n  </html>\n  ';return function(n,t,s){if(0===n.url.indexOf("/api"))return s();var c={AUTH0_DOMAIN:r("AUTH0_DOMAIN"),AUTH0_CLIENT_ID:r("EXTENSION_CLIENT_ID"),AUTH0_MANAGE_URL:r("AUTH0_MANAGE_URL")||"https://manage.auth0.com",BASE_URL:i.getBaseUrl(n),BASE_PATH:i.getBasePath(n),TITLE:r("TITLE")};return t.send(o.render(e,{config:c,assets:{customCss:r("CUSTOM_CSS"),version:"1.4.0"}}))}}}).call(n,"/")},function(e,n,t){"use strict";var o=t(4).Router,i=t(1).middlewares,r=t(2),s=t(19);e.exports=function(e){var n=o(),t=i.authenticateAdmins({credentialsRequired:!0,secret:r("EXTENSION_SECRET"),audience:"urn:logs-to-mixpanel",baseUrl:r("PUBLIC_WT_URL")||r("WT_URL"),onLoginSuccess:function(e,n,t){return t()}});return n.get("/",s()),n.get("/api/report",t,function(n,t,o){return e.read().then(function(e){return t.json(e&&e.logs||[])}).catch(o)}),n}},function(e,n,t){"use strict";var o=t(4),i=t(23);e.exports=function(){var e=o.Router();return e.get("/",function(e,n){n.status(200).send(i)}),e}},function(e,n,t){"use strict";var o=t(1),i=t(12),r=t(3);e.exports=o.createServer(function(e,n){return r.info("Starting Logs to Mixpanel extension - Version:","1.4.0"),i(e,n)})},function(e,n){e.exports={title:"Auth0 Logs to Mixpanel",name:"auth0-logs-to-mixpanel",version:"1.4.0",author:"auth0",description:"This extension will take all of your Auth0 logs and export them to Mixpanel",type:"cron",initialUrlPath:"/login",repository:"https://github.com/auth0/auth0-logs-to-mixpanel",keywords:["auth0","extension"],schedule:"0 */5 * * * *",auth0:{createClient:!0,onUninstallPath:"/.extensions/on-uninstall",scopes:"read:logs delete:clients"},secrets:{MIXPANEL_TOKEN:{description:"Mixpanel Token - this is your Mixpanel Token for your mixpanel project",required:!0},MIXPANEL_KEY:{description:"Mixpanel Key - this is your Mixpanel Key for your mixpanel project",required:!0,type:"password"},BATCH_SIZE:{description:"The amount of logs to be read on each execution. Maximum is 20.",default:10},START_FROM:{description:"CheckpointId of log to start with."},SLACK_INCOMING_WEBHOOK_URL:{description:"Slack webhook"},SLACK_SEND_SUCCESS:{description:"Send success messages to slack?",type:"select",allowMultiple:!0,options:[{value:"No",text:""},{value:"Yes",text:"true"}]},LOG_LEVEL:{description:"This allows you to specify the log level of events that need to be sent",type:"select",allowMultiple:!0,options:[{value:"-",text:""},{value:"0",text:"Debug"},{value:"1",text:"Info"},{value:"2",text:"Warning"},{value:"3",text:"Error"},{value:"4",text:"Critical"}]},LOG_TYPES:{description:"If you only want to send events with a specific type (eg: failed logins)",type:"select",allowMultiple:!0,options:[{value:"-",text:""},{value:"s",text:"Success Login (Info)"},{value:"seacft",text:"Success Exchange (Info)"},{value:"feacft",text:"Failed Exchange (Error)"},{value:"f",text:"Failed Login (Error)"},{value:"w",text:"Warnings During Login (Warning)"},{value:"du",text:"Deleted User (Info)"},{value:"fu",text:"Failed Login (invalid email/username) (Error)"},{value:"fp",text:"Failed Login (wrong password) (Error)"},{value:"fc",text:"Failed by Connector (Error)"},{value:"fco",text:"Failed by CORS (Error)"},{value:"con",text:"Connector Online (Info)"},{value:"coff",text:"Connector Offline (Error)"},{value:"fcpro",text:"Failed Connector Provisioning (Critical)"},{value:"ss",text:"Success Signup (Info)"},{value:"fs",text:"Failed Signup (Error)"},{value:"cs",text:"Code Sent (Debug)"},{value:"cls",text:"Code/Link Sent (Debug)"},{value:"sv",text:"Success Verification Email (Debug)"},{value:"fv",text:"Failed Verification Email (Debug)"},{value:"scp",text:"Success Change Password (Info)"},{value:"fcp",text:"Failed Change Password (Error)"},{value:"sce",text:"Success Change Email (Info)"},{value:"fce",text:"Failed Change Email (Error)"},{value:"scu",text:"Success Change Username (Info)"},{value:"fcu",text:"Failed Change Username (Error)"},{value:"scpn",text:"Success Change Phone Number (Info)"},{value:"fcpn",text:"Failed Change Phone Number (Error)"},{value:"svr",text:"Success Verification Email Request (Debug)"},{value:"fvr",text:"Failed Verification Email Request (Error)"},{value:"scpr",text:"Success Change Password Request (Debug)"},{value:"fcpr",text:"Failed Change Password Request (Error)"},{value:"fn",text:"Failed Sending Notification (Error)"},{value:"limit_wc",text:"Blocked Account (Critical)"},{value:"limit_ui",text:"Too Many Calls to /userinfo (Critical)"},{value:"api_limit",text:"Rate Limit On API (Critical)"},{value:"sdu",text:"Successful User Deletion (Info)"},{value:"fdu",text:"Failed User Deletion (Error)"}]}}}},function(e,n){e.exports=require("body-parser@1.12.4")},function(e,n){e.exports=require("ejs@2.3.1")},function(e,n){e.exports=require("fs")},function(e,n){e.exports=require("mixpanel@0.4.0")},function(e,n){e.exports=require("morgan@1.5.3")},function(e,n){e.exports=require("querystring")},function(e,n){e.exports=require("stream")},function(e,n){e.exports=require("url")},function(e,n){e.exports=require("util")},function(e,n){e.exports=require("winston@1.0.0")}]);
