import React from 'react'

export default props => {
  return (
    <section {...props}>
      <h2>Usage</h2>
      <h3>
        <b>@</b> - Will return a list of github users
      </h3>
      <p />

      <h3>
        <b>#</b> - Will return a list of repositories
      </h3>
      <p />

      <h3>
        <b>{`<>`}</b> - Will return a list of related topics
      </h3>
      <p />
    </section>
  )
}
