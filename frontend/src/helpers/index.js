export const isPhoneNumberValid = phoneNumber => {
    const hasNoUndelines = phoneNumber.split('').every(letter => letter !== '_');
    const hasRightLength = phoneNumber.length === 17;
    
    if (hasNoUndelines && hasRightLength) {
        return true;
    }
    return false;
};

export const phoneNumberMask = ['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

export const initModalData = {
    isOpen: false,
    header: '',
    text: '',
    onConfirm: undefined,
    onConfirmText: undefined,
    onCancel: undefined,
    onCancelText: undefined
};

export const ENOUGH_TO_GET_FREE_CUP = 6;