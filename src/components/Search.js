import React from 'react'

export default function Search() {
  return (
    <div class="flex justify-center items-center">
      <div class="col-md-6">
        <div class="search">
          <i class="fa fa-search"></i>
          <input
            id="inputBlok"
            type="text"
            class="form-control"
            placeholder="Search by only Block Number"
          />
          <button class="btn btn-primary" onclick="btnSearchBlock()">
            Search
          </button>
        </div>
      </div>
    </div>
  )
}
