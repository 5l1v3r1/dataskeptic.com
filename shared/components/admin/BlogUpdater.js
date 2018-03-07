import React, { Component } from "react"
import { connect } from "react-redux"
import { submit } from "redux-form"
import styled from "styled-components"
import moment from "moment"

import BlogUpdateForm, { FORM_KEY } from "./BlogUpdateForm"
import BlogListItem from "../../Blog/Components/BlogListItem"

const normalizeDate = d => moment(d).format("YYYY-MM-DD")

const fakeClick = e => {
  e.preventDefault()
  e.stopPropagation()
}

class BlogUpdater extends Component {
  state = {
    details: false,
    edit: false
  }

  toggle = () =>
    this.setState(prevState => ({
      details: !prevState.details
    }))

  startEditing = () => this.setState({ edit: true })
  finishEditing = () => this.setState({ edit: false })

  save = async () => {
    await this.props.dispatch(submit(FORM_KEY))
    this.finishEditing()
  }

  onSave = data => {
    console.log(data)
    const { blog_id, title, abstract, author, publish_date } = data

    const { dispatch } = this.props

    console.dir({
      type: "CMS_UPDATE_BLOG",
      payload: {
        blog_id,
        title,
        abstract,
        author,
        publish_date,
        dispatch
      }
    })
  }

  delete = () => {
    const { dispatch, blog: { blog_id } } = this.props

    dispatch({ type: "CMS_DELETE_BLOG", payload: { blog_id, dispatch } })
  }

  renderPreview() {
    const { blog, contributors } = this.props
    const contributor = contributors[blog.author.toLowerCase()] || {}

    return (
      <Preview>
        <BlogListItem
          blog={blog}
          contributor={contributor}
          onClick={fakeClick}
        />
      </Preview>
    )
  }

  render() {
    const { details, edit } = this.state
    const { odd, blog } = this.props
    const { blog_id, prettyname } = blog

    blog.publish_date = normalizeDate(blog.publish_date)

    return (
      <Wrapper odd={odd}>
        <code>
          <pre>
            {JSON.stringify({
              t: blog.title,
              a: blog.abstract
            })}
          </pre>
        </code>
        <Inner>
          <Heading>
            <Label>
              ID: <ID>{blog_id}</ID>
            </Label>
            <Value>
              {!edit && (
                <EditButton onClick={this.startEditing}>Edit</EditButton>
              )}
            </Value>
          </Heading>
          <Row>
            <Label>Prettyname:</Label>
            <Value>
              <input
                type="text"
                defaultValue={`https://dataskeptic.com/blog${prettyname}`}
                readOnly={true}
              />
            </Value>
          </Row>

          {edit ? (
            <Editing>
              <Form
                onSubmit={this.onSave}
                showSubmit={false}
                allowSubmit={true}
                submitValue={"Add"}
                initialValues={blog}
              />

              <Buttons>
                <SaveButton onClick={this.save}>Save</SaveButton>
                <DeleteButton onClick={this.delete}>Delete</DeleteButton>
              </Buttons>
            </Editing>
          ) : (
            this.renderPreview()
          )}

          {details && <Details>related</Details>}
        </Inner>
        <ShowRelatedButton onClick={this.toggle}>
          {details ? "Discard " : "Edit related Content"}
        </ShowRelatedButton>
      </Wrapper>
    )
  }
}
export default connect(state => ({
  contributors: state.site.get("contributors")
}))(BlogUpdater)

const Wrapper = styled.div`
  background: #ffffff;
  margin-bottom: 12px;
  border: 1px solid #e1e3e2;
  display: flex;
  flex-direction: column;

  ${props =>
    props.odd &&
    `
    background: #F9FAF9;
  `} ${props =>
      props.open &&
      `
    background: rgba(240, 217, 67, 0.1);
  `};
`

const Inner = styled.div`
  padding: 20px 30px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
`

const Label = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`

const Value = styled.div`
  flex: 1;

  > input {
    width: 100%;
  }
`

const Editing = styled.div`
  display: flex;
  flex-direction: column;
  
  textarea {
    min-height: 200px;
  }
`

const Preview = styled.div``

const Form = styled(BlogUpdateForm)`
  display: flex;
  flex-direction: column;
`

const Heading = Row.extend`
  font-size: 24px;
  color: #2d1454;

  height: 60px;
`

const ID = styled.span`
  color: #000;
`

const Buttons = Row.extend`
  justify-content: flex-end;
`

const ActionButton = styled.button`
  width: 160px;
  height: 40px;
  font-size: 16px;
  color: #fff;
  border: none;
  border-radius: 5px;
`

const EditButton = ActionButton.extend`
  margin-left: 10px;
  background: #f0d943;
  display: inline-block;
  height: 27px;
`

const SaveButton = ActionButton.extend`
  background: #2ecb70;
  margin-right: 12px;
`

const DeleteButton = ActionButton.extend`
  background: #e74c3c;
  opacity: 0.7;
  
  &:hover {
    opacity: 1;
  }
`

const Details = styled.div`
  padding-top: 60px;
`

const ShowRelatedButton = styled.button`
  display: flex;
  height: 50px;
  justify-content: center;
  border: none;
`
