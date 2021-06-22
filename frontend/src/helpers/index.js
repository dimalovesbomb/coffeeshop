export const isPhoneNumberValid = phoneNumber => {
    const hasNoUndelines = phoneNumber.split('').every(letter => letter !== '_');
    const hasRightLength = phoneNumber.length === 17;
    
    if (hasNoUndelines && hasRightLength) {
        return true;
    }
    return false;
};

export const phoneNumberMask = ['+', '7', ' ', '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];