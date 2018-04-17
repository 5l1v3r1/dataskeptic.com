import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import AddJob, { tomorrow } from '../../Jobs/Forms/AddJob'
import styled from 'styled-components'
import { container, strictForm } from '../../styles'
import { changePageTitle } from '../../Layout/Actions/LayoutActions'

class PublicAddJob extends Component {
  state = {
    initialValues: {
      go_live_date: tomorrow.format('YYYY-MM-DD')
    },
    advertise: null
  }

  static getPageMeta() {
    return {
      title: 'Add Job | Data Skeptic'
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { title } = PublicAddJob.getPageMeta()

    dispatch(changePageTitle(title))
  }

  redirect = to => this.props.history.push(to)

  addProduct = (details) => {
    const title = `Job add "${details.title}"`

    const product = {
      ...this.state.advertise,
      title,
      details
    }

    this.props.dispatch({
      type: 'ADD_TO_CART',
      payload: { product }
    })
  }

  handleSubmit = product => {
    this.addProduct(product)
    this.redirect('/checkout')
  }

  changeAdvertise = advertise => this.setState({ advertise })

  render() {
    const { history, error, success, request } = this.props
    const { initialValues, advertise } = this.state

    return (
      <Container history={history}>
        <h3>Add job</h3>

        <Wrapper>
          <AddJob
            customError={error}
            onSubmit={this.handleSubmit}
            showSubmit={true}
            showAdvertiseOptions={true}
            allowSubmit={!request}
            submitValue={request ? 'Processing...' : 'Add'}
            initialValues={initialValues}
            customSuccess={success ? 'Job added.' : null}
            changeAdvertise={this.changeAdvertise}
          />
        </Wrapper>
      </Container>
    )
  }
}
export default connect(state => ({
  error: state.admin.getIn(['jobs', 'error']),
  request: state.admin.getIn(['jobs', 'request']),
  success: state.admin.getIn(['jobs', 'success'])
}))(PublicAddJob)

const Container = styled.div`
  ${container};
`

const Wrapper = styled.div`
  ${strictForm};
`