import * as Yup from 'yup';

const validations = Yup.object().shape({
    title_address: Yup
        .string('!')
        .min(2, 'Daha uzun olmalı')
        .max(10, 'Daha kısa olmalı')
        .required('Gerekli'),
    address:Yup
        .string('!')
        .min(10, 'Daha uzun olmalı')
        .max(200, 'Daha kısa olmalı')
        .required( 'Gerekli'),
    province:Yup
        .string('!')
        .required( 'Gerekli'),
    county:Yup
        .string( '!')
        .required( 'Gerekli')
});

module.exports = validations;
