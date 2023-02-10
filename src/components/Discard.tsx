
import React from 'react'

type props = {
    setPopupPost: (b: boolean) => void, setDiscard: (b: boolean) => void, discardToggle: boolean
}
const Discard = ({ setPopupPost, setDiscard, discardToggle }: props) => {
    const discard = () => {
        setPopupPost(false);
        setDiscard(false);
        // navigate(-1);
    }

    const cancel = () => {
        setDiscard(!discardToggle);
    }
    return (
        <div className="dis-main d-f">
            <div className="dis-box">
                <div className="dis-text d-f">
                    <span>  Discard post?</span>
                    <span style={{ fontSize: '1.2rem' }}>  If you leave, your edits won't be saved.</span>
                </div>
                <div className="dis-discard d-f cursor-pointer" onClick={() => discard()}>
                    <span style={{ color: 'red', fontSize: '1.5rem' }} >Discard</span>
                </div>
                <div className="dis-cancel d-f cursor-pointer " onClick={() => cancel()}>
                    <span style={{ fontSize: '1.5rem' }} >Cancel</span>
                </div>
            </div>
        </div>

    )
}

export default Discard