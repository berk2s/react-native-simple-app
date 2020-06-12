import * as Yup from 'yup'

const validations = Yup.object().shape({
    nameSurname:Yup
        .string()
        .min(3, '!')
        .max(30, '!')
        .required('!'),
    emailAddress:Yup
        .string()
        .email('!')
        .required('!'),
    phoneNumber:Yup
        .string()
        .min(11, '!')
        .required('!'),
    password:Yup
        .string()
        .min(4, '!')
        .required('!'),
    passwordConfirm:Yup
        .string()
        .oneOf([Yup.ref('password')], '!')
        .required('!')
});

module.exports = validations;
