// *****************************************************************************
// SERVER SIDE DATA VALIDATION
// *****************************************************************************

function dataIsValid() {
    const vardas = req.body.vardas;
    const pavarde = req.body.pavarde;
    const alga = req.body.alga;

    const specChars = /[!"#$%&'()*+,-./0123456789:;<=>?@[\]^_`{|}~€‚„†‡‰‹¨ˇ¸‘’“”•–—™›¯˛¢£¤¦§Ø©Ŗ«¬®Æ°±²³´µ¶·ø¹ŗ»¼½¾æ÷˙]/;

    const textFieldsAreValid = specChars.test(vardas) && specChars.test(pavarde) &&
        vardas === 'string' && vardas.trim() !== '' &&
        pavarde === 'string' && pavarde.trim() !== '' &&
        isFinite((gimData).getTime());

    if (alga) {
        if (!isFinite(alga) || alga < 0) const algaFieldIsValid = false;
    } else {
        alga = 'NULL';
    }

    return textFieldsAreValid && algaFieldIsValid;
}

export { dataIsValid };