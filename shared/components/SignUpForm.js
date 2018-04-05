import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { renderField } from '../Forms/Components/Field/Field'
import FormController from '../Forms/Components/FormController/FormController'

const SignUpForm = ({
  handleSubmit,
  pristine,
  reset,
  submitting,
  invalid,
  submitSucceeded,
  submitFailed
}) => (
  <FormController
    name="login"
    handleSubmit={handleSubmit}
    submitValue={<span>Sign Up</span>}
    showSubmit={true}
    btnWrapperClasses={'col-xs-12 col-sm-12'}
  >
    <Field
      label="Email"
      component={renderField}
      name="email"
      type="email"
      className="contact-name"
      placeholder="j.smith@work.com"
      autoComplete="false"
      labelWrapperClasses="col-xs-12 col-sm-12"
      inputWrapperStyles="col-xs-12 col-sm-12"
      required
    />
    <Field
      label="Password"
      component={renderField}
      name="password"
      type="password"
      className="contact-name"
      placeholder="password"
      autoComplete="false"
      labelWrapperClasses="col-xs-12 col-sm-12"
      inputWrapperStyles="col-xs-12 col-sm-12"
      required
    />
  </FormController>
)

export default reduxForm({
  form: 'signUpForm'
})(SignUpForm)
