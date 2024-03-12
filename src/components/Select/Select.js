import { useState } from 'react';

import './Select.css';

export default function Select ({ selectItems = [], defaultValue = '', setValue = () => {} }) {
    const [clickedItem, setClickedItem] = useState(defaultValue);

    function onClick (event) {
        const clickedItemTextContent = event.target.textContent;
        for(const item of selectItems) {
            if(item == clickedItemTextContent) {
                setClickedItem(clickedItemTextContent);
                setValue(clickedItemTextContent);
                return;
            }
        }
    }

        return (
            <div className='select'>
                {selectItems.map((value, index)=> {
                    if(clickedItem == value) {
                        return <button onClick={onClick} key={index} className='selected select-item'>{value}</button>;
                    }
                    return <button onClick={onClick} key={index} className='select-item'>{value}</button>;
                })}
            </div>
        );
}