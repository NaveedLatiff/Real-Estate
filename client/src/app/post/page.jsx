"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Axios from "../../../axios";
import { useAuth } from "../context/AuthContext";

const Page = () => {
  const router = useRouter();
  const { authLoading, user } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!user) router.replace("/");
  }, [user, authLoading]);

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
  });

  const [postDetail, setPostDetail] = useState({
    desc: "",
    utilities: "",
    pet: "",
    income: "",
    size: "",
    school: "",
    bus: "",
    restaurant: "",
  });

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDetailChange = (e) => {
    setPostDetail({ ...postDetail, [e.target.name]: e.target.value });
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
        setPreviews((prev) => [...prev, reader.result]);
      };
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await Axios.post("/post/", {
        ...formData,
        images,
        postDetail,
      });
      if (res.data.success) {
        toast.success("Post created successfully");
        router.push("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-8 lg:px-16 bg-white dark:bg-black text-black dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 dark:text-white">
          Add New{" "}
          <span className="text-purple-600 dark:text-purple-400">
            Post
          </span>{" "}
        </h1>
        <p className="text-sm text-gray-500 dark: mb-10">
          Fill in the details below to list your property
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">
          <div>
            <h2 className="text-lg font-semibold dark:text-white mb-4">
              Images
            </h2>

            <div className="flex items-center gap-4 flex-wrap">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="relative group w-20 h-20 rounded-xl overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700 flex-shrink-0"
                >
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <label className="flex-shrink-0 w-20 h-20 flex flex-col items-center justify-center border border- border-purple-400 dark:border-purple-600 rounded-xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-950/30 transition-all">
                <span className="text-purple-400 dark:text-purple-500 text-xl leading-none">
                  +
                </span>
                <span className="text-[10px]  dark:text-gray-500 mt-1">
                  Add
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImages}
                />
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold dark:text-white mb-4">
              Property Info
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Title
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Modern apartment in city center"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Price
                </label>
                <input
                  name="price"
                  type="number"
                  placeholder="e.g. 1200"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  City
                </label>
                <input
                  name="city"
                  type="text"
                  placeholder="e.g. New York"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Address
                </label>
                <input
                  name="address"
                  type="text"
                  placeholder="e.g. 123 Main Street"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Bedroom
                </label>
                <input
                  name="bedroom"
                  type="number"
                  placeholder="e.g. 2"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={formData.bedroom}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Bathroom
                </label>
                <input
                  name="bathroom"
                  type="number"
                  placeholder="e.g. 1"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={formData.bathroom}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Type
                </label>
                <select
                  name="type"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-black  text-black dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Property
                </label>
                <select
                  name="property"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
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
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Latitude
                </label>
                <input
                  name="latitude"
                  type="text"
                  placeholder="e.g. 40.7128"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={formData.latitude}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Longitude
                </label>
                <input
                  name="longitude"
                  type="text"
                  placeholder="e.g. -74.0060"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={formData.longitude}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold dark:text-white mb-4">
              Post Details
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Description
                </label>
                <textarea
                  name="desc"
                  rows={4}
                  placeholder="Describe your property..."
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white resize-none"
                  value={postDetail.desc}
                  onChange={handleDetailChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Utilities
                </label>
                <select
                  name="utilities"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
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
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Pet Policy
                </label>
                <select
                  name="pet"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all cursor-pointer"
                  value={postDetail.pet}
                  onChange={handleDetailChange}
                >
                  <option value="">Select</option>
                  <option value="allowed">Allowed</option>
                  <option value="not-allowed">Not Allowed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Income Policy
                </label>
                <input
                  name="income"
                  type="text"
                  placeholder="e.g. Must earn 3x rent"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={postDetail.income}
                  onChange={handleDetailChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Total Size (sqft)
                </label>
                <input
                  name="size"
                  type="number"
                  placeholder="e.g. 850"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={postDetail.size}
                  onChange={handleDetailChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  School (meters)
                </label>
                <input
                  name="school"
                  type="number"
                  placeholder="e.g. 500"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={postDetail.school}
                  onChange={handleDetailChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Bus Stop (meters)
                </label>
                <input
                  name="bus"
                  type="number"
                  placeholder="e.g. 200"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
                  value={postDetail.bus}
                  onChange={handleDetailChange}
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark: mb-1 block">
                  Restaurant (meters)
                </label>
                <input
                  name="restaurant"
                  type="number"
                  placeholder="e.g. 300"
                  className="w-full border border-gray-200 dark:border-gray-700 bg-transparent rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder: dark:text-white"
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
              "Publish Post"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
