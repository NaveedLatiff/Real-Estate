"use client"

import Card from "../components/Card.jsx"
import { useEffect, useState } from "react"
import Axios from "../../../axios.js"
import { useAuth } from "../context/AuthContext.jsx"
import { useRouter } from "next/navigation"

const Page = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { authLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return
    if (!user) router.replace("/")
  }, [user, authLoading])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await Axios.get("/post/my-posts")
      setPosts(res.data.posts)
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="w-full min-h-screen overflow-y-scroll scrollbar-hide px-4 md:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto py-6">

        <h1 className="text-3xl font-bold mb-2 dark:text-white">
          My <span className="text-purple-600 dark:text-purple-400">Posts</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          Manage your property listings
        </p>

        <div className="flex flex-col">
          {loading ? (
            <div className="flex flex-col gap-4 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 py-4 border-b border-gray-100 dark:border-gray-800">
                  <div className="w-52 h-44 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse w-1/2" />
                    <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-gray-400 dark:text-gray-600 text-sm">You have no posts yet</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">
                {posts.length} listing{posts.length !== 1 && "s"}
              </p>
              {posts.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default Page