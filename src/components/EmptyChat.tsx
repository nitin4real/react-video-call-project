export const EmptyChat = ({ message }: { message: string }) => {

    return (
        <div className="empty-chat">
            <svg className="empty-chat__icon" width="90" height="90" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none">
                    <path fill="currentColor" fill-opacity=".25" d="M4 12a8 8 0 1 1 16 0v6.667c0 .31 0 .465-.034.592a1 1 0 0 1-.707.707c-.127.034-.282.034-.592.034H12a8 8 0 0 1-8-8" />
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M8.5 10.5h7m-7 3h5" />
                </g>
            </svg>
            <div className="empty-chat__text">{message}</div>
        </div>
    )
}