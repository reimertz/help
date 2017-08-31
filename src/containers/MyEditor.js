import React, { Component } from 'react'

import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'

import Mention, { instance as mentionInstance } from '../components/AutoCompleter/Mention'
import Hash, { instance as hashInstance } from '../components/AutoCompleter/Hash'
import Relation, { instance as relationInstance } from '../components/AutoCompleter/Relation'

export default class MyEditor extends Component {
  state = {
    editorState: EditorState.createEmpty()
  }

  onChange = editorState => {
    this.setState({
      editorState
    })
  }

  focus = () => {
    this.editor.focus()
  }

  componentDidMount() {}

  render() {
    return (
      <div className="editor" onClick={this.focus}>
        <Editor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={[hashInstance, mentionInstance, relationInstance]}
          ref={element => {
            this.editor = element
          }}
        />

        <Mention instance={mentionInstance} />
        <Hash instance={hashInstance} />
        <Relation instance={relationInstance} />
      </div>
    )
  }
}
