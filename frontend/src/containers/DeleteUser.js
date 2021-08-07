import React, { useState } from 'react';
import MaskedInput from 'react-text-mask';
import { CustomModal } from './Modal';
import { Loader } from './Loader';
import { isPhoneNumberValid, phoneNumberMask, initModalData, proxy } from '../helpers';
import { useHistory } from 'react-router';

export const DeleteUser = () => {
    const [phoneNumber, setPhoneNumber] = useState('+7');
    const [modalData, setModalData] = useState(initModalData);
    const [isLoading, setIsLoading] = useState(false);
    const history = useHistory();

    const checkUserStatus = async value => {
        const isNumberValid = isPhoneNumberValid(value);

        if (isNumberValid && value !== '') {
            setIsLoading(() => true);
            const userData = await fetch(
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
                        onConfirm: () =>
                            setModalData(() => ({
                                ...initModalData,
                                isOpen: false,
                            })),
                    }));
                });
            setIsLoading(() => false);

            if (userData.statusCode === 200) {
                setModalData(() => ({
                    ...initModalData,
                    isOpen: true,
                    header: 'Успех!',
                    text: `Точно удалить пользователя ${userData.result.name} с номером ${userData.result.phoneNumber}? Потом не получится восстановить!`,
                    onCancel: () => {
                        setModalData(() => ({
                            ...initModalData,
                            isOpen: false,
                        }));
                    },
                    onCancelText: 'Не удалять',
                    onConfirm: () => {
                        deleteUserHandler(value);
                        setModalData(() => ({ ...initModalData }));
                    },
                    onConfirmText: 'Удалить',
                }));
            } else {
                setModalData(() => ({
                    ...initModalData,
                    isOpen: true,
                    header: 'Внимание!',
                    text: 'Пользователь с таким номером не найден!',
                    onConfirm: () =>
                        setModalData(() => ({
                            ...initModalData,
                            isOpen: false,
                        })),
                }));
            }
        }
    };

    const deleteUserHandler = async phoneNumber => {
        setIsLoading(() => true);

        const req = await fetch(`${proxy}/api/deleteUser`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber }),
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
                text: `Пользователя ${req.result.name} с номером ${req.result.phoneNumber} больше нет в базе. Восстановить не получится.`,
                onConfirm: () => {
                    setModalData(() => ({ ...initModalData }));
                    history.push('/');
                },
            }));
        } else {
            setModalData(() => ({
                ...initModalData,
                isOpen: true,
                header: 'Внимание!',
                text: 'Что-то пошло не так (backend)!',
                onConfirm: () =>
                    setModalData(() => ({ ...initModalData })),
            }));
        }
    };

    const onPhoneNumberChange = e => {
        const isNumberValid = isPhoneNumberValid(e.target.value);
        setPhoneNumber(() => e.target.value);

        if (isNumberValid) {
            setPhoneNumber(() => e.target.value);
            checkUserStatus(e.target.value);
        }
    };

    return (
        <div className="column">
            <MaskedInput
                className="input"
                type="tel"
                onChange={onPhoneNumberChange}
                value={phoneNumber}
                mask={phoneNumberMask}
            />
            <p className="tooltip_small">Номер телефона клиента</p>
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
