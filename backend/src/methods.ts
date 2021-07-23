import { UserModel } from './models';

const ENOUGH_TO_GET_FREE_CUP = 6;

export class User {
    phoneNumber: string;
    name: string;
    cupsQuantity?: number;
    oldPhoneNumber?: string;

    constructor(
        phoneNumber: string,
        name: string,
        oldPhoneNumber?: string,
        cupsQuantity?: number
    ) {
        this.phoneNumber = phoneNumber;
        this.name = name;
        this.oldPhoneNumber = oldPhoneNumber;
        this.cupsQuantity = cupsQuantity;
    }
}

export class Response {
    success: boolean;
    statusCode: number;
    result: User;
    error?: any;

    constructor(
        success: boolean,
        statusCode: number,
        result?: User,
        error?: any
    ) {
        this.success = success;
        this.statusCode = statusCode;
        this.result = result;
        this.error = error;
    }
}

export async function getUser(user: User) {
    if (user instanceof User) {
        const foundUser = await UserModel.findOne({
            phoneNumber: user.phoneNumber,
        });

        if (foundUser) {
            return new Response(true, 200, foundUser);
        } else {
            return new Response(false, 404);
        }
    } else {
        return new Response(false, 400, undefined, 'user validation failed');
    }
}

export async function changeUser(user: User) {
    if (user instanceof User) {
        const operationResult = await UserModel.findOneAndUpdate(
            { phoneNumber: user.oldPhoneNumber },
            { phoneNumber: user.phoneNumber },
            { new: true }
        );

        if (operationResult) {
            return new Response(true, 200, operationResult);
        } else {
            return new Response(false, 400, operationResult);
        }
    } else {
        return new Response(false, 400, undefined, 'user validation failed');
    }
}

export async function newUser(user: User) {
    if (user instanceof User) {
        const isPhoneNumberFound = await UserModel.findOne({
            phoneNumber: user.phoneNumber,
        });

        if (isPhoneNumberFound) {
            return new Response(
                false,
                400,
                isPhoneNumberFound,
                'пользователь с таким номером уже есть в базе'
            );
        } else {
            const operationResult = await UserModel.create({
                name: user.name,
                phoneNumber: user.phoneNumber,
                cupsQuantity: user.cupsQuantity,
            });

            if (operationResult) {
                return new Response(true, 200, operationResult);
            } else {
                return new Response(false, 400, operationResult);
            }
        }
    } else {
        return new Response(false, 400, undefined, 'user validation failed');
    }
}

export async function newCups(user: User) {
    if (user instanceof User) {
        const foundUser = await UserModel.findOne({
            phoneNumber: user.phoneNumber,
        });
        const updatedUser = await UserModel.findOneAndUpdate(
            { phoneNumber: user.phoneNumber },
            { cupsQuantity: user.cupsQuantity + foundUser.cupsQuantity },
            { new: true }
        );

        if (updatedUser) {
            return new Response(true, 200, updatedUser);
        } else {
            return new Response(false, 400, updatedUser);
        }
    } else {
        return new Response(false, 400, undefined, 'user validation failed');
    }
}

export async function restoreCups(phoneNumber: string) {
    const foundUser = await UserModel.findOne({ phoneNumber });

    if (foundUser) {
        const operationResult = await UserModel.findOneAndUpdate(
            { phoneNumber },
            { cupsQuantity: foundUser.cupsQuantity - ENOUGH_TO_GET_FREE_CUP },
            { new: true }
        );

        return new Response(true, 200, operationResult);
    } else {
        return new Response(false, 400, foundUser);
    }
}

export async function removeMistakes(cups: number, phoneNumber: string) {
    const foundUser = await UserModel.findOne({ phoneNumber });
    const operationResult = await UserModel.findOneAndUpdate(
        { phoneNumber },
        { cupsQuantity: foundUser.cupsQuantity - cups },
        { new: true }
    );

    return new Response(true, 200, operationResult);
}

export async function deleteUser(phoneNumber: string) {
    const operationResult = await UserModel.findOneAndDelete({ phoneNumber });

    return new Response(true, 200, operationResult);
}
