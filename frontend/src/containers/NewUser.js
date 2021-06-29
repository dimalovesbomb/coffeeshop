import React, { useState } from 'react';
import MaskedInput from 'react-text-mask';
import { CustomModal } from './Modal';
import { Loader } from './Loader';
import { isPhoneNumberValid, phoneNumberMask, initModalData } from '../helpers';
import { useHistory } from 'react-router-dom';

export const NewUser = () => {
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('+7');
    const [cupsQuantity, setCupsQuantity] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [modalData, setModalData] = useState(initModalData);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

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
            setIsLoading(() => true);
            const req = await fetch('/api/newUser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: userName,
                    phoneNumber,
                    cupsQuantity,
                }),
            })
                .then(res => res.json())
                .catch(err => {
                    setIsLoading(() => false);
                    setModalData(() => ({
                        ...initModalData,
                        isOpen: true,
                        header: 'Упс!',
                        text: `Ничего страшного вроде, но стоит проверить. ${err}`,
                        onConfirm: () =>
                            setModalData(() => ({
                                ...initModalData,
                                isOpen: false,
                            })),
                    }));
                });
            setIsLoading(() => false);

            const successMessage = `Пользователь ${req.result.name} с номером ${req.result.phoneNumber} успешно добавлен! У него/неё куплено ${req.result.cupsQuantity} чашек.`;
            const errorMessage = `Что-то пошло не так: ${req.error}`;

            if (req.statusCode === 200) {
                setModalData(() => ({
                    ...initModalData,
                    isOpen: true,
                    header: 'Успех!',
                    text: successMessage,
                    onConfirm: () => {
                        setModalData(() => ({
                            ...initModalData,
                            isOpen: false,
                        }));
                        history.push('/');
                    },
                }));
            } else {
                setModalData(() => ({
                    ...initModalData,
                    isOpen: true,
                    header: 'Упс!',
                    text: errorMessage,
                    onConfirm: () =>
                        setModalData(() => ({
                            ...initModalData,
                            isOpen: false,
                        })),
                }));
            }
        } else {
            setModalData(() => ({
                ...initModalData,
                isOpen: true,
                header: 'Упс!',
                text: 'Надо заполнить количество чашек, купленных сейчас. Если клиент ничего не взял, поставь 0.',
                onConfirm: () =>
                    setModalData(() => ({ ...initModalData, isOpen: false })),
            }));
        }
    };

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
                style={{ marginTop: 60 }}
                className="link"
                onClick={onSubmit}
                disabled={isButtonDisabled}
            >
                Зарегистрировать
            </button>
            <CustomModal
                isOpen={modalData.isOpen}
                header={modalData.header}
                text={modalData.text}
                onConfirm={modalData.onConfirm}
                onConfirmText={modalData.onConfirmText}
                onCancel={modalData.onCancel}
                onCancelText={modalData.onCancelText}
            />
            <Loader isLoading={isLoading} />
        </div>
    );
};
