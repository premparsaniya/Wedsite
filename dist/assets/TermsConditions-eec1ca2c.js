import{r as s,j as t,F as l}from"./jsx-runtime-89a93595.js";import{k as p}from"./EmojiBoard-d3fa8393.js";import"./web3.min-cf08a409.js";function u(){const[e,o]=s.useState([]),[i,a]=s.useState(!1);s.useEffect(()=>{c()},[]);const c=()=>{const r={method:"get_page_content",page_id:3};a(!0),fetch("https://nwo.capital/app/state/api/cms",{method:"POST",headers:{accept:"application/json",contentType:"application/json",version:"1.0.0"},body:JSON.stringify(r)}).then(d=>{d.json().then(n=>{n.status===1&&(o(n.data),a(!1))})})};return t(l,{children:i?t("div",{className:"w-full h-[100%] flex justify-center items-center",children:t(p,{size:100})}):t("div",{className:"text-center",dangerouslySetInnerHTML:{__html:e==null?void 0:e.content}})})}export{u as default};
//# sourceMappingURL=TermsConditions-eec1ca2c.js.map