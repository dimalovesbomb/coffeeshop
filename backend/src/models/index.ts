import { Schema, model } from 'mongoose';

interface User {
    _id?: string;
    name: string;
    cupsQuantity: number;
    phoneNumber: string;
}

const userSchema = new Schema<User>({
    name: { type: String, required: true },
    cupsQuantity: { type: Number , required: true },
    phoneNumber: { type: String, required: true, unique: true }
});

export const UserModel = model<User>('users', userSchema);