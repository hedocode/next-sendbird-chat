export default function Button(props) {
    const { children, color, className = "rounded" } = props;
    let colorToApply;
    switch (color) {
        case "red":
            colorToApply = "bg-red-300 hover:bg-red-500 dark:bg-red-900 dark:hover:bg-red-700";
            break;
    
        default:
            colorToApply = "bg-purple-500 hover:bg-purple-400";
            break;
    }
    return (
        <button
            {...props}
            className={className + ' button focus:shadow-outline focus:outline-none ' + colorToApply }
        >
            {children}
        </button>
    )
}