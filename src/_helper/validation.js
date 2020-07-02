const checkValidation = (value, rules) => {
    //   required
    if (rules.matchString) {
        const rule = value.trim() === rules.matchString;
        if (!rule) {
            return "password does not match";
        }
    }
    //   required
    if (rules.required) {
        const rule = value.trim() !== "";
        if (!rule) {
            return "can't be blank";
        }
    }
    // min length
    if (rules.minLength) {
        const rule = value.length >= rules.minLength;
        if (!rule) {
            return `must not be shorter than ${rules.minLength}`;
        }
    }
    // max length
    if (rules.maxLength) {
        const rule = value.length <= rules.maxLength;
        if (!rule) {
            return `must not be longer than ${rules.maxLength}`;
        }
    }
    // is string
    if (rules.string) {
        const rule = /^([a-zA-Z ]*)$/.test(value);
        if (!rule) {
            return "some characters are not allowed";
        }
    }
    // no spaces
    if (rules.spaces) {
        const rule = /^([^ ]*)$/.test(value);
        if (!rule) {
            return "spaces are not allowd";
        }
    }
    // is number
    if (rules.number) {
        const rule = /^(\d*)$/.test(value);
        if (!rule) {
            return "must be a number";
        }
    }
    return "";
};

export default checkValidation;
