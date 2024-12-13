import errorImage from '../images/error.jpg'
export const ErrorComponent = ({ message }: { message: string; }) => {
    return (
        <div className="error-container">
            <p className="error-message">Error: {message}
            <br></br>
            This might be because you are using a invalid channel name.
            <br></br>
            Please confirm the channel name with the team.
            <br></br>
            Only specific channels are allowed to be created.
            </p>
            <img src={errorImage} alt="Error in rendering error image((😂))"/>
        </div>
    );
};
