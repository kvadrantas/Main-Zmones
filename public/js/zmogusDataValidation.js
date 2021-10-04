// *****************************************************************************
// DATA VALIDATION IMPORT
// import {hasSpecChar} from './'
// *****************************************************************************


// const vardas = document.getElementById('vardas').value;
// const pavarde = req.body.pavarde;
// const gimData = new Date(req.body.gimData);
// const alga = parseFloat(req.body.alga);
// if (typeof vardas !== 'string' || vardas.trim() === '' || hasSpecChar(vardas)) {
//     throw 'Vardas negali būti tuščias arba turėti spec simbolių ar skaičių!';
// } else if (typeof pavarde !== 'string' || pavarde.trim()  == '' || hasSpecChar(pavarde)) {
//     throw 'Pavardė negali būti tuščia arba turėti spec simbolių ar skaičių!';
// } else if (!isFinite((gimData).getTime())) {
//     throw 'Blogai nurodyta gimimo data!';
// } else if(isFinite(alga)) 

function hasSpecChar(id, name) {
    // functions checks is string has any unallowed characters from specChars list
    const field = document.getElementById(id).value;
    const specChars = /[!"#$%&'()*+,-./0123456789:;<=>?@[\]^_`{|}~€‚„†‡‰‹¨ˇ¸‘’“”•–—™›¯˛¢£¤¦§Ø©Ŗ«¬®Æ°±²³´µ¶·ø¹ŗ»¼½¾æ÷˙]/;

    if (specChars.test(field) || field.trim() === '') alert(`${name} negali būti tuščias(tuščia) arba turėti spec simbolių ar skaičių!`);
    console.log(vardas, specChars.test(vardas));
}

function checkAlga() {
    const alga = document.getElementById('alga').value;
    if (alga) {
        if (!isFinite(alga) || alga < 0) alert('Alga negali būti neigiama arba begalinė');
    }
}

function dataIsValid() {
    const vardas = document.getElementById('vardas').value;
    const pavarde = document.getElementById('pavarde').value;
    const alga = document.getElementById('alga').value;

    const specChars = /[!"#$%&'()*+,-./0123456789:;<=>?@[\]^_`{|}~€‚„†‡‰‹¨ˇ¸‘’“”•–—™›¯˛¢£¤¦§Ø©Ŗ«¬®Æ°±²³´µ¶·ø¹ŗ»¼½¾æ÷˙]/;

    dataIsValid = specChars.test(vardas) && specChars.test(pavarde) &&
        vardas === 'string' && vardas.trim() !== '' &&
        pavarde === 'string' && pavarde.trim() !== '' &&
        isFinite((gimData).getTime());

    if (alga) {
        if (!isFinite(alga) || alga < 0) alga = false;
    } else {
        alga = 'NULL';
    }
}


// export { dataIsValid };