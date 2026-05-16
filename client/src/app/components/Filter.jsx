"use client";
import { useState } from "react";
import { HiSearch } from "react-icons/hi";
import Axios from "../../../axios";

const Filter = ({ onResults, onSearch }) => {
  const [city, setCity] = useState("");
  const [type, setType] = useState("any");
  const [property, setProperty] = useState("any");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (city) params.append("city", city);
      if (type !== "any") params.append("type", type);
      if (property !== "any") params.append("property", property);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (bedroom) params.append("bedroom", bedroom);

      console.log("params:", params.toString());

      const res = await Axios.get(`/post/filter?${params.toString()}`);

       console.log("response:", res.data); 

      if (res.data.success) {
        onResults(res.data.posts);
        if (onSearch) onSearch(city);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 font-poppins mb-6">
      <h1 className="text-2xl font-light font-roboto dark:text-white">
        Search results for <b className="text-purple-700 font-extrabold underline">{city || "All"}</b>
      </h1>

      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1" htmlFor="city">Location</label>
        <input
          className="border border-gray-300 p-2 rounded w-full outline-none dark:bg-zinc-900 dark:text-white placeholder:text-gray-400"
          type="text"
          id="city"
          placeholder="City Location"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1" htmlFor="type">Type</label>
          <select
            className="border border-gray-300 p-2 rounded outline-none text-sm"
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="any">any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1" htmlFor="property">Property</label>
          <select
            className="border border-gray-300 p-2 rounded outline-none text-sm"
            id="property"
            value={property}
            onChange={(e) => setProperty(e.target.value)}
          >
            <option value="any">any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1" htmlFor="minPrice">Min Price</label>
          <input
            className="border border-gray-300 p-2 rounded outline-none text-sm placeholder:text-gray-400"
            type="number"
            id="minPrice"
            placeholder="any"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1" htmlFor="maxPrice">Max Price</label>
          <input
            className="border border-gray-300 p-2 rounded outline-none text-sm placeholder:text-gray-400"
            type="number"
            id="maxPrice"
            placeholder="any"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-500 mb-1" htmlFor="bedroom">Bedroom</label>
          <input
            className="border border-gray-300 p-2 rounded outline-none text-sm placeholder:text-gray-400"
            type="number"
            id="bedroom"
            placeholder="any"
            value={bedroom}
            onChange={(e) => setBedroom(e.target.value)}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-purple-500 cursor-pointer transition-colors p-3 rounded flex items-center justify-center text-white h-[42px] disabled:opacity-50"
        >
          <HiSearch size={20} />
        </button>
      </div>
    </div>
  );
};

export default Filter;