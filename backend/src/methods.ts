import fs from 'fs';
import path from 'path';

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

export function getUser(user: User) {
    if (user instanceof User) {
        try {
            const allUsers: User[] = JSON.parse(
                fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf-8')
            );
            const foundUser = allUsers.find(
                dbUser => dbUser.phoneNumber === user.phoneNumber
            );
            if (foundUser) {
                return new Response(true, 200, foundUser);
            }
            return new Response(false, 404);
        } catch (error) {
            return new Response(false, 400, undefined, error);
        }
    } else {
        return new Response(false, 400, undefined, 'user validation failed');
    }
}

export function changeUser(user: User) {
    if (user instanceof User) {
        try {
            const allUsers: User[] = JSON.parse(
                fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf-8')
            );
            const isUserFound = allUsers.find(
                dbUser => dbUser.phoneNumber === user.oldPhoneNumber
            );

            if (isUserFound) {
                const editedDB = allUsers.map(dbUser => {
                    if (dbUser.phoneNumber === user.oldPhoneNumber) {
                        return {
                            name: dbUser.name,
                            phoneNumber: user.phoneNumber,
                            cupsQuantity: dbUser.cupsQuantity,
                        };
                    }
                    return dbUser;
                });
                const editedUser = editedDB.find(
                    dbUser => dbUser.phoneNumber === user.phoneNumber
                );

                fs.writeFileSync(
                    path.resolve(__dirname, './db.json'),
                    JSON.stringify(editedDB)
                );

                return new Response(true, 200, editedUser);
            } else {
                return new Response(false, 404, undefined, 'user not found');
            }
        } catch (error) {
            return new Response(false, 400, undefined, error);
        }
    } else {
        return new Response(false, 400, undefined, 'user validation failed');
    }
}

export function newUser(user: User) {
    if (user instanceof User) {
        try {
            const allUsers: User[] = JSON.parse(
                fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf-8')
            );
            const isUserAlreadyExists = allUsers.find(
                dbUser => dbUser.phoneNumber === user.phoneNumber
            );

            if (!isUserAlreadyExists) {
                const editedDB = [
                    ...allUsers,
                    {
                        name: user.name,
                        phoneNumber: user.phoneNumber,
                        cupsQuantity: user.cupsQuantity,
                    },
                ];
                const newUser = editedDB.find(
                    dbUser => dbUser.phoneNumber === user.phoneNumber
                );

                fs.writeFileSync(
                    path.resolve(__dirname, './db.json'),
                    JSON.stringify(editedDB)
                );

                return new Response(true, 200, newUser);
            } else {
                return new Response(
                    false,
                    400,
                    isUserAlreadyExists,
                    'пользователь с таким номером уже есть в базе'
                );
            }
        } catch (error) {
            return new Response(false, 400, undefined, error);
        }
    } else {
        return new Response(false, 400, undefined, 'user validation failed');
    }
}

export function newCups(user: User) {
    if (user instanceof User) {
        try {
            const allUsers: User[] = JSON.parse(
                fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf-8')
            );
            const foundUser: User = allUsers.find(
                dbUser => dbUser.phoneNumber === user.phoneNumber
            );
            const editedDB = allUsers.map(dbUser => {
                if (dbUser.phoneNumber === user.phoneNumber) {
                    return {
                        ...dbUser,
                        cupsQuantity:
                            user.cupsQuantity + foundUser.cupsQuantity,
                    };
                }
                return dbUser;
            });

            const changedUser: User = editedDB.find(
                dbUser => dbUser.phoneNumber === user.phoneNumber
            );

            fs.writeFileSync(
                path.resolve(__dirname, './db.json'),
                JSON.stringify(editedDB)
            );

            return new Response(true, 200, changedUser);
        } catch (error) {
            return new Response(false, 400, undefined, error);
        }
    } else {
        return new Response(false, 400, undefined, 'user validation failed');
    }
}

export function restoreCups(phoneNumber: string) {
    try {
        const allUsers: User[] = JSON.parse(
            fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf-8')
        );
        const foundUser = allUsers.find(
            dbUser => dbUser.phoneNumber === phoneNumber
        );
        let leftCups: number;

        if (foundUser.cupsQuantity === ENOUGH_TO_GET_FREE_CUP) {
            const updatedDB = allUsers.map(dbUser => {
                if (foundUser.phoneNumber === phoneNumber) {
                    return {
                        name: dbUser.name,
                        phoneNumber: dbUser.phoneNumber,
                        cupsQuantity: 0,
                    };
                }
                return dbUser;
            });
            fs.writeFileSync(
                path.resolve(__dirname, './db.json'),
                JSON.stringify(updatedDB)
            );

            return new Response(true, 200, { ...foundUser, cupsQuantity: 0 });
        } else if (foundUser.cupsQuantity > ENOUGH_TO_GET_FREE_CUP) {
            const updatedDB = allUsers.map(dbUser => {
                if (foundUser.phoneNumber === phoneNumber) {
                    leftCups = dbUser.cupsQuantity - ENOUGH_TO_GET_FREE_CUP;
                    dbUser.cupsQuantity -= ENOUGH_TO_GET_FREE_CUP;
                    // return { name: dbUser.name, phoneNumber: dbUser.phoneNumber, cupsQuantity: dbUser.cupsQuantity - ENOUGH_TO_GET_FREE_CUP };
                }
                return dbUser;
            });
            fs.writeFileSync(
                path.resolve(__dirname, './db.json'),
                JSON.stringify(updatedDB)
            );

            return new Response(true, 200, {
                ...foundUser,
                cupsQuantity: leftCups,
            });
        }
    } catch (error) {
        return new Response(false, 400, undefined, error);
    }
}

export function removeMistakes(cups: number, phoneNumber: string) {
    try {
        const allUsers: User[] = JSON.parse(
            fs.readFileSync(path.resolve(__dirname, './db.json'), 'utf-8')
        );
        const foundUser = allUsers.find(
            dbUser => dbUser.phoneNumber === phoneNumber
        );

        if (foundUser) {
            const editedUser: User = {...foundUser, cupsQuantity: foundUser.cupsQuantity - cups};
            const updatedDB = allUsers.map(dbUser => {
                if (dbUser.phoneNumber === phoneNumber) {
                    return editedUser;
                }
                return dbUser;
            });
            console.log(updatedDB)

            fs.writeFileSync(
                path.resolve(__dirname, './db.json'),
                JSON.stringify(updatedDB)
            );

            return new Response(true, 200, editedUser);
        } else {
            return new Response(false, 404, undefined, 'user not found');
        }
    } catch (error) {}
}
