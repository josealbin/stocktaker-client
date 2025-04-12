export default function Validation(values){
    let errors = {};

    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!values.email){
        errors.email = "Email should not be empty."
    }else if(!email_pattern.test(values.email)){
        errors.email = "Invalid Email!"
    }
    return errors;
}