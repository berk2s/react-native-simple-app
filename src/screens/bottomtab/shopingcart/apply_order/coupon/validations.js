import * as Yup from 'yup';

const validations = Yup.object().shape({
    coupon:Yup
        .string()
        .max(50, 'Gerçek bir kupon girin')
        .required('Kuponu boş bırakmayınız')
});

module.exports = validations;
