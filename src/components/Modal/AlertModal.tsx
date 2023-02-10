import { Ref, useImperativeHandle } from "react";
import { forwardRef, useState } from "react";
import BTN from "../BTN";

interface Props {
    onConfirm?: () => void;
};

type itemType = {
    title: string;
    subtitle?: string;
    confirmTxt?: string;
    cancelTxt?: string;
}

export type AlertRefType = {
    open: (i: itemType) => void;
    close: () => void;
    loadingOn: (b: boolean) => void;
}

const AlertModal = forwardRef(({ onConfirm = () => { } }: Props, ref: Ref<AlertRefType>) => {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState("Alert");
    const [subtitle, setSubtitle] = useState("");
    const [confirmTxt, setConfirmTxt] = useState("Conform");
    const [cancelTxt, setCancelTxt] = useState("Cancle");
    const [loading, setLoading] = useState(false);
    const onClose = () => setVisible(false);

    const open = (i: itemType) => {
        setVisible(true); setTitle(i.title);
        i?.subtitle && setSubtitle(i?.subtitle);
        i.confirmTxt && setConfirmTxt(i?.confirmTxt);
        i.cancelTxt && setCancelTxt(i?.cancelTxt);
    };

    const close = () => { setVisible(false); setLoading(false); };
    const loadingOn = (b: boolean) => setLoading(b);

    useImperativeHandle(ref, () => ({ open, close, loadingOn }));

    return visible ? (
        <div className={"fixed text-black flex items-center justify-center overflow-auto z-50 bg-black bg-opacity-40 left-0 right-0 top-0 bottom-0 transition-all duration-300"}>
            <div className={"bg-white rounded-xl shadow-2xl p-5 mx-10 flex justify-center flex-col max-w-2xl"} role="alert">
                <div className="flex items-center">
                    <h3 className="text-lg font-medium text-black">{title}</h3>
                </div>
                <p className="my-2 mb-4 text-sm text-black">{subtitle}</p>
                <div className="flex justify-end">
                    <BTN title={confirmTxt || "Confirm"} onP={onConfirm} loading={loading}/>
                    <button type="button" onClick={onClose} className="secondary-btn ml-3">
                        {cancelTxt || "Cancle"}
                    </button>
                </div>
            </div>
        </div>
    ) : null;
})

export default AlertModal;