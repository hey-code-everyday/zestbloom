import * as Yup from 'yup';
import { passwordValidation } from './constants';

export const changePasswordValidation = () =>
    Yup.object({
        oldPassword: passwordValidation,
        newPassword: passwordValidation,
        repeatPassword: Yup.string('Enter password confirmation')
            .required('Password confirmation is required')
            .oneOf([Yup.ref('newPassword'), null], 'New passwords must match'),
    });
