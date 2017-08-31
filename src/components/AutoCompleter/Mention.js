import React, { Component } from 'react'
import immutable, { Record, List } from 'immutable'

import createMentionPlugin from './draft-js-mention-plugin'

import * as Github from '../../dataSources/Github'

import './draft-js-mention-plugin/plugin.css'

const MentionRecord = Record(
  {
    name: '',
    link: 'https://github.com',
    avatar: 'https://avatars3.githubusercontent.com/u/583231?v=4'
  },
  'MentionRecord'
)

export const instance = createMentionPlugin({ mentionPrefix: '@', mentionTrigger: '@' })

export default class Mention extends Component {
  state = {
    suggestions: immutable.fromJS([])
  }

  constructor(props) {
    super(props)

    this.instance = props.instance
  }

  onSearch = async ({ value }) => {
    const result = await Github.users(value)
    const users = result.reduce((list, r) => {
      return r.get('link') && r.get('name') && r.get('avatar')
        ? list.push(new MentionRecord(r))
        : list
    }, List())

    this.setState(state => {
      return {
        suggestions: users
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
