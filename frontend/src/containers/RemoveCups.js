import React, { useState } from 'react';
import MaskedInput from 'react-text-mask';
import { CustomModal } from './Modal';
import { Loader } from './Loader';
import { phoneNumberMask, isPhoneNumberValid, initModalData, proxy } from '../helpers';
import { useHistory } from 'react-router';

export const RemoveCups = () => {
    const [phoneNumber, setPhoneNumber] = useState('+7');
    const [isUserFound, setIsUserFound] = useState(false);
    const [cupsQuantity, setCupsQuantity] = useState('');
    const [modalData, setModalData] = useState(initModalData);
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const checkUserStatus = async value => {
        const isNumberValid = isPhoneNumberValid(value);

        if (isNumberValid && value !== '') {
            setIsLoading(() => true);
            const req = await fetch(
                `${proxy}/api/getUser?phoneNumber=${encodeURIComponent(value)}`,
                {
                    headers: { 'Content-Type': 'application/json' },
                }
            )
                .then(res => res.json())
                .catch(err => {
                    setIsLoading(() => false);
                    setModalData(() => ({
                        ...initModalData,
                        isOpen: true,
                        header: 'Упс!',
                        text: `Ничего страшного вроде, но стоит проверить. ${err}`,
                        onConfirm: () => setModalData(() => ({ ...initModalData })),
                    }));
                });
            setIsLoading(() => false);

            if (req.statusCode === 200) {
                setModalData(() => ({
                    ...initModalData,
                    isOpen: true,
                    header: '',
                    text: `У клиента ${req.result.cupsQuantity} купленных чашек КАК ЗАПИСАНО В БАЗЕ.`,
                    onConfirm: () => setModalData(() => ({ ...initModalData })),
                }));
                setIsUserFound(() => true);
            } else {
                setModalData(() => ({
                    ...initModalData,
                    isOpen: true,
                    header: 'Внимание!',
                    text: 'Пользователь с таким номером не найден!',
                    onConfirm: () => setModalData(() => ({ ...initModalData })),
                }));
            }
        } else {
            setIsUserFound(() => false);
        }
    };

    const onPhoneNumberChange = e => {
        const isNumberValid = isPhoneNumberValid(e.target.value);
        setPhoneNumber(() => e.target.value);

        if (isNumberValid) {
            checkUserStatus(e.target.value);
        }
    };

    const onPhoneNumberBlur = e => setPhoneNumber(() => e.target.value);

    const onCupsQuantityChange = e => {
        e.target.value === ''
            ? setIsButtonDisabled(() => true)
            : setIsButtonDisabled(() => false);

        if (!isNaN(e.target.value)) {
            setCupsQuantity(() => e.target.value);
        } else {
            setModalData(() => ({
                ...initModalData,
                isOpen: true,
                header: 'Ошибка!',
                text: 'Не, в это поле можно только цифры!',
                onConfirm: () => setModalData(() => ({ ...initModalData })),
            }));
            setCupsQuantity(() => '');
            setIsButtonDisabled(() => true);
        }
    };

    const onSubmit = async () => {
        setIsLoading(() => true);
        const req = await fetch(`${proxy}/api/removeMistakes`, {
            headers: { 'Content-Type': 'application/json' },
            method: 'PUT',
            body: JSON.stringify({
                phoneNumber,
                cupsQuantity: +cupsQuantity,
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
                    onConfirm: () => setModalData(() => ({ ...initModalData })),
                }));
            });
        setIsLoading(() => false);

        if (req.statusCode === 200) {
            setModalData(() => ({
                ...initModalData,
                isOpen: true,
                header: 'Успех!',
                text: `Удалили лишнего, теперь у пользователя ${req.result.cupsQuantity} чашек`,
                onConfirm: () => {
                    setModalData(() => ({ ...initModalData }));
                    history.push('/');
                },
            }));
        } else {
            setModalData(() => ({
                ...initModalData,
                isOpen: true,
                header: 'Упс!',
                text: `Что-то пошло не так`,
                onConfirm: () => setModalData(() => ({ ...initModalData })),
            }));
        }
    };

    return (
        <div className="column">
            <MaskedInput
                className="input"
                type="tel"
                onBlur={onPhoneNumberBlur}
                mask={phoneNumberMask}
                value={phoneNumber}
                onChange={onPhoneNumberChange}
            />
            <p className="tooltip_small">Номер телефона</p>

            {isUserFound && (
                <div className="column">
                    <input
                        className="input"
                        placeholder="Сколько чашек скрутить?"
                        value={cupsQuantity}
                        onChange={onCupsQuantityChange}
                    />
                    <button
                        style={{ marginTop: 60 }}
                        className="link"
                        disabled={isButtonDisabled}
                        onClick={onSubmit}
                    >
                        Зарегистрировать
                    </button>
                </div>
            )}
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
