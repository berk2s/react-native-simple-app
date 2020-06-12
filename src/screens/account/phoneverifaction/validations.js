import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
   code:Yup
       .string()
       .min(1)
       .max(20)
       .required()
});

module.exports = validationSchema
