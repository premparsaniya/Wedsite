
import React from 'react'
import MyLoading from './MyLoading'
import { BTN } from "~/components"

type Props = {
    message: string,
    btnMsg: any,
    functionHandle: any,
    closePopup: any,
    loading: boolean,
}
const PopUp = ({ message, btnMsg, functionHandle, closePopup, loading }: Props) => {
    return (
        <div className='popup-main'>
            <div className="popup-contain">
                <div className="popup-message-div">
                    <span className='popup-message-span'>{message}</span>
                </div>
                <div className="popup-btn-div">
                    <BTN title="No" disabled={loading} className='' onP={closePopup} />
                    <BTN loading={loading} title={`${btnMsg}`} disabled={loading} className='' onP={functionHandle} />
                </div>
            </div>
        </div>
    )
}

export default PopUp