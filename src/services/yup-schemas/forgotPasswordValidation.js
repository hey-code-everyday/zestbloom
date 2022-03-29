import * as Yup from 'yup';

export const forgotPasswordValidation = Yup.object({
    email: Yup.string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
});
