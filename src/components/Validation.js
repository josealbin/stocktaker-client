export default function Validation(values){
    let errors = {};

    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!values.email){
        errors.email = "Email is required."
    }else if(!email_pattern.test(values.email)){
        errors.email = "Invalid Email!"
    }


    if(!values.password){
        errors.password = "Email is required."
    }

    return errors;
}