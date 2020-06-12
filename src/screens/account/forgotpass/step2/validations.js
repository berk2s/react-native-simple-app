import * as Yup from 'yup';

const validations = Yup.object().shape({
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
