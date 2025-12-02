import {
  Shield,
  Smartphone,
  Lock,
  Mail,
  Check,
  AlertCircle,
  Camera,
  Navigation,
  Bell,
} from "lucide-react";

const PrivacyPolicy = () => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans text-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-gray-500 text-sm">
            Last Updated:{" "}
            <span className="font-semibold text-gray-700">{currentDate}</span>
          </p>
        </div>

        <div className="bg-white shadow-sm border border-gray-100 rounded-xl p-8 mb-8">
          <p className="text-lg mb-4 leading-relaxed text-gray-700">
            <strong>PiTetris</strong> is committed to protecting your privacy.
            This Privacy Policy explains how our HR Management Application
            ("App") collects, uses, and safeguards the information you provide
            to us or that we collect through your use of the App.
          </p>
          <p className="leading-relaxed text-gray-600">
            By downloading and using the PiTetris HR App, you agree to the
            collection and use of information in accordance with this policy.
            This policy applies to all users of the App, including employees,
            administrators, and HR personnel.
          </p>
        </div>

        {/* Section 1: Information We Collect */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Shield size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              1. Information We Collect
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 p-6 rounded-xl h-full shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                <span className="text-blue-600 bg-blue-50 w-6 h-6 rounded flex items-center justify-center text-sm">
                  A
                </span>
                Personal Information
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                To facilitate HR functions, we may collect personally
                identifiable information provided by your employer or directly
                by you:
              </p>
              <ul className="space-y-2">
                {[
                  "Full Name and Employee ID",
                  "Email Address and Phone Number",
                  "Job Title and Department",
                  "Attendance Records (Clock-in/out)",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="bg-blue-100 text-blue-600 rounded-full p-0.5 mt-0.5">
                      <Check size={10} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-gray-200 p-6 rounded-xl h-full shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-900">
                <span className="text-blue-600 bg-blue-50 w-6 h-6 rounded flex items-center justify-center text-sm">
                  B
                </span>
                Device & Usage Info
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                When you access the App, we may collect certain information
                automatically:
              </p>
              <ul className="space-y-2">
                {[
                  "Device type & OS version",
                  "IP address",
                  "App usage data",
                  "Crash logs for performance",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <span className="bg-teal-100 text-teal-600 rounded-full p-0.5 mt-0.5">
                      <Smartphone size={10} />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Permissions */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
              <Smartphone size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              2. App Permissions
            </h2>
          </div>

          <p className="text-gray-500 mb-6">
            Depending on features enabled by your organization, the App may
            request access to:
          </p>

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Permission
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Purpose
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Camera size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        Camera / Gallery
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    To allow users to upload profile pictures or scan
                    documents/receipts.
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Navigation size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        Location (GPS)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    To verify location during Clock-in/Clock-out (Geofencing),
                    if enabled.
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Bell size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        Notifications
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    To send announcements, leave approval updates, and shift
                    reminders.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Usage */}
        <section className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-4 pl-3 border-l-4 border-blue-500">
            3. How We Use Your Information
          </h3>
          <ul className="list-decimal list-outside ml-5 space-y-2 text-gray-600 text-sm">
            <li>
              To provide and maintain the Service (e.g., processing leave
              requests, tracking attendance).
            </li>
            <li>To notify you about changes to our Service.</li>
            <li>
              To allow you to participate in interactive features when you
              choose to do so.
            </li>
            <li>To provide customer support.</li>
            <li>To detect, prevent, and address technical issues.</li>
          </ul>
        </section>

        {/* Section 4: Deletion (Critical) */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <Lock size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              4. Data Retention & Deletion
            </h2>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex gap-4">
            <AlertCircle className="text-blue-500 shrink-0 mt-1" size={24} />
            <div>
              <h4 className="text-blue-900 font-bold mb-2">
                Requesting Data Deletion
              </h4>
              <p className="text-sm text-blue-800 mb-3">
                <strong>For Employees:</strong> If you wish to delete your
                account or data, please contact your company's HR administrator
                directly, as they are the data controller.
              </p>
              <p className="text-sm text-blue-800">
                <strong>Direct Request:</strong> Alternatively, contact us at{" "}
                <a
                  href="mailto:privacy@pitetris.com"
                  className="underline hover:text-blue-600"
                >
                  privacy@pitetris.com
                </a>{" "}
                with the subject "Account Deletion Request". We will verify the
                request with your employer before proceeding.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Third Party */}
        {/* <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <Server size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              5. Third-Party Services
            </h2>
          </div>
          <p className="mb-4 text-gray-600 text-sm">
            We employ third-party companies to facilitate our Service. They have
            access to your Personal Data only to perform specific tasks on our
            behalf.
          </p>
          <ul className="space-y-2 pl-2">
            <li className="flex gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
              <span>
                <strong>Google Cloud Platform / Firebase:</strong> For backend
                hosting and authentication.
              </span>
            </li>
            <li className="flex gap-2 text-sm text-gray-700">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 shrink-0"></span>
              <span>
                <strong>Google Analytics for Firebase:</strong> To analyze how
                the app is used (non-identifiable data).
              </span>
            </li>
          </ul>
        </section> */}

        {/* Footer Contact */}
        <div className="bg-gray-900 text-white rounded-2xl p-8 mt-12 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
              <p className="text-sm text-gray-400 mb-6 max-w-md">
                If you have any questions about this Privacy Policy, please
                contact us.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-blue-400" />
                  <span className="text-sm hover:text-white transition-colors cursor-pointer">
                    pitetries@gmail.com
                  </span>
                </div>
                {/* <div className="flex items-center gap-3">
                  <Globe size={18} className="text-blue-400" />
                  <span className="text-sm hover:text-white transition-colors cursor-pointer">
                    www.pitetris.com
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-blue-400 mt-1" />
                  <div>
                    <p className="text-sm font-semibold">PiTetris HQ</p>
                    <p className="text-xs text-gray-400">
                      123 Tech Park Avenue, Innovation City
                    </p>
                  </div>
                </div> */}
              </div>
            </div>

            <div className="text-right hidden md:block">
              <p className="font-bold text-xl tracking-tight">PiHR</p>
              <p className="text-xs text-gray-500 mt-1">
                &copy; 2025 All Rights Reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
