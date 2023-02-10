import React, { useState, useEffect, useCallback } from 'react';

import './NetworkImage.css';

interface Props {
    nameOfImage: string;
    networkImageUrl: string;
    durationInMs?: number;
}

const NetworkImage: React.FC<Props> = ({ nameOfImage, networkImageUrl, durationInMs = 1500 }) => {
    const [loadedImage, setLoadedImage] = useState<string>("");

    const fetchImage = useCallback(async () => {
        const response = await fetch(networkImageUrl);
        const imageBlob = await response.blob();

        const localURL = URL.createObjectURL(imageBlob);

        setLoadedImage(localURL);
        // console.log('localURL', localURL);
        
        //**now here add another {sameOriginURL: localURL, externalURL: networkImageUrl} 
        //**in that central store list, i.e., [{sameOriginURL: '...', externalURL: 'a 
        //**network URL'}, {sameOriginURL: '...', externalURL: 'another network URL'}]
    }, [networkImageUrl]);

    useEffect(() => {
        //**find the networkImageUrl, i.e.,in the externalURL from that central store...  
        //**state and if it exists in that central store state then save the sameOriginURL 
        //**of that externalURL in a variable, say save it in a variable named 'url' if 
        //**that externalURL is found otherwise do: url=null
        //**Example:
        // const url = centralStoreState.find(item => item.externalURL === networkImageUrl);

        // if (!url) {
        // setLoadedImage("");
        fetchImage();
        /*}  else {
            setLoadedImage(url.sameOriginURL);
        } */
    }, [networkImageUrl/* , centralStoreState */]);

    return (
        <div className="post-img">
            {/* for extracting the initial letters of the nameOfImage */}
            {nameOfImage.split(' ').map(word => word.charAt(0)).join('')}

            {/* image that will eventually come into view */}

            <img
                src={loadedImage}
                alt={nameOfImage}
                className={
                    ['image-before-loading', loadedImage ? 'image-after-loading' : null]
                        .join(' ')
                }
                style={{ transition: `opacity ${durationInMs}ms` }}
            />
        </div>
    );
};

export default NetworkImage;
