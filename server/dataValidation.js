function hasSpecChar(string) {
    // functions checks is string has any unallowed characters from specChars list
    const specChars = /[!"#$%&'()*+,-./0123456789:;<=>?@[\]^_`{|}~€‚„†‡‰‹¨ˇ¸‘’“”•–—™›¯˛¢£¤¦§Ø©Ŗ«¬®Æ°±²³´µ¶·ø¹ŗ»¼½¾æ÷˙]/;
    return specChars.test(string);
}

export { hasSpecChar };