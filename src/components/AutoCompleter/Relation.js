import React, { Component } from 'react'
import immutable, { Record, List } from 'immutable'

import createMentionPlugin from './draft-js-mention-plugin'

import * as Github from '../../dataSources/Github'

import './draft-js-mention-plugin/plugin.css'

const RelationRecord = Record(
  {
    name: ''
  },
  'RelationRecord'
)

export const instance = createMentionPlugin({
  mentionPrefix: '<>',
  mentionTrigger: '<>'
})

export default class Relation extends Component {
  state = {
    suggestions: immutable.fromJS([])
  }

  constructor(props) {
    super(props)

    this.instance = props.instance
  }

  onSearch = async ({ value }) => {
    const result = await Github.relatedTopics(value)
    const topics = result.reduce((list, r) => list.push(new RelationRecord(r)), List())

    this.setState(state => {
      return {
        suggestions: topics
      }
    })
  }

  render() {
    const { instance } = this

    return (
      <instance.MentionSuggestions
        onSearchChange={this.onSearch}
        onAddMention={this.onAddMention}
        suggestions={this.state.suggestions}
      />
    )
  }
}
