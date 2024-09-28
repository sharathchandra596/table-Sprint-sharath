/* eslint-disable react/prop-types */


const Navbar = ({ isLoggedIn, onLogout }) => {
  return (
    <nav className="bg-purple-700 h-16 flex items-center justify-between px-6 text-white">
      <div className="text-2xl font-bold">TableSprint</div>
      <div className="flex items-center">
        {isLoggedIn ? (
          <>
            <img
              src="path_to_avatar_image" // Replace with actual path to user avatar
              alt="User Avatar"
              className="w-8 h-8 rounded-full mr-4" // Adjust size and styling as needed
            />
            <button
              onClick={onLogout}
              className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="text-xl">
            <i className="fas fa-user-circle"></i> {/* User icon for guest */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
