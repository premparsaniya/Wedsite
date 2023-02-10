import React from 'react'
import { Loading } from '../components/Animation/';
import Lottie from 'react-lottie';

const LoadingState = ({ size }: { size?: number }) => {

  return (
    <div className="ani-main">
      <Lottie
        options={{
          loop: true,
          autoplay: true,
          animationData: Loading,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
          }
        }}
        speed={.1}
        height={size || 300}
        width={size || 300}
      />
    </div>
  )
}

export default LoadingState; 