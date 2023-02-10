interface Props {
    isLoading?: boolean;
    className?: string;
    colClass?: string;
    svgClass?: string
    size?: number;
};

const SpinningLoader = ({ isLoading, className = "", colClass = "", svgClass = "", size = 5 }: Props) => {
    const col = colClass || "text-white";
    return (
        <section className={className}>
            {isLoading ? (
                <svg className={`${svgClass} animate-spin my-1 h-${size} w-${size} ${col}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-40" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : (
                <svg className={`my-1 h-5 w-5`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" />
            )}
        </section>
    );
};

export default SpinningLoader;