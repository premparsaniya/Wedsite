import{r as n,j as e,F as v,a as t}from"./jsx-runtime-89a93595.js";import{B as g}from"./black_logo-d92f6c1d.js";import{D as u}from"./DownBox-6a6f41fd.js";import{c as f,ak as N,ar as x}from"./EmojiBoard-d3fa8393.js";import"./web3.min-cf08a409.js";import"./index-bc563521.js";const T=()=>{const m=f(),a=N(),[s,p]=n.useState(""),[r,o]=n.useState(""),[c,l]=n.useState(!1);return e(v,{children:e("section",{className:"login-main-sec",children:t("div",{className:"root-container",children:[t("div",{className:"box-vo",children:[e("div",{className:"vo-insta-logo",children:e("img",{src:g,className:"logo-vo",alt:"hh"})}),t("div",{className:"vo-heading-div ",children:[e("span",{className:"vo-text-heading",children:"Verification"}),e("span",{className:"vo-text",children:"Please enter the verification code :"})]}),t("div",{className:"vo-input-div",children:[e("input",{type:"text",placeholder:"OTP",className:"u-inp",value:s,onChange:i=>{p(i.target.value),o("")}}),e(x,{className:"px-30",onP:()=>{o("");const i={method:"verify_otp",email:`${a.state.email}`,user_id:`${a.state.userId}`,otp:`${s}`};l(!0),fetch("https://nwo.capital/app/state/api/login",{method:"POST",headers:{Accept:"application/Json","Content-Type":"application/Json",version:"1.0.0"},body:JSON.stringify(i)}).then(h=>{h.json().then(d=>{d.status===1?m("/setPassword",{state:{email:`${a.state.email}`,userId:`${a.state.userId}`}}):o(d.message),l(!1)})}).catch(()=>{})},loading:c,title:"Verify",disabled:!(c||s!=="")})]})]}),e("div",{className:"vo-back",children:e(u,{className:"vo-under-box",page:"/login",linkName:"Back To Login",text:void 0})}),r?e("div",{className:"vo-error-box",children:e("h1",{children:r})}):null]})})})};export{T as default};
//# sourceMappingURL=VerifyOTP-f17165d6.js.map