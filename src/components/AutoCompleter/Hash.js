import React, { Component } from 'react'
import immutable, { Record, List } from 'immutable'

import createMentionPlugin, { defaultSuggestionsFilter } from './draft-js-mention-plugin'

import * as Github from '../../dataSources/Github'

import './draft-js-mention-plugin/plugin.css'

const HashRecord = Record(
  {
    name: ''
  },
  'HashRecord'
)

export const instance = createMentionPlugin({ mentionPrefix: '#', mentionTrigger: '#' })

export default class Hash extends Component {
  state = {
    suggestions: immutable.fromJS([])
  }

  constructor(props) {
    super(props)

    this.instance = props.instance
  }

  onSearch = async ({ value }) => {
    const result = await Github.repositories(value)
    const repositories = result.reduce(((list, r) => list.push(new HashRecord(r)): list), List())

    this.setState(state => {
      return {
        suggestions: defaultSuggestionsFilter(value, repositories)
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
