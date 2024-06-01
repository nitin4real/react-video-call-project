import errorImage from '../images/error.jpg'
export const ErrorComponent = ({ message }: { message: string; }) => {
    return (
        <div className="error-container">
            <p className="error-message">Error: {message}</p>
            <img src={errorImage} alt="Error in rendering error image((😂))"/>
        </div>
    );
};
