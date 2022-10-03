import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import components from 'components'
import { timestampToDate, formatDate } from 'utils'
import moment from 'moment'
import services from 'services'
import { async } from 'q'

export default function Domain() {
  const params = useParams()
  const [domain, setDomain] = useState([])

  useEffect(() => {
    async function isRegisterdDomain(name) {
      let address
      try {
        const api = services.provider.buildAPI()
        address = await api.getReverseRecords(domain)
      } catch {
        address = '0x0'
      }
      if (address != '0x0') {
        location.href = '/address/' + address
      }
    }
    async function loadDomainData(name) {
      const api = services.provider.buildAPI()
      const data = await api.loadDomain(name)
      setDomain(data)
    }
    isRegisterdDomain(params.id)
    loadDomainData(params.id)
  }, [params.id])

  return (
    <div>
      <components.TableView
        classes="w-screen max-w-5xl"
        title={`Domain`}
        dontNeedSubtitle={true}
      >
        <components.DynamicTable>
          {!domain ? (
            <tr>
              <td>
                <components.Loading />
              </td>
            </tr>
          ) : (
            <>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Domain:
                  </div>
                  <div className="col-span-2">{domain.domain}</div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Status:
                  </div>
                  <div className="col-span-2">{domain.status}</div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Owner:
                  </div>
                  <div className="col-span-2">
                    <Link
                      to={`/address/${domain.owner}`}
                      className="text-blue-500 dark:text-gray-300"
                    >
                      {domain.owner}
                    </Link>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="grid grid-flow-row-dense grid-cols-3 border-b p-3">
                  <div className="sm:block small text-secondary ml-1 ml-sm-0 text-nowrap">
                    Expires At:
                  </div>
                  <div className="col-span-2">
                    {`(${formatDate(timestampToDate(domain.expiresAt))})`}
                  </div>
                </td>
              </tr>
            </>
          )}
        </components.DynamicTable>
      </components.TableView>
    </div>
  )
}
