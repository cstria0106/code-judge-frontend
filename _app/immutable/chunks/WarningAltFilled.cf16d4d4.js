import{s as Z,v as g,G as f,H as m,h as _,d as o,j as u,I as v,i as A,w as c,u as p,J as b,K as w,l as z,m as E,n as H}from"./scheduler.074396d7.js";import{g as B}from"./spread.8a54911c.js";import{S as C,i as L}from"./index.1e7081af.js";function M(n){let e,i;return{c(){e=f("title"),i=z(n[1])},l(s){e=m(s,"title",{});var r=_(e);i=E(r,n[1]),r.forEach(o)},m(s,r){A(s,e,r),c(e,i)},p(s,r){r&2&&H(i,s[1])},d(s){s&&o(e)}}}function R(n){let e,i,s,r,a=n[1]&&M(n),d=[{xmlns:"http://www.w3.org/2000/svg"},{viewBox:"0 0 32 32"},{fill:"currentColor"},{preserveAspectRatio:"xMidYMid meet"},{width:n[0]},{height:n[0]},n[2],n[3]],h={};for(let t=0;t<d.length;t+=1)h=g(h,d[t]);return{c(){e=f("svg"),a&&a.c(),i=f("path"),s=f("path"),r=f("path"),this.h()},l(t){e=m(t,"svg",{xmlns:!0,viewBox:!0,fill:!0,preserveAspectRatio:!0,width:!0,height:!0});var l=_(e);a&&a.l(l),i=m(l,"path",{fill:!0,d:!0,"data-icon-path":!0}),_(i).forEach(o),s=m(l,"path",{d:!0}),_(s).forEach(o),r=m(l,"path",{d:!0}),_(r).forEach(o),l.forEach(o),this.h()},h(){u(i,"fill","none"),u(i,"d","M16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Zm-1.125-5h2.25V12h-2.25Z"),u(i,"data-icon-path","inner-path"),u(s,"d","M16.002,6.1714h-.004L4.6487,27.9966,4.6506,28H27.3494l.0019-.0034ZM14.875,12h2.25v9h-2.25ZM16,26a1.5,1.5,0,1,1,1.5-1.5A1.5,1.5,0,0,1,16,26Z"),u(r,"d","M29,30H3a1,1,0,0,1-.8872-1.4614l13-25a1,1,0,0,1,1.7744,0l13,25A1,1,0,0,1,29,30ZM4.6507,28H27.3493l.002-.0033L16.002,6.1714h-.004L4.6487,27.9967Z"),v(e,h)},m(t,l){A(t,e,l),a&&a.m(e,null),c(e,i),c(e,s),c(e,r)},p(t,[l]){t[1]?a?a.p(t,l):(a=M(t),a.c(),a.m(e,i)):a&&(a.d(1),a=null),v(e,h=B(d,[{xmlns:"http://www.w3.org/2000/svg"},{viewBox:"0 0 32 32"},{fill:"currentColor"},{preserveAspectRatio:"xMidYMid meet"},l&1&&{width:t[0]},l&1&&{height:t[0]},l&4&&t[2],l&8&&t[3]]))},i:p,o:p,d(t){t&&o(e),a&&a.d()}}}function W(n,e,i){let s,r;const a=["size","title"];let d=b(e,a),{size:h=16}=e,{title:t=void 0}=e;return n.$$set=l=>{i(5,e=g(g({},e),w(l))),i(3,d=b(e,a)),"size"in l&&i(0,h=l.size),"title"in l&&i(1,t=l.title)},n.$$.update=()=>{i(4,s=e["aria-label"]||e["aria-labelledby"]||t),i(2,r={"aria-hidden":s?void 0:!0,role:s?"img":void 0,focusable:Number(e.tabindex)===0?!0:void 0})},e=w(e),[h,t,r,d,s]}class k extends C{constructor(e){super(),L(this,e,W,R,Z,{size:0,title:1})}}const Y=k;export{Y as W};
