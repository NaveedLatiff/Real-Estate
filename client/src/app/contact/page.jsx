"use client"

const ContactPage = () => {
  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-xl mx-auto">

        <p className="text-xs font-semibold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-3">
          Contact
        </p>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Get in touch
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-10">
          Have a question or need help with a listing? We're here for you. Reach out through any of the channels below and we'll get back to you as soon as possible.
        </p>

        <div className="h-px bg-gray-100 dark:bg-gray-800 mb-10" />

        <div className="space-y-6">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">Email</p>
            <a href="mailto:support@lamaestate.com" className="text-sm text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              support@lamaestate.com
            </a>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">Phone</p>
            <a href="tel:+18001234567" className="text-sm text-gray-800 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              +92 310 2331695
            </a>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">Office</p>
            <p className="text-sm text-gray-800 dark:text-gray-200">
              123 Estate Avenue, New York, NY 10001
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">Hours</p>
            <p className="text-sm text-gray-800 dark:text-gray-200">Monday – Friday, 9am to 6pm EST</p>
          </div>

        </div>

      </div>
    </div>
  )
}

export default ContactPage