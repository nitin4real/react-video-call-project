import { IPopupItem } from '../interface/interfaces';
export const PopupView = ({
    popups,
    closePopup
}: { 
    popups: IPopupItem[], 
    closePopup: (index: number) => void
}
) => {
    return <div className='popup-view'>
        {popups.map((popup, index) => (
            <div key={index} className='popup-item'>
                <div>
                    <h3>{popup.title}</h3>
                    <p>{popup.description}</p>
                </div>
                <button onClick={()=>{
                    closePopup(popup.id)
                }} className='popup-item-cancel-btn'>{'x'}</button>
            </div>
        ))}
    </div>;
};
