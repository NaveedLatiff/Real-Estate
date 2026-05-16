"use client"

import "../lib/leaflet"
import Filter from "../components/Filter.jsx"
import Card from "../components/Card.jsx"
import { MapContainer, TileLayer } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import Pin from "../components/Pin.jsx"
import { useEffect, useState } from "react"
import Axios from "../../../axios.js"

const Page = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await Axios.get("/post/")
      setPosts(res.data.posts)
      console.log(1)
    } catch (err) {
      console.log(err)
      console.log(2)
    } finally {
      setLoading(false)
      console.log(3)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    console.log(posts)
  }, [posts])

  return (
    <div className="flex h-screen ">

      <div className="flex-3 h-full  px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-6">

          <Filter onResults={setPosts} onSearch={(city) => console.log(city)} />

          <div className="mt-2">
            {loading ? (
              <div className="flex flex-col gap-4 mt-4">
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
                <p className="text-gray-400 dark:text-gray-600 text-sm">No listings found</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">{posts.length} listing{posts.length !== 1 && "s"} found</p>
                {posts.map((item) => (
                  <Card key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="hidden lg:block lg:flex-2 bg-zinc-100 dark:bg-zinc-900 h-full relative">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {posts.map((item) => (
            <Pin key={item.id} item={item} />
          ))}
        </MapContainer>
      </div>

    </div>
  )
}

export default Page