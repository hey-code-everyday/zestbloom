import * as Yup from 'yup';

export const linkValidation = {
    REGEX_LINK:
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#_-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
    MESSAGE: 'Enter correct url!',
};

export const passwordValidation = Yup.string('Enter your password')
    .min(6, 'Password should be of minimum 8 characters length')
    .required('Password is required')
    .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    );
