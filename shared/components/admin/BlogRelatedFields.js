import React from "react"
import { Field, FieldArray, reduxForm } from "redux-form"
import FormController from "../../Forms/Components/FormController/FormController"
import {
  renderCheckbox,
  renderField,
  renderSelect,
  renderZip
} from "../../Forms/Components/Field"
import styled from "styled-components"

export const INTERNAL_LINK = "internal-link"
export const EXTERNAL_LINK = "external-link"
export const HOME_PAGE_IMAGE = "homepage-image"
export const BLOG_HEADER_IMAGE = "blog-header-img"
export const MP3 = "mp3"
export const PERSON = "person"
export const BLANK = "blank"

const validate = values => {
  let errors = {}

  return errors
}

const renderInternalLinkFields = member => (
  <div>
    internal-link
    <Field
      label="Title"
      component={renderField}
      name="title"
      type="text"
      required
    />
    <Field
      label="Comment"
      component={renderField}
      name="title"
      textarea
      required
    />
  </div>
)

const renderExternalLinkFields = member => (
  <div>
    external-link
    <Field
      label="Related page url"
      component={renderField}
      name="title"
      type="text"
      required
    />
    <Field
      label="Link Anchor Text"
      component={renderField}
      name="title"
      type="text"
      required
    />
    <Field
      label="Comment"
      component={renderField}
      name="title"
      type="text"
      required
    />
    <Field
      label="https://"
      component={renderField}
      name="title"
      type="text"
      required
    />
  </div>
)

const renderHomePageImageFields = member => (
  <div>
    homepage-image
    <Field
      label="Image url (400x400px)"
      component={renderField}
      name="title"
      type="text"
      required
    />
    <Field
      label="Alt text"
      component={renderField}
      name="title"
      type="text"
      required
    />
  </div>
)

const renderBlogHeaderImageFields = member => (
  <div>
    blog-header image
    <Field
      label="Media URL"
      component={renderField}
      name="title"
      type="text"
      required
    />
  </div>
)

const renderMp3Fields = member => (
  <div>
    mp3
    <Field
      label="Media URL"
      component={renderField}
      name="title"
      type="text"
      required
    />
    <Field
      label="Title of recording"
      component={renderField}
      name="title"
      type="text"
      required
    />
    <Field
      label="Description"
      component={renderField}
      name="title"
      textarea
      required
    />
    <Field
      label="https://dataskeptic.com/blog/"
      component={renderField}
      name="title"
      required
    />
  </div>
)

const renderPersonFields = member => (
  <div>
    person
    <Field label="IMG URL" component={renderField} name="title" required />
    <Field label="Guest Name" component={renderField} name="title" required />
    <Field label="Guest Bio" component={renderField} name="title" required />
  </div>
)

const renderBlankFields = member => <div />

const renderRelatedFields = (type, member) => {
  let fields

  switch (type) {
    case INTERNAL_LINK:
      fields = renderInternalLinkFields(member)
      break

    case EXTERNAL_LINK:
      fields = renderExternalLinkFields(member)
      break

    case HOME_PAGE_IMAGE:
      fields = renderHomePageImageFields(member)
      break

    case BLOG_HEADER_IMAGE:
      fields = renderBlogHeaderImageFields(member)
      break

    case MP3:
      fields = renderMp3Fields(member)
      break

    case PERSON:
      fields = renderPersonFields(member)
      break

    case BLANK:
      fields = renderBlankFields(member)
      break

    default:
      fields = renderBlankFields(member)
  }

  return (
    <RelatedFields>
      <Field
        name={`${member}.type`}
        component={renderSelect}
        label={"Type"}
        options={[
          { label: "Internal Link", value: INTERNAL_LINK },
          { label: "External Link", value: EXTERNAL_LINK },
          { label: "Homepage Image", value: HOME_PAGE_IMAGE },
          { label: "Blog Header Img", value: BLOG_HEADER_IMAGE },
          { label: "Music", value: MP3 },
          { label: "Person", value: PERSON },
          { label: "Blank", value: BLANK }
        ]}
      />

      <code>{JSON.stringify({ type })}</code>
      {fields}
    </RelatedFields>
  )
}

export const renderRelated = ({ fields, meta: { error, submitFailed } }) => (
  <RelatedEntries>
    {submitFailed && error && <span>{error}</span>}

    {fields.map((member, index) => (
      <RelatedEntry key={index}>
        <RelatedIndex>
          <span>Related #{index + 1}</span>
          
          <Field
            label="delete"
            fieldWrapperClasses={"delete"}
            name={`${member}.delete`}
            type="checkbox"
            component={renderCheckbox}
          />
        </RelatedIndex>
        {renderRelatedFields(fields.get(index).type, member)}
      </RelatedEntry>
    ))}

    <RelatedAddButton type="button" onClick={() => fields.push({})}>
      + Add Related
    </RelatedAddButton>
  </RelatedEntries>
)

const RelatedEntries = styled.div`
  margin: 20px 0px;
`

const RelatedEntry = styled.div``

const RelatedIndex = styled.div`
  span {
    font-weight: bold;
    margin-right: 10px;
  }

  .delete {
    background: red;
    
    label, p {
      padding: 0px;
      margin: 0px;
    }
  }

  display: flex;
  align-items: center;
`

const ActionButton = styled.button`
  font-weight: bold;
  color: #fff;
  border: none;
  border-radius: 5px;
`

const RelatedAddButton = ActionButton.extend`
  background: #f0d943;
  margin-top: 1em;
`

const RelatedRemoveButton = ActionButton.extend`
  height: 20px;
  font-size: 12px;
  background: #e74c3c;
`

const RelatedFields = styled.div``