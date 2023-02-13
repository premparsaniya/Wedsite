import AppRoute from './routes'
import "./styles/index.css"

import { BrowserRouter, Outlet } from 'react-router-dom'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
// import your favorite web3 convenience library here

function App() {

  function getLibrary(provider: any, connector: any) {
    return new Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
  };

  // const Web3ReactProviderReloaded = createWeb3ReactRoot('anotherOne')

  return (
    <BrowserRouter basename='/' >
      <Web3ReactProvider getLibrary={getLibrary}>
        {/* <Web3ReactProviderReloaded getLibrary={getLibrary}> */}
        <AppRoute />        
        {/* </Web3ReactProviderReloaded> */}
      </Web3ReactProvider>
    </BrowserRouter>
  );
}

export default App;