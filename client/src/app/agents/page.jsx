"use client"
import { useEffect, useState } from "react"
import Axios from "../../../axios"
import Link from "next/link"

const Page = () => {
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await Axios.get("/auth/users")
        setAgents(res.data.users)
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAgents()
  }, [])

  return (
    <div className="min-h-screen px-4 sm:px-8 py-12">
      <div className="max-w-5xl mx-auto">

        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-purple-500 dark:text-purple-400 mb-2">
          Our Agents
        </p>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Meet the <span className="text-purple-600 dark:text-purple-400">Agents</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
          Browse our active property listers
        </p>

        <div className="h-px bg-gray-100 dark:bg-gray-800 mb-10" />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="flex items-center gap-4 p-5 border border-gray-100 dark:border-gray-800 rounded-2xl">
                <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded animate-pulse w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : agents.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <p className="text-sm text-gray-400 dark:text-gray-600">No agents found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center gap-4 p-5 border border-gray-100 dark:border-gray-800 rounded-2xl hover:border-purple-200 dark:hover:border-purple-900 transition-colors"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0 flex items-center justify-center">
                  {agent.profile ? (
                    <img src={agent.profile} alt={agent.userName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-semibold text-gray-400 dark:text-gray-600">
                      {agent.userName?.[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                    {agent.userName}
                  </p>

                  <p className="text-xs text-gray-400 dark:text-gray-600 truncate mt-0.5">
                    {agent.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Page