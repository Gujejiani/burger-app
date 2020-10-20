import React, { Component } from 'react';
import Button from '../../components/UI/Button/Button'
import Input from '../../components/UI/Input/Input'
import classes from './Auth.css'
import {connect} from 'react-redux'
import * as action   from '../../store/actions/index'
import Spinner from '../../components/UI/Spinner/Spinner'

import{ Redirect} from 'react-router-dom'
class Auth extends Component {
    state = {
        controls: {
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Email Addres'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            password: {
                elementType: 'input',
                elementConfig: {
                    type: 'password',
                    placeholder: 'Enter Password'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 6
                },
                valid: false,
                touched: false
            },
        },
        isSignup: true,
    }

inputChangedHandler = (event, controlName)=>{
  const updatedControls = {
      ...this.state.controls,
      [controlName]: {
          ...this.state.controls[controlName],
          value: event.target.value,
          valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
         touched: true,
     
        }
  };
  this.setState({controls: updatedControls})

}

checkValidity(value, rules) {
    let isValid = true;
    if (!rules) {
        return true;
    }
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    if (rules.maxLength) {
        isValid = value.length <= rules.maxLength && isValid
    }

    if (rules.isEmail) {
        const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        isValid = pattern.test(value) && isValid
    }

    if (rules.isNumeric) {
        const pattern = /^\d+$/;
        isValid = pattern.test(value) && isValid
    }

    return isValid;
}

submitHandler = (event)=>{

    event.preventDefault() //not To reload page
    this.props.onAuth(this.state.controls.email.value, this.state.controls.password.value, this.state.isSignup)
}
switchAuthModeHandler = () =>{
    this.setState(prevState=>{
        return{isSignup: !prevState.isSignup}
    })
}

componentDidMount(){
    if(this.props.isAuthenticated !=='/' && !this.props.building){
        this.props.onsetAuthRedirectPath()
    }
}
    render(){
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }
        const form = formElementsArray.map(formElement=>(
            <Input key={formElement.id} 
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event) => this.inputChangedHandler(event, formElement.id)}
            />
            
        ))
        
         let showCase =(
            <form onSubmit={this.submitHandler} >
            {form}
            <div className={classes.Container} >
                <Button  btnType="Btn"  >Submit</Button>
        
                </div>
                </form>
         )   

         if(this.props.loading){
            showCase = <Spinner/>
         }   
         let errorMessage = null
         if(this.props.error){
            errorMessage = (
            <p>{this.props.error.message}</p>
            )
         }
        
         if(this.props.error && this.props.error.message ==="EMAIL_EXISTS"){
             errorMessage=(
             <p>Sorry this Email is already Exists, please Sign In</p>
             )
         }

        return (
            <div className={classes.ContactData} >
                 {errorMessage}
               {showCase}
           

                <Button clicked={this.switchAuthModeHandler}
           btnType="Danger" >Switch to {this.state.isSignup? "SIGN IN": 'SIGN UP'}</Button>

           {this.props.isAuthenticated? <Redirect to={this.props.authRedirectPath} />:null}
            </div>
        )

    }
}
const mapStateToProps = state =>{
    return{
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !==null,
        building: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath,
    }
}


const mapDispatchStateToProps = dispatch =>{
    return{
        onAuth: (email, password, isSignup)=> dispatch(action.auth(email, password, isSignup)),
        onsetAuthRedirectPath: ()=> dispatch(action.setAuthRedirectPath('/'))
    }
}


export default connect(mapStateToProps, mapDispatchStateToProps)(Auth)