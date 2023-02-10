import { HTMLInputTypeAttribute, InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    pHolder: string;
    rIc?: JSX.Element;
    rLabel?: string;
    val: string;
    onChangeT: (s: string) => void;
    maxLength?: number;
    props?: HTMLInputTypeAttribute;
};

const TxtInput = ({ pHolder, rIc, rLabel, val, onChangeT, maxLength = 150, ...props}: Props) => {
    return (
        <div className="flex w-full flex-wrap items-stretch mb-3 max-w-md flex-row bg-neutral-100 focus:bg-neutral-200 rounded-lg overflow-hidden">
            <input placeholder={pHolder} value={val} onChange={(e) => onChangeT(e.target.value)} maxLength={maxLength} {...props}
                className="px-3 py-3  flex-grow placeholder-neutral-400 text-black text-base border-0 outline-none focus:outline-non ring-0 pr-10 bg-transparent autofill:bg-transparent"
            />
            <span className="font-normal text-center text-slate-700 bg-transparent text-base items-center justify-center pr-[2%] py-3">
                {rLabel}
                {rIc}
            </span>
        </div>
    )
}

export default TxtInput;