import { Skeleton } from "@mantine/core";

export default function CertificationDetailSkeleton() {
  return (
    <div className="pb-4 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-4">
        <h1 className="text-xl font-bold text-orange-400 mb-6">
          Certification Details
        </h1>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-[200px_1fr] gap-4">
            <Skeleton height={20} width="80%" />
            <Skeleton height={20} width="60%" />

            <Skeleton height={20} width="80%" />
            <Skeleton height={20} width="60%" />

            <Skeleton height={30} width="40%" radius="xl" />
            <Skeleton height={60} width="100%" radius="sm" />

            <Skeleton height={20} width="80%" />
            <Skeleton height={20} width="60%" />

            <Skeleton height={20} width="80%" />
            <Skeleton height={20} width="60%" />
          </div>

          <div className="mt-4 pt-4">
            <Skeleton height={30} width="100px" />
            <ul className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <li
                  key={index}
                  className="relative p-4 bg-white rounded-lg border border-gray-100 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <Skeleton height={40} width={40} circle />
                    <div className="flex-1">
                      <Skeleton height={15} width="80%" />
                      <Skeleton height={15} width="60%" />
                      <Skeleton height={15} width="50%" />
                    </div>
                    <Skeleton height={15} width="70px" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <Skeleton height={20} width="80px" />
            <Skeleton height={20} width="60%" />

            <Skeleton height={20} width="80px" />
            <Skeleton height={20} width="60%" />
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Skeleton height={35} width={80} />
        </div>
      </div>
    </div>
  );
}
