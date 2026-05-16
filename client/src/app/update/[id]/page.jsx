"use client"
import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import Axios from "../../../../axios.js"
import { useAuth } from "@/app/context/AuthContext.jsx"
import Loader from "@/app/components/Loader.jsx"

const Page = ({ params }) => {
  const router = useRouter()
  const { id } = React.use(params)
  const { authLoading, user } = useAuth()

  useEffect(() => {
    if (authLoading) return
    if (!user) router.replace("/login")
  }, [user, authLoading])

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    address: "",
    city: "",
    bedroom: "",
    bathroom: "",
    latitude: "",
    longitude: "",
    type: "",
    property: "",
  })

  const [postDetail, setPostDetail] = useState({
    desc: "",
    utilities: "",
    pet: "",
    income: "",
    size: "",
    school: "",
    bus: "",
    restaurant: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setFetching(true)
        const res = await Axios.get(`/post/${id}`)
        if (res.data.success) {
          const post = res.data.post
          setFormData({
            title: post.title || "",
            price: post.price || "",
            address: post.address || "",
            city: post.city || "",
            bedroom: post.bedroom || "",
            bathroom: post.bathroom || "",
            latitude: post.latitude || "",
            longitude: post.longitude || "",
            type: post.type || "",
            property: post.property || "",
          })
          if (post.PostDetail) {
            setPostDetail({
              desc: post.PostDetail.desc || "",
              utilities: post.PostDetail.utilities || "",
              pet: post.PostDetail.pet || "",
              income: post.PostDetail.income || "",
              size: post.PostDetail.size || "",
              school: post.PostDetail.school || "",
              bus: post.PostDetail.bus || "",
              restaurant: post.PostDetail.restaurant || "",
            })
          }
        } else {
          toast.error(res.data.message)
          router.push("/")
        }
      } catch (err) {
        toast.error("Failed to fetch post")
        router.push("/")
      } finally {
        setFetching(false)
      }
    }

    fetchPost()
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDetailChange = (e) => {
    setPostDetail({ ...postDetail, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await Axios.put(`/post/${id}`, {
        ...formData,
        postDetail,
      })
      if (res.data.success) {
        toast.success("Post updated successfully")
        router.push(`/${id}`)
      } else {
        toast.error(res.data.message)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update post")
    } finally {
      setIsLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="h-screen flex items-center justify-center">
        ]<Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-8 lg:px-16">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-3xl font-bold mb-2 dark:text-white">
          Update{" "}
          <span className="text-purple-600 dark:text-purple-400">Post</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-10">
          Edit the details below to update your property listing
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">

          <div>
            <h2 className="text-lg font-semibold dark:text-white mb-4">Property Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Title</label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Modern apartment in city center"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Price</label>
                <input
                  name="price"
                  type="number"
                  placeholder="e.g. 1200"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">City</label>
                <input
                  name="city"
                  type="text"
                  placeholder="e.g. New York"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Address</label>
                <input
                  name="address"
                  type="text"
                  placeholder="e.g. 123 Main Street"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Bedroom</label>
                <input
                  name="bedroom"
                  type="number"
                  placeholder="e.g. 2"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={formData.bedroom}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Bathroom</label>
                <input
                  name="bathroom"
                  type="number"
                  placeholder="e.g. 1"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={formData.bathroom}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Type</label>
                <select
                  name="type"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer dark:text-white"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Property</label>
                <select
                  name="property"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer dark:text-white"
                  value={formData.property}
                  onChange={handleChange}
                >
                  <option value="">Select property</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="land">Land</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Latitude</label>
                <input
                  name="latitude"
                  type="text"
                  placeholder="e.g. 40.7128"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Longitude</label>
                <input
                  name="longitude"
                  type="text"
                  placeholder="e.g. -74.0060"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold dark:text-white mb-4">Post Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Description</label>
                <textarea
                  name="desc"
                  rows={4}
                  placeholder="Describe your property..."
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white resize-none"
                  value={postDetail.desc}
                  onChange={handleDetailChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Utilities</label>
                <select
                  name="utilities"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer dark:text-white"
                  value={postDetail.utilities}
                  onChange={handleDetailChange}
                >
                  <option value="">Select</option>
                  <option value="owner">Owner is responsible</option>
                  <option value="tenant">Tenant is responsible</option>
                  <option value="shared">Shared</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Pet Policy</label>
                <select
                  name="pet"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer dark:text-white"
                  value={postDetail.pet}
                  onChange={handleDetailChange}
                >
                  <option value="">Select</option>
                  <option value="allowed">Allowed</option>
                  <option value="not-allowed">Not Allowed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Income Policy</label>
                <input
                  name="income"
                  type="text"
                  placeholder="e.g. Must earn 3x rent"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={postDetail.income}
                  onChange={handleDetailChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Total Size (sqft)</label>
                <input
                  name="size"
                  type="number"
                  placeholder="e.g. 850"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={postDetail.size}
                  onChange={handleDetailChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">School (meters)</label>
                <input
                  name="school"
                  type="number"
                  placeholder="e.g. 500"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={postDetail.school}
                  onChange={handleDetailChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Bus Stop (meters)</label>
                <input
                  name="bus"
                  type="number"
                  placeholder="e.g. 200"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={postDetail.bus}
                  onChange={handleDetailChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1 block">Restaurant (meters)</label>
                <input
                  name="restaurant"
                  type="number"
                  placeholder="e.g. 300"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-gray-400 dark:text-white"
                  value={postDetail.restaurant}
                  onChange={handleDetailChange}
                />
              </div>

            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 text-white font-semibold text-sm tracking-wide shadow-lg shadow-purple-500/20 dark:shadow-purple-900/40 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block" />
            ) : (
              "Save Changes"
            )}
          </button>

        </form>
      </div>
    </div>
  )
}

export default Page