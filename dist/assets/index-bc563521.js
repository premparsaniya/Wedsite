import{r as c}from"./jsx-runtime-89a93595.js";import{aj as j,c as O,ak as b,al as x,am as S,an as W,ao as B,ap as K,aq as F}from"./EmojiBoard-d3fa8393.js";/**
 * React Router DOM v6.8.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */function R(){return R=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var n in i)Object.prototype.hasOwnProperty.call(i,n)&&(e[n]=i[n])}return e},R.apply(this,arguments)}function N(e,t){if(e==null)return{};var i={},n=Object.keys(e),r,a;for(a=0;a<n.length;a++)r=n[a],!(t.indexOf(r)>=0)&&(i[r]=e[r]);return i}function A(e){return!!(e.metaKey||e.altKey||e.ctrlKey||e.shiftKey)}function D(e,t){return e.button===0&&(!t||t==="_self")&&!A(e)}const H=["onClick","relative","reloadDocument","replace","state","target","to","preventScrollReset"],z=["aria-current","caseSensitive","className","end","style","to","children"];function G(e){let{basename:t,children:i,window:n}=e,r=c.useRef();r.current==null&&(r.current=W({window:n,v5Compat:!0}));let a=r.current,[s,u]=c.useState({action:a.action,location:a.location});return c.useLayoutEffect(()=>a.listen(u),[a]),c.createElement(B,{basename:t,children:i,location:s.location,navigationType:s.action,navigator:a})}const I=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u",_=c.forwardRef(function(t,i){let{onClick:n,relative:r,reloadDocument:a,replace:s,state:u,target:h,to:o,preventScrollReset:p}=t,g=N(t,H),y,m=!1;if(I&&typeof o=="string"&&/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(o)){y=o;let l=new URL(window.location.href),d=o.startsWith("//")?new URL(l.protocol+o):new URL(o);d.origin===l.origin?o=d.pathname+d.search+d.hash:m=!0}let w=j(o,{relative:r}),f=q(o,{replace:s,state:u,target:h,preventScrollReset:p,relative:r});function v(l){n&&n(l),l.defaultPrevented||f(l)}return c.createElement("a",R({},g,{href:y||w,onClick:m||a?n:v,ref:i,target:h}))}),J=c.forwardRef(function(t,i){let{"aria-current":n="page",caseSensitive:r=!1,className:a="",end:s=!1,style:u,to:h,children:o}=t,p=N(t,z),g=x(h,{relative:p.relative}),y=b(),m=c.useContext(K),{navigator:w}=c.useContext(F),f=w.encodeLocation?w.encodeLocation(g).pathname:g.pathname,v=y.pathname,l=m&&m.navigation&&m.navigation.location?m.navigation.location.pathname:null;r||(v=v.toLowerCase(),l=l?l.toLowerCase():null,f=f.toLowerCase());let d=v===f||!s&&v.startsWith(f)&&v.charAt(f.length)==="/",L=l!=null&&(l===f||!s&&l.startsWith(f)&&l.charAt(f.length)==="/"),U=d?n:void 0,C;typeof a=="function"?C=a({isActive:d,isPending:L}):C=[a,d?"active":null,L?"pending":null].filter(Boolean).join(" ");let E=typeof u=="function"?u({isActive:d,isPending:L}):u;return c.createElement(_,R({},p,{"aria-current":U,className:C,ref:i,style:E,to:h}),typeof o=="function"?o({isActive:d,isPending:L}):o)});var k;(function(e){e.UseScrollRestoration="useScrollRestoration",e.UseSubmitImpl="useSubmitImpl",e.UseFetcher="useFetcher"})(k||(k={}));var P;(function(e){e.UseFetchers="useFetchers",e.UseScrollRestoration="useScrollRestoration"})(P||(P={}));function q(e,t){let{target:i,replace:n,state:r,preventScrollReset:a,relative:s}=t===void 0?{}:t,u=O(),h=b(),o=x(e,{relative:s});return c.useCallback(p=>{if(D(p,i)){p.preventDefault();let g=n!==void 0?n:S(h)===S(o);u(e,{replace:g,state:r,preventScrollReset:a,relative:s})}},[h,u,o,n,r,i,e,a,s])}export{G as B,_ as L,J as N};
//# sourceMappingURL=index-bc563521.js.map