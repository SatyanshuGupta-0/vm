import { FaUsers } from "react-icons/fa";

const TeamMembers = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Rahul Kumar",
      email: "rahul@gmail.com",
      joinedOn: "22 Dec 2025",
      status: "ACTIVE",
    },
    {
      id: 2,
      name: "Amit Sharma",
      email: "amit@gmail.com",
      joinedOn: "24 Dec 2025",
      status: "ACTIVE",
    },
    {
      id: 3,
      name: "Neha Singh",
      email: "neha@gmail.com",
      joinedOn: "26 Dec 2025",
      status: "PENDING",
    },
  ];

  return (
    <div className="p-4 max-w-4xl mx-auto mt-10 space-y-5">
      {/* 👥 TEAM SUMMARY CARD */}
      <div className="rounded-xl p-6 border shadow-md bg-white text-center">
        <FaUsers size={40} className="mx-auto text-blue-600 mb-2" />
        <h2 className="text-lg font-semibold">My Team</h2>
        <p className="text-3xl font-bold mt-1">
          {teamMembers.length}
        </p>
        <p className="text-sm text-gray-500">
          Total members joined using your referral code
        </p>
      </div>

      {/* 📋 TEAM LIST */}
      <div className="rounded-xl p-5 border shadow-md bg-white">
        <h3 className="font-semibold text-lg mb-4">
          Team Members List
        </h3>

        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex justify-between items-center border-b py-3 last:border-none"
          >
            <div>
              <p className="font-medium">{member.name}</p>
              <p className="text-sm text-gray-500">{member.email}</p>
              <p className="text-xs text-gray-400">
                Joined on {member.joinedOn}
              </p>
            </div>

            <span
              className={`px-3 py-1 text-xs rounded ${
                member.status === "ACTIVE"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {member.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamMembers;
