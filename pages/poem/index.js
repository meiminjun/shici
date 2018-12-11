import React, { Component } from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import _ from 'lodash'

import App from '../../components/App'
import QR from '../../components/QR'
import Card from '../../components/Card'
import Paragraph from '../../components/Paragraph'

import Author from './Author'

const POEM = gql`
  query POEM ($uuid: ID!) {
    poem (uuid: $uuid) {
      id
      uuid
      title
      intro
      paragraphs
      appreciation
      translation
      kind
      annotations
      author {
        name
        dynasty
        birthYear
        deathYear
        intro
      }
    }
  }
`

class Poem extends Component {
  static async getInitialProps({ query }) {
    return query
  }

  renderIntro () {
    const { poem: { intro }, loading } = this.props
    return intro && (
      <Card loading={loading}>
        <h3>简析</h3>
        <p>{ intro }</p>
      </Card>
    )
  }

  renderAppreciation () {
    const { poem: { appreciation }, loading } = this.props
    return appreciation && (
      <Card loading={loading}>
        <h3>赏析</h3>
        { _.map(appreciation, (t, index) => <p key={index}>{t}</p>) }
      </Card>
    )
  }

  renderTranslation () {
    const { poem: { translation }, loading } = this.props
    return translation && (
      <Card loading={loading}>
        <h3>翻译</h3>
        { _.map(translation, (t, index) => <p key={index}>{t}</p>) }
      </Card>
    )
  }

  renderAnnotations () {
    const { poem: { annotations = [] }, loading } = this.props
    return annotations.length ? (
      <Card loading={loading}>
        <h3>注释</h3>
        <ul>
          { _.map(annotations, (a, index) => (
            <li key={index}>
              <p>
                <i>{a.key}:</i> {a.value}
              </p>
            </li>
          ))}
        </ul>
      </Card>
    ) : ''
  }

  render () {
    const { poem, loading } = this.props
    return (
      <App title={poem.title}>
        <style jsx>{`
          .container {
            display: flex;
          }

          .poem {
            flex-grow: 1;
          }

          .side {
            flex-basis: 300px; 
            flex-shrink: 0;
            margin-left: 20px;
          }
        `}</style>
      <div className="container">
        <div className="poem">
          <Card loading={loading}>
            <h2>
              { poem.title }
            </h2>
            <div>
              { _.get(poem, 'author.dynasty') }·{ _.get(poem, 'author.name') }
            </div>
            <div>
              {
                _.map(poem.paragraphs, (p, index) => (
                  <p key={index}>
                    { p } 
                  </p>
                ))
              }
            </div>
          </Card>
          { this.renderAnnotations() }
          <Paragraph text={poem.translation} title="翻译" loading={loading} />
          <Paragraph text={poem.intro} title="简介" loading={loading} />
          <Paragraph text={poem.appreciation} title="赏析" loading={loading} />
        </div>
        <div className="side">
          <Card loading={loading}>
            <Author author={poem.author || {}} />
          </Card>
          <QR />
        </div>
      </div>
    </App>
    )
  }
}

export default compose(
  graphql(POEM, {
    options ({ uuid }) {
      return {
        variables: {
          uuid
        }
      }
    },
    props ({ data, ...rest }) {
      return {
        poem: data.poem || {},
        loading: data.loading
      } 
    }
  })
)(Poem)
