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
    <div className="flex h-screen overflow-hidden">
      <div className="flex-3 h-full overflow-y-scroll scrollbar-hide px-4 md:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-6">
          <Filter />
          
          <div className="flex flex-col py-2.5 gap-4">
            {loading ? (
              <p>Loading...</p>
            ) : (

              posts.map((item) => (
                <Card key={item.id} item={item} />
              ))
            )
}
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:flex-2 bg-zinc-100 dark:bg-zinc-900 h-full relative">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={1}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution="&copy OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* {posts.map((item) => (
            <Pin key={item.id} item={item} />
          ))} */}
        </MapContainer>
      </div>
    </div>
  )
}

export default Page
