import { HiSearch } from "react-icons/hi";

const Filter = () => {
  return (
    <div className="flex flex-col gap-3 font-poppins mb-6">
      <h1 className="text-2xl font-light font-roboto dark:text-white">
        Search results for <b className="text-purple-700 font-extrabold underline">London</b>
      </h1>
      
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1" htmlFor="city">Location</label>
        <input 
          className="border border-gray-300 p-2 rounded w-full outline-none dark:bg-zinc-900 dark:text-white placeholder:text-gray-400"
          type="text" 
          id="city" 
          placeholder="City Location" 
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
        {[
          { label: "Type", id: "type", options: ["any", "Buy", "Rent"] },
          { label: "Property", id: "property", options: ["any", "Apartment", "House", "Condo"] },
          { label: "Min Price", id: "minPrice", type: "number" },
          { label: "Max Price", id: "maxPrice", type: "number" },
          { label: "Bedroom", id: "bedroom", type: "number" },
        ].map((field) => (
          <div key={field.id} className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1" htmlFor={field.id}>{field.label}</label>
            {field.options ? (
              <select className=" border border-gray-300 p-2 rounded outline-none text-sm " id={field.id}>
                {field.options.map(opt => <option className="text-black" key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : (
              <input 
                className="border border-gray-300 p-2 rounded outline-none text-sm  placeholder:text-gray-400"
                type={field.type} 
                id={field.id} 
                placeholder="any"
              />
            )}
          </div>
        ))}
        <button className="bg-purple-500 cursor-pointer transition-colors p-3 rounded flex items-center justify-center text-white h-[42px]">
          <HiSearch size={20} />
        </button>
      </div>
    </div>
  );
};

export default Filter;