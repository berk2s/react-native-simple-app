import * as Yup from 'yup';

const validations = Yup.object().shape({
    currentpassword:Yup
        .string()
        .required('Boş bırakmayın'),
    newpassword:Yup
        .string()
        .min(4, 'En az 4 hane gerekli')
        .required('Boş bırakmayın'),
    newpassword_verifaction:Yup
        .string()
        .oneOf([Yup.ref('newpassword')], 'Şifreler uyuşmuyor')
        .required('Boş bırakmayın')
});

module.exports = validations
