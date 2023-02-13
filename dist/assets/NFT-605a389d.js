import{r,a as n,j as l}from"./jsx-runtime-89a93595.js";import{L}from"./index-bc563521.js";import{L as j}from"./layers-ic-9a859e41.js";import{a as T,aF as S,aQ as v,l as z,aR as C}from"./EmojiBoard-d3fa8393.js";import"./web3.min-cf08a409.js";const K=()=>{const{state:{myWallet:s},dispatch:k}=r.useContext(T),[t,y]=r.useState([]),[c,o]=r.useState(!0);r.useEffect(()=>{((s==null?void 0:s.privateKey)||(s==null?void 0:s.address))===null?S({myWallet:s,dispatch:k}):F()},[s.address]);const F=async()=>{s.address&&!c&&o(!0),s.address&&v(s.address).then(({data:e,err:a})=>{a===null?y((e==null?void 0:e.items)||[]):console.error(a)}).finally(()=>o(!1))};return n("div",{className:"flex flex-col items-center flex-1 min-h-screen py-16 min-w-screen",children:[l("span",{className:"block text-4xl font-semibold text-center text-black font-lato",children:"NFT"}),c?l(z,{isLoading:!0,colClass:"text-black",size:10,className:"mt-[15%]"}):(t==null?void 0:t.length)===0?l("span",{className:"block text-lg font-semibold text-center text-black font-lato mt-[15%]",children:"No NFTs found!"}):t==null?void 0:t.map((e,a)=>{var x,f,d,i,p,m,b,N,h,u,w,g;return n(L,{to:`/wallet/NFT/${(x=e==null?void 0:e.ownership)==null?void 0:x.id}`,className:`flex flex-row items-center justify-center w-[92%] lg:max-w-[70%] p-4 mx-[4%] ${(t==null?void 0:t.length)-1===a?"":"border-b-2 border-zinc-100"}`,children:[l("img",{src:C(((d=(f=e==null?void 0:e.item)==null?void 0:f.meta)==null?void 0:d.content)||[],"@type","IMAGE"),alt:"NFT",className:"min-w-[100px] h-[100px]"}),n("div",{className:"flex flex-col justify-between w-[100%] px-4 min-h-[80px]",children:[l("span",{className:"block text-base font-semibold text-black md:text-xl font-lato",children:((p=(i=e==null?void 0:e.item)==null?void 0:i.meta)==null?void 0:p.name)||"--"}),n("div",{className:"flex flex-row items-center justify-between w-[100%]",children:[l("span",{className:"block text-sm md:text-lg text-zinc-600 font-lato",children:`Price: ${((b=(m=e==null?void 0:e.item)==null?void 0:m.bestSellOrder)==null?void 0:b.makePrice)||"--"} ${((w=(u=(h=(N=e==null?void 0:e.item)==null?void 0:N.bestSellOrder)==null?void 0:h.take)==null?void 0:u.type)==null?void 0:w["@type"])||"--"}`}),n("section",{className:"flex flex-row items-center justify-between",children:[l("img",{src:j,alt:"Layers",className:"w-[20px] h-[20px] mr-2"}),l("span",{className:"block text-sm md:text-lg text-zinc-700 font-lato",children:((g=e==null?void 0:e.ownership)==null?void 0:g.value)||"--"})]})]})]})]},a)})]})};export{K as default};
//# sourceMappingURL=NFT-605a389d.js.map