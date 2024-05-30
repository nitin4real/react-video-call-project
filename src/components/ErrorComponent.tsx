export const ErrorComponent = ({ message }: { message: string; }) => {
    return (
        <div className="error-container">
            <p className="error-message">Error: {message}</p>
        </div>
    );
};
