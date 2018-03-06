import React, { Component } from "react"
import moment from "moment"
import { Link } from "react-router"
import {
  Container,
  Title,
  BlogItem,
  ItemDate,
  ItemTitle,
  ItemDesc,
  ViewMore,
  Author,
  Details,
  Avatar,
  Name,
  Contribution
} from "./style"

import AuthorLink from "../../../components/AuthorLink"

const BlogBox = props => {
  const { blogList, getContributor } = props
  return (
    <div>
      {blogList.map((item, index) => {
        let href = "blog" + item.prettyname
        const author = getContributor(item)
        author.contribution = 'Co-producer'
        return (
          <BlogItem key={index}>
            <ItemDate>{moment(item.publish_date).format("MMMM D, Y")}</ItemDate>
            <Link to={href}>
              <ItemTitle>{item.title}</ItemTitle>
            </Link>
            <ItemDesc>{item.abstract}</ItemDesc>
            <ViewMore to={href}>View More</ViewMore>
            {author && (
              <AuthorLink author={author.author}>
                <Author>
                  <Avatar src={author.img} />
                  <Details>
                    <Name>{author.prettyname}</Name>
                    {author.contribution && (
                      <Contribution>{author.contribution}</Contribution>
                    )}
                  </Details>
                </Author>
              </AuthorLink>
            )}
          </BlogItem>
        )
      })}
    </div>
  )
}

class Blog extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { blogList, getContributor } = this.props
    return (
      <Container>
        <Title>From the Blog</Title>
        <BlogBox blogList={blogList} getContributor={getContributor} />
      </Container>
    )
  }
}

export default Blog
