export default function Button(props) {
    const { children } = props;
    return (
        <button className='shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded'
            {...props}
        >
            {children}
        </button>
    )
}