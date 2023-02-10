import { FC, ReactNode } from "react";
import BTN from "../BTN";

interface Props {
    visible: boolean;
    onClose: (b: boolean) => void;
    closeBtnTxt?: string;
    saveBtnTxt?: string;
    onSave?: () => void;
    title?: string;
    subtitle?: string;
    children?: ReactNode;
    disabled?: boolean;
    className?: string;
    saving?: boolean;
    subClass?: string;
    hideClose?: boolean;
    toggleSpace?: boolean;
};

const Index: FC<Props> = ({ visible, onClose, closeBtnTxt, saveBtnTxt, onSave, title, subtitle, children, className = "", saving, disabled, subClass = "", hideClose, toggleSpace = false }) => {
    return visible ? (
        <div className={className + "fixed text-black flex items-center justify-center overflow-auto z-40 bg-black bg-opacity-40 left-0 right-0 top-0 bottom-0 transition-all duration-300"}
            /* x-transition:enter-start="opacity-0" x-transition:enter-end="opacity-100" x-transition:leave="transition ease duration-300" 
            x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0" */>
            <div className={subClass + " bg-white rounded-xl shadow-2xl p-6 sm:w-8/12 xs:8/12 mx-10 flex justify-center flex-col"}
             /* x-transition:enter="transition ease duration-100 transform" x-transition:enter-start="opacity-0 scale-90 translate-y-1"
              x-transition:enter-end="opacity-100 scale-100 translate-y-0" x-transition:leave="transition ease duration-100 transform" 
               x-transition:leave-start="opacity-100 scale-100 translate-y-0" x-transition:leave-end="opacity-0 scale-90 translate-y-1" */>
                {title && (<span className="font-semibold block text-3xl text-center font-lato text-black mb-3">{title}</span>)}
                {subtitle && (<p className="mb-5 font-sans text-center">{subtitle}</p>)}
                {children}
                {!toggleSpace && <div className="text-right space-x-5 mt-5 justify-between flex w-full">
                    <span /* onClick={() => onClose(false)}  */ className={`opacity-0 ${hideClose ? "md:block " : "hidden md:block"} select-none px-4 py-2 text-sm bg-transparent rounded-xl border transition-colors duration-150 ease-linear border-transparent text-black font-bold`}>{closeBtnTxt || "Close"}</span>
                    {onSave && (
                        <BTN disabled={disabled} title={saveBtnTxt || "Save"} onP={() => onSave()} loading={saving} />
                    )}
                    <button onClick={() => onClose(false)} className={`${hideClose ? "opacity-0 select-none bg-transparent hidden sm:block" : ""} secondary-btn`}>{closeBtnTxt || "Close"}</button>
                </div>}
            </div>
        </div>
    ) : null;
};

export default Index;