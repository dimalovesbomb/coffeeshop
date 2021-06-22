import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import MaskedInput from 'react-text-mask';
import { CustomModal } from './Modal';
import { isPhoneNumberValid, phoneNumberMask } from '../helpers';

export const ChangeUser = () => {
    const [oldPhoneNumber, setOldPhoneNumber] = useState('+7');
    const [newPhoneNumber, setNewPhoneNumber] = useState('+7');
    const [isUserFound, setIsUserFound] = useState(false);
    const [clientName, setClientName] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [modalData, setModalData] = useState({
        isOpen: false,
        header: '',
        text: '',
        onConfirm: () => undefined,
        onConfirmText: undefined,
        onCancel: () => undefined,
        onCancelText: undefined
    });
    const history = useHistory();

    const onOldPhoneNumberChange = async (e) => {
        const isNumberValid = isPhoneNumberValid(e.target.value);
        setOldPhoneNumber(() => e.target.value);
        
        if (isNumberValid) {
            const req = await fetch(`/api/getUser?phoneNumber=${encodeURIComponent(e.target.value)}`, {
                headers: { "Content-Type": "application/json"},
            })
            .then(res => res.json());

            if (req.statusCode === 200) {
                setIsUserFound(() => true);
                setClientName(() => req.result.name);
            } else {
                setIsUserFound(() => false);
                setModalData(() => ({
                    isOpen: true,
                    header: 'Внимание!',
                    text: 'Клиент с таким номером не найден!',
                    onConfirm: () => setModalData(() => ({...modalData, isOpen: false })),
                }))
            }

        }

    } 

    const onNewPhoneNumberChange = e => {
        const isNumberValid = isPhoneNumberValid(e.target.value);

        setNewPhoneNumber(() => e.target.value);
        
        isNumberValid ? setIsButtonDisabled(() => false) : setIsButtonDisabled(() => true);
    } 

    const onSubmit = async () => {
        const req = await fetch("/api/changeUser", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phoneNumber: newPhoneNumber,
            oldPhoneNumber,
          }),
        })
        .then(res => res.json());

        if (req.statusCode === 200) {
            setModalData(() => ({
                ...modalData,
                isOpen: true,
                header: 'Успех!',
                text: `Номер клиента ${req.result.name} успешно изменен. У клиента ${req.result.cupsQuantity} чашек`,
                onConfirm: () => {
                    setModalData(() => ({ ...modalData, isOpen: false }));
                    history.push('/');
                }
            }))
        } else {
            setModalData(() => ({
                ...modalData,
                isOpen: true,
                header: 'Внимание!',
                text: 'Что-то пошло не так!',
                onConfirm: () => setModalData(() => ({ ...modalData, isOpen: false }))
            }))
        }
    }

    return (
        <div className="column">
            <MaskedInput
                className="input"
                placeholder="Старый номер клиента"
                onChange={onOldPhoneNumberChange}
                value={oldPhoneNumber}
                mask={phoneNumberMask}
            />
            <p className="tooltip_small">Старый номер</p>
            {
                isUserFound && 
                <div className="column">
                    <p className="tooltip">Спроси, клиента зовут {clientName}?</p>
                    <MaskedInput
                        className="input"
                        onChange={onNewPhoneNumberChange}
                        value={newPhoneNumber}
                        mask={phoneNumberMask}
                    />
                    <p className="tooltip_small">Новый номер</p>
                    <button
                        style={{marginTop: 60}}
                        className="link"
                        onClick={onSubmit}
                        disabled={isButtonDisabled}
                        >
                            Изменить
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
    )

}