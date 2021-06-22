import React, { useState } from 'react';
import MaskedInput from 'react-text-mask';
import { CustomModal } from './Modal';
import { isPhoneNumberValid, phoneNumberMask } from '../helpers';
import { useHistory } from 'react-router-dom';

const initModalData = {
    isOpen: false,
    header: '',
    text: '',
    onConfirm: undefined,
    onConfirmText: undefined,
    onCancel: undefined,
    onCancelText: undefined
};

const ENOUGH_TO_GET_FREE_CUP = 5;

export const RegCup = () => {
    const [phoneNumber, setPhoneNumber] = useState('+7');
    const [cupsQuantity, setCupsQuantity] = useState('');
    const [canAddCups, setCanAddCups] = useState(false);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [modalData, setModalData] = useState(initModalData);
    const history = useHistory();

    const checkUserStatus = async (value) => {
        const isNumberValid = isPhoneNumberValid(value);

        if (isNumberValid && value !== '') {
            const req = await fetch(`/api/getUser?phoneNumber=${encodeURIComponent(value)}`, {
                headers: { "Content-Type": "application/json"},
            })
            .then(res => res.json());

            if (req.statusCode === 200) {
                if (req.result.cupsQuantity >= ENOUGH_TO_GET_FREE_CUP) {
                    setModalData(() => ({
                        ...initModalData,
                        isOpen: true,
                        header: 'Внимание!',
                        text: `У пользователя уже ${req.result.cupsQuantity} чашек. Он берет бесплатную?`,
                        onConfirm: onFreeCupConfirm,
                        onConfirmText: 'Берет',
                        onCancel: () => setModalData(() => ({ ...initModalData, isOpen: false })),
                        onCancelText: 'Не берет'
                    }));
                } else {
                    setModalData(() => ({
                        ...initModalData,
                        isOpen: true,
                        header: '',
                        text: `У клиента ${req.result.cupsQuantity} купленных чашек.`,
                        onConfirm: () => setModalData(() => ({ ...initModalData, isOpen: false }))
                    }));
                }
                setCanAddCups(() => true);
            } else {
                setModalData(() => ({
                    ...initModalData,
                    isOpen: true,
                    header: 'Внимание!',
                    text: 'Пользователь с таким номером не найден!',
                    onConfirm: () => setModalData(() => ({ ...initModalData, isOpen: false }))
                }));
            }
        } else {
            setCanAddCups(() => false);
        }
    };

    const onCupsQuantityChange = e => {
        e.target.value === '' ? setIsButtonDisabled(() => true) : setIsButtonDisabled(() => false);
        if (!isNaN(e.target.value)) {
            setCupsQuantity(() => e.target.value);
        } else {
            setModalData(() => ({
                ...initModalData,
                isOpen: true,
                header: 'Ошибка!',
                text: 'Не, в это поле можно только цифры!',
                onConfirm: () => setModalData(() => ({ ...initModalData, isOpen: false }))
            }));
            setCupsQuantity(() => '');
            setIsButtonDisabled(() => true)
        }
        
    };

    const onPhoneNumberChange = e => {
        // onBlur is used cuz InputMask lags with last symbol in input
        const isNumberValid = isPhoneNumberValid(e.target.value);
        setPhoneNumber(() => e.target.value);

        if (isNumberValid) {
            checkUserStatus(e.target.value);
        }
    };

    const onSubmit = async () => {
        const req = await fetch('/api/newCups', {
            method: 'PUT',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({
                phoneNumber,
                cupsQuantity
            })
        })
        .then(res => res.json());

        if (req.statusCode === 200) {
            setModalData(() => ({
                ...initModalData,
                isOpen: true,
                header: 'Успех!',
                text: `У пользователя сейчас ${req.result.cupsQuantity} чашек`,
                onConfirm: () => {
                    setModalData(() => ({ ...initModalData, isOpen: false }));
                    history.push('/');
                }
            }));
        } else {
            setModalData(() => ({
                ...initModalData,
                isOpen: true,
                header: 'Ошибка!',
                text: 'Что-то пошло не так!',
                onConfirm: () => setModalData(() => ({ ...initModalData, isOpen: false }))
            }));
        }
    }

    const onFreeCupConfirm = async () => {
        const req = await fetch('/api/restoreCups', {
            method: 'PUT',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ phoneNumber })
        })
        .then(res => res.json());

        if (req.statusCode !== 200) {
            setModalData(() => ({
                ...initModalData,
                isOpen: true,
                header: 'Ошибка!',
                text: 'Что-то пошло не так!',
                onConfirm: () => setModalData(() => ({ ...initModalData, isOpen: false }))
            }));
        } else {
            setModalData(() => ({ ...initModalData, isOpen: false }));
        }
    }

    return (
        <div className="column">
            <MaskedInput
                className="input"
                // onChange={onPhoneNumberChange}
                onBlur={onPhoneNumberChange}
                value={phoneNumber}
                mask={phoneNumberMask}
            />
            <p className="tooltip_small">Номер телефона</p>
            {
                canAddCups &&
                <div className="column">
                    <input
                        className="input"
                        placeholder="Сколько взял чашек сейчас?"
                        value={cupsQuantity}
                        onChange={onCupsQuantityChange}
                    />
                    <button
                        style={{marginTop: 60}}
                        className="link"
                        disabled={isButtonDisabled}
                        onClick={onSubmit}
                    >
                        Зарегистрировать
                    </button>
                </div>
            }
            <CustomModal
                isOpen={modalData.isOpen}
                header={modalData.header}
                text={modalData.text}
                onConfirm={modalData.onConfirm}
                onConfirmText={modalData.onConfirmText}
                onCancel={modalData.onCancel}
                onCancelText={modalData.onCancelText}
            />
        </div>
    );
}