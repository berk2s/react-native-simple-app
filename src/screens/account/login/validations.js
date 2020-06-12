import * as Yup from 'yup';

const validations = Yup.object().shape({
   phoneNumber:Yup
       .string()
       .min(16)
       .max(16)
       .required('!'),
    password:Yup
        .string()
        .min(4)
        .required('!')
});

module.exports = validations;
