import{r as c,j as t,a as s}from"./jsx-runtime-89a93595.js";import{L as C}from"./layers-ic-9a859e41.js";import{b as F,a as P,aF as K,aS as T,aT as V,k as G,aR as d}from"./EmojiBoard-d3fa8393.js";import"./web3.min-cf08a409.js";const M=()=>{var b,h,g,u,k,N,w,v,y,j,S,O;const{id:a}=F();console.log("NFTDetails",a);const{state:{myWallet:l},dispatch:I}=c.useContext(P),[e,z]=c.useState({}),[p,r]=c.useState(!0);c.useState({ownershipId:"",nftId:""});const[m,E]=c.useState({});c.useEffect(()=>{((l==null?void 0:l.privateKey)||(l==null?void 0:l.address))===null?K({myWallet:l,dispatch:I}):L()},[a,l==null?void 0:l.privateKey]);const L=async()=>{if(a&&!p&&r(!0),!a)return;const{nftId:n,ownershipId:x}=A(a);T(n).then(async({data:f,err:o})=>{o===null?(z(f),await V(x).then(({data:i,err:D})=>{D===null?(E(i),console.log("OwnershipData",JSON.stringify(i))):console.error(D)}).finally(()=>r(!1))):console.error(o)}).finally(()=>r(!1))},A=n=>{var o,i;let x=n,f=(i=(o=n==null?void 0:n.split(":"))==null?void 0:o.slice(0,4))==null?void 0:i.join(":");return{ownershipId:x,nftId:f}};return t("section",{className:"overflow-hidden text-gray-700 bg-white body-font",children:p?t("div",{className:"flex flex-row items-center justify-center w-[100%] h-[100vh]",children:t("div",{className:"flex flex-col items-center justify-center",children:t(G,{})})}):s("div",{className:"container px-5 sm-px-1 xs:px-1 md:px-[5%] py-16 mx-auto",children:[t("span",{className:"block text-3xl font-semibold text-center text-black font-lato",children:"NFT Details"}),s("div",{className:"flex flex-wrap mx-auto lg:w-12/12 ",children:[t("video",{autoPlay:!0,className:"lg:w-1/2 w-full object-cover max-w-min aspect-[39/22] max-h-[80vh] lg:mt-7",loop:!0,muted:!0,controls:!1,children:t("source",{src:d(((b=e==null?void 0:e.meta)==null?void 0:b.content)||[],"@type","VIDEO"),type:"video/mp4",className:"h-[86vh] w-full object-cover max-h-[86vh]"})},d(((h=e==null?void 0:e.meta)==null?void 0:h.content)||[],"@type","VIDEO")),s("div",{className:"w-full mt-6 lg:w-1/2 lg:pl-10 lg:py-6 lg:mt-0",children:[s("div",{className:"flex flex-row items-center justify-center w-[100%] border-b-2 border-zinc-100 pb-4 mb-4",children:[s("div",{className:"flex flex-col justify-between w-[100%] pr-4 min-h-[100px]",children:[t("span",{className:"block text-base font-semibold text-black md:text-2xl font-lato",children:((g=e==null?void 0:e.meta)==null?void 0:g.name)||"--"}),s("div",{className:"flex flex-row items-center w-[100%]",children:[t("span",{className:"block text-sm font-medium md:text-lg lg:text-xl text-zinc-600 font-lato",children:`Price: ${((u=e==null?void 0:e.bestSellOrder)==null?void 0:u.makePrice)||"--"} ${((w=(N=(k=e==null?void 0:e.bestSellOrder)==null?void 0:k.take)==null?void 0:N.type)==null?void 0:w["@type"])||"--"}`}),s("section",{className:"flex flex-row items-center ml-[2%]",children:[t("img",{src:C,alt:"Layers",className:"w-[20px] h-[20px] mr-2"}),t("span",{className:"block text-sm md:text-lg lg:text-xl text-zinc-700 font-lato",children:(m==null?void 0:m.value)||"--"})]})]})]}),t("img",{src:d(((v=e==null?void 0:e.meta)==null?void 0:v.content)||[],"@type","IMAGE"),alt:"NFT",className:"min-w-[100px] h-[100px]"})]}),t("span",{className:"block text-base font-semibold text-black md:text-2xl font-lato",children:"Details"}),t("span",{className:"block mt-3 text-sm font-semibold text-black md:text-lg lg:text-xl font-lato",children:"Contact Address"}),t("span",{className:"block text-xs font-medium break-all md:text-lg lg:text-xl text-zinc-600 font-lato",children:e!=null&&e.contract?(S=(j=(y=e==null?void 0:e.contract)==null?void 0:y.split(":"))==null?void 0:j.slice(1))==null?void 0:S.join(":"):"--"}),t("span",{className:"block mt-3 text-sm font-semibold text-black md:text-lg lg:text-xl font-lato",children:"Token Id"}),t("span",{className:"block text-xs font-medium break-all md:text-lg lg:text-xl text-zinc-600 font-lato",children:(e==null?void 0:e.tokenId)||"--"}),t("span",{className:"block mt-3 text-sm font-semibold text-black md:text-lg lg:text-xl font-lato",children:"Blockchain"}),t("span",{className:"block text-xs font-medium break-all md:text-lg lg:text-xl text-zinc-600 font-lato",children:(e==null?void 0:e.blockchain)||"--"}),t("span",{className:"block mt-3 text-sm font-semibold text-black md:text-lg lg:text-xl font-lato",children:"Description"}),t("pre",{className:"block mt-2 text-xs font-medium break-all whitespace-pre-wrap md:text-lg lg:text-xl text-zinc-600 font-lato",children:((O=e==null?void 0:e.meta)==null?void 0:O.description)||"--"})]})]})]})})};export{M as default};
//# sourceMappingURL=NFTDetails-f4302466.js.map