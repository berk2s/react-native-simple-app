import * as Yup from 'yup';

const validations = Yup.object().shape({
   phone_number: Yup
           .string()
           .min(11, '!')
           .required('!'),
});

module.exports = validations;
