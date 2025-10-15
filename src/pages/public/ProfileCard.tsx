import { useAppSelector } from "../../store/hook/hook";

const ProfileCard = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-600 text-lg">No user data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-md p-6 mt-10">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
          {user.name?.[0]?.toUpperCase()}
        </div>
        <h2 className="mt-4 text-xl font-semibold text-gray-800">
          {user.name}
        </h2>
        <p className="text-gray-500">{user.email}</p>
        <div className="mt-3 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
          {user.role}
        </div>
        <div className="mt-4 text-sm text-gray-400">
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
