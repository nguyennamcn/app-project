import React from 'react'
import { useSelector } from 'react-redux'
import { ClimbingBoxLoader } from 'react-spinners'

export default function Spinner() {
  let {isLoading} = useSelector((state)=>state.spinnerSlice);
  return isLoading ? (
    <div
    style={{background:"#E74646"}}
    className="h-screen w-screen fixed top-0 left-0 flex justify-center items-center z-50">
      <ClimbingBoxLoader color="#FFE5CA" size={50}
      speedMultiplier={2}
      />
    </div>
  ) : (
    <></>
  )
}
