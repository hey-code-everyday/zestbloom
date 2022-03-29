import * as Yup from 'yup';

export const signUpValidation = Yup.object({
    firstName: Yup.string().required('Name is a required'),
    lastName: Yup.string().required('Surname is a required.'),
    username: Yup.string('Enter your username')
        .min(3, 'Username should be of minimum 3 characters length')
        .required('Username is required'),
    email: Yup.string('Enter your email')
        .email('Enter a valid email')
        .required('Email is required'),
    password: Yup.string('Enter your password')
        .min(6, 'Password should be of minimum 8 characters length')
        .required('Password is required')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*?])(?=.{8,})/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
        ),
    confirmPassword: Yup.string('Enter password confirmation')
        .required('Password confirmation is required')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});
