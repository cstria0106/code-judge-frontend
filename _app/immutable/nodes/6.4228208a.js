import{s as re,F as G,o as oe,G as H,f as $,a as v,g as _,H as N,c as x,i as B,D as O,d as g,h as J,j as m,w as p,J as Z,E as le,l as ie,m as fe}from"../chunks/scheduler.cf24fc46.js";import{S as ce,i as ue,b as V,d as U,m as q,a as A,t as M,e as z}from"../chunks/index.1a695a89.js";import{g as ee}from"../chunks/navigation.31af5226.js";import{g as te}from"../chunks/api.4c769691.js";import{B as me}from"../chunks/BoxTitle.39ecf30e.js";import{P as pe}from"../chunks/Problems.e2d300c9.js";import{B as de}from"../chunks/Box.dae89304.js";import{O as he}from"../chunks/Orientation.5c54c58d.js";import{a as se}from"../chunks/module.169a8bc7.js";import{h as ae}from"../chunks/moment.fbc5633a.js";import{w as W}from"../chunks/index.aee107d7.js";import{b as ne}from"../chunks/paths.0d997e9a.js";const K=W(!1),Q=W(!1),R=W("");function $e(o){let t;return{c(){t=ie("Manage Problems")},l(r){t=fe(r,"Manage Problems")},m(r,e){B(r,t,e)},d(r){r&&g(t)}}}function _e(o){let t,r,e,n,c="Search:",d,f,l,u,C,b,L="Show ended",i,h,T,k,y="Show drafts",j,P,D,S,w,I,F,X;return t=new me({props:{$$slots:{default:[$e]},$$scope:{ctx:o}}}),w=new pe({props:{pages:[Promise.resolve(o[3])]}}),w.$on("clickProblem",o[9]),{c(){V(t.$$.fragment),r=v(),e=$("div"),n=$("label"),n.textContent=c,d=v(),f=$("input"),l=v(),u=$("div"),C=v(),b=$("label"),b.textContent=L,i=v(),h=$("input"),T=v(),k=$("label"),k.textContent=y,j=v(),P=$("input"),D=v(),S=$("div"),V(w.$$.fragment),this.h()},l(s){U(t.$$.fragment,s),r=x(s),e=_(s,"DIV",{class:!0});var a=J(e);n=_(a,"LABEL",{for:!0,"data-svelte-h":!0}),N(n)!=="svelte-1tn9osg"&&(n.textContent=c),d=x(a),f=_(a,"INPUT",{id:!0,type:!0,class:!0,placeholder:!0}),l=x(a),u=_(a,"DIV",{class:!0}),J(u).forEach(g),C=x(a),b=_(a,"LABEL",{for:!0,"data-svelte-h":!0}),N(b)!=="svelte-1w4qz7o"&&(b.textContent=L),i=x(a),h=_(a,"INPUT",{id:!0,type:!0}),T=x(a),k=_(a,"LABEL",{for:!0,"data-svelte-h":!0}),N(k)!=="svelte-15qi2z5"&&(k.textContent=y),j=x(a),P=_(a,"INPUT",{id:!0,type:!0}),a.forEach(g),D=x(s),S=_(s,"DIV",{class:!0});var E=J(S);U(w.$$.fragment,E),E.forEach(g),this.h()},h(){m(n,"for","search"),m(f,"id","search"),m(f,"type","text"),m(f,"class","text-xs p-1"),m(f,"placeholder","Name"),m(u,"class","flex-1"),m(b,"for","show-all"),m(h,"id","show-all"),m(h,"type","checkbox"),m(k,"for","show-drafts"),m(P,"id","show-drafts"),m(P,"type","checkbox"),m(e,"class","flex flex-row gap-x-2 items-center mb-4"),m(S,"class","h-[400px] overflow-y-scroll border border-gray-300 p-4 rounded-md")},m(s,a){q(t,s,a),B(s,r,a),B(s,e,a),p(e,n),p(e,d),p(e,f),Z(f,o[0]),p(e,l),p(e,u),p(e,C),p(e,b),p(e,i),p(e,h),h.checked=o[2],p(e,T),p(e,k),p(e,j),p(e,P),P.checked=o[1],B(s,D,a),B(s,S,a),q(w,S,null),I=!0,F||(X=[O(f,"input",o[6]),O(h,"change",o[7]),O(P,"change",o[8])],F=!0)},p(s,a){const E={};a&1024&&(E.$$scope={dirty:a,ctx:s}),t.$set(E),a&1&&f.value!==s[0]&&Z(f,s[0]),a&4&&(h.checked=s[2]),a&2&&(P.checked=s[1]);const Y={};a&8&&(Y.pages=[Promise.resolve(s[3])]),w.$set(Y)},i(s){I||(A(t.$$.fragment,s),A(w.$$.fragment,s),I=!0)},o(s){M(t.$$.fragment,s),M(w.$$.fragment,s),I=!1},d(s){s&&(g(r),g(e),g(D),g(S)),z(t,s),z(w),F=!1,le(X)}}}function ge(o){let t,r="Create",e,n,c,d,f;return n=new de({props:{$$slots:{default:[_e]},$$scope:{ctx:o}}}),{c(){t=$("button"),t.textContent=r,e=v(),V(n.$$.fragment)},l(l){t=_(l,"BUTTON",{"data-svelte-h":!0}),N(t)!=="svelte-155es9o"&&(t.textContent=r),e=x(l),U(n.$$.fragment,l)},m(l,u){B(l,t,u),B(l,e,u),q(n,l,u),c=!0,d||(f=O(t,"click",o[4]),d=!0)},p(l,u){const C={};u&1039&&(C.$$scope={dirty:u,ctx:l}),n.$set(C)},i(l){c||(A(n.$$.fragment,l),c=!0)},o(l){M(n.$$.fragment,l),c=!1},d(l){l&&(g(t),g(e)),z(n,l),d=!1,f()}}}function be(o){let t,r;return t=new he({props:{vertical:!0,$$slots:{default:[ge]},$$scope:{ctx:o}}}),{c(){V(t.$$.fragment)},l(e){U(t.$$.fragment,e)},m(e,n){q(t,e,n),r=!0},p(e,[n]){const c={};n&1039&&(c.$$scope={dirty:n,ctx:e}),t.$set(c)},i(e){r||(A(t.$$.fragment,e),r=!0)},o(e){M(t.$$.fragment,e),r=!1},d(e){z(t,e)}}}function we(o,t,r){let e,n,c;G(o,R,i=>r(0,e=i)),G(o,Q,i=>r(1,n=i)),G(o,K,i=>r(2,c=i));let d=[],f=[];oe(async()=>{r(5,d=await se.functional.problem.manage.manageList(te()).then(i=>i.problems))});async function l(){const i=await se.functional.problem.manage.manageCreate(te());ee(`${ne}/manage/problems/${i.problem.id}`)}function u(){e=this.value,R.set(e)}function C(){c=this.checked,K.set(c)}function b(){n=this.checked,Q.set(n)}const L=i=>ee(`${ne}/manage/problems/${i.detail.id}`);return o.$$.update=()=>{o.$$.dirty&39&&r(3,f=d.filter(i=>{const h=ae();return!(H(K)===!1&&ae(i.endTime).endOf("minute").isSameOrBefore(h)||H(Q)===!1&&i.startTime===null||H(R).split(/\s+/).some(y=>!i.name.toLowerCase().includes(y.toLowerCase())))}))},[e,n,c,f,l,d,u,C,b,L]}class Ie extends ce{constructor(t){super(),ue(this,t,we,be,re,{})}}export{Ie as component};
