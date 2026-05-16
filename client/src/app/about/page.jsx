"use client"

const AboutPage = () => {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-2xl mx-auto">

        <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-3">
          About Us
        </p>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          We help people find their perfect home
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-10">
          LamaEstate is a modern real estate platform built to make buying, renting, and listing properties simple and transparent. Whether you're a first-time renter or an experienced landlord, we give you the tools to get things done without the hassle.
        </p>

        <div className="h-px bg-gray-100 dark:bg-gray-800 mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">1,200+</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Active listings</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">800+</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Happy tenants</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">50+</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Cities covered</p>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800 my-10" />

        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Our mission</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          We believe finding a home should be straightforward. No hidden fees, no confusing processes , just clear listings, honest information, and a platform that works for everyone.
        </p>

      </div>
    </div>
  )
}

export default AboutPage