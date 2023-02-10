import React from "react";
import SpinningLoader from "./Animation/SpinningLoader";


interface Props {
    onP: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    loading?: boolean;
    title: string;
    disabled?: boolean;
    className?: string;
};

const BTN = ({ onP, loading, title, disabled = false, className = "" }: Props) => {
    return (
        <button onClick={onP} disabled={disabled || loading} className={`${className} relative px-8 py-3 flex flex-row text-sm disabled:bg-zinc-800 bg-black rounded-xl border shadow-xl border-gray-200 text-white transition-all ease-linear duration-200 font-semibold ${disabled ? "" : "active:scale-[.98] active:outline-none active:ring-0 active:bg-slate-700"}`}>
            <SpinningLoader isLoading={loading} className="absolute-ctr" />
            <span className={loading ? "opacity-25" : ""}>
                {title}
            </span>
        </button>
    )
};

export default BTN;