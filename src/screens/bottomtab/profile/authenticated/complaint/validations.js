import * as Yup from 'yup';

const validations = Yup.object().shape({
   order:Yup
       .string()
       .required(),
   complaint:Yup
       .string()
       .min(50, 'Daha detaylı yazınız')
       .required('Bu alan gerekli')
});
