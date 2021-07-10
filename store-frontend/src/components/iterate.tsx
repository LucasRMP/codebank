import React from 'react'

interface Props<T> {
  data: T[]
  keyExtractor: (item: T) => any
  render: React.ComponentType<{ data: T }>
}

function Iterate<T>({ data, keyExtractor, render: Render }: Props<T>) {
  return (
    <>
      {data.map((item) => (
        <Render key={keyExtractor(item)} data={item} />
      ))}
    </>
  )
}

export default Iterate
