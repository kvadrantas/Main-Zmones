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

        function hasSpecChar(string) {
            // functions checks is string has any unallowed characters from specChars list
            const vardas = document.getElementById('vardas').value;
            const specChars = /[!"#$%&'()*+,-./0123456789:;<=>?@[\]^_`{|}~€‚„†‡‰‹¨ˇ¸‘’“”•–—™›¯˛¢£¤¦§Ø©Ŗ«¬®Æ°±²³´µ¶·ø¹ŗ»¼½¾æ÷˙]/;
            if (specChars.test(string)) prompt('Vardas negali būti tuščias arba turėti spec simbolių ar skaičių!');
            // return specChars.test(string);
        }
        
        // export { hasSpecChar };