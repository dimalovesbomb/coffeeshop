import React, { useState } from 'react';
import MaskedInput from 'react-text-mask';
import { isPhoneNumberValid, phoneNumberMask } from '../helpers';

export const NewUser = () => {
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('+7');
    const [cupsQuantity, setCupsQuantity] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const onUserNameChange = e => setUserName(() => e.target.value);
    const onCupsQuantityChange = e => setCupsQuantity(() => e.target.value);
    
    const onPhoneNumberChange = e => {
        const isNumberValid = isPhoneNumberValid(e.target.value);

        setPhoneNumber(() => e.target.value);
        
        if (isNumberValid && e.target.value !== '') {
            setIsButtonDisabled(() => false);
        } else {
            setIsButtonDisabled(() => true);
        }
    };

    const onSubmit = async () => {
        const isNumberValid = isPhoneNumberValid(phoneNumber);
    
        if (isNumberValid && userName !== '' && cupsQuantity !== '') {
            const req = await fetch('/api/newUser', {
                method: 'POST',
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({
                    name: userName,
                    phoneNumber,
                    cupsQuantity
                })
            }).then(res => res.json());

            const successMessage = `Пользователь ${req.result.name} с номером ${req.result.phoneNumber} успешно добавлен! У него/неё куплено ${req.result.cupsQuantity} чашек.`;
            const errorMessage = `Что-то пошло не так: ${req.error}`;
            
            req.statusCode === 200 ? alert(successMessage) : alert(errorMessage);
        } else {
          alert('Надо заполнить количество чашек, купленных сейчас. Если клиент ничего не взял, поставь 0.')
        }
    }

    return (
        <div className="column">
            <input
                className="input"
                placeholder="Имя клиента"
                value={userName}
                onChange={onUserNameChange}
            />
            <MaskedInput
                className="input"
                onChange={onPhoneNumberChange}
                value={phoneNumber}
                mask={phoneNumberMask}
            />
            <input
                className="input"
                placeholder="Сколько взял чашек сейчас?"
                value={cupsQuantity}
                onChange={onCupsQuantityChange}
            />
            <button
                style={{marginTop: 60}}
                className="link"
                onClick={onSubmit}
                disabled={isButtonDisabled}
                >
                    Зарегистрировать
                </button>
      </div>
    );
}