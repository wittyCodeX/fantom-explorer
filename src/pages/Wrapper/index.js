import React from 'react'
import components from 'components'
import services from 'services'
const Wrapper = (props) => {
  return (
    <>
      <components.Navbar />
      <div
        className="min-h-screen text-white  bg-gray-400 w-full flex justify-center w-screen p-2"
        style={{
          backgroundImage: `url(${services.linking.static(
            'images/abstract-shapes-20.svg',
          )})`,
        }}
      >
        {props.children}
      </div>
      <components.Footer />
    </>
  )
}

export default Wrapper
