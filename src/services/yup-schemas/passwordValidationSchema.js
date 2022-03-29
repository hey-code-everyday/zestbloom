import * as Yup from 'yup';

export const passwordValidationSchema = Yup.object({
    password: Yup.string('Enter your password')
        .min(8, 'Password should be of minimum 8 characters length')
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
        ),
    confirmPassword: Yup.string('Enter password confirmation')
        .required('Password confirmation is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});
