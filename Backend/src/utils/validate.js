exports.validateEmail = (email) => {
    const res = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email)
}