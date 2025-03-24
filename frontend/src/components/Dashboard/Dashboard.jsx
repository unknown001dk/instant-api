import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";
import { IsUserLoggedIn } from "../../utils/CheckUser";
import { AiOutlineClose } from "react-icons/ai";
import { NotificationSucess } from "../../utils/Notification";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to handle modal visibility
  const [username, setUsername] = useState("");
  const [isActivitiesModalOpen, setIsActivitiesModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [userActivities, setUserActivities] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    IsUserLoggedIn();
    const tokenData = sessionStorage.getItem("token");
    console.log(tokenData);
    const user = JSON.parse(tokenData);
    const token = user?.token;
    console.log(token);
    const userId = user.user?._id;

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/users/getuser/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    // Fetch user activities
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/api/v1/users/getactivity/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUserActivities(response.data.activities); // Assuming `activities` is returned
        console.log(response.data.activities[0].activityDescription);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchData();
    fetchActivities();
  }, []);

  // Default profile picture
  const defaultProfilePicture = "/profile.jpg";

  // Handle opening modal and setting user info
  const openModal = () => {
    setIsModalOpen(true);
    setUsername(userData.data.username);
    setEmail(userData.data.email);
    setProfilePicture(userData.data.profilePicture || defaultProfilePicture);
  };

  // Handle closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle opening the activities modal
  const openActivitiesModal = () => {
    setIsActivitiesModalOpen(true);
  };

  // Handle closing the activities modal
  const closeActivitiesModal = () => {
    setIsActivitiesModalOpen(false);
  };

  const handleProfileClick = () => {
    // Open a modal or perform an action
    setShowProfileModal(true);
  };

  const updateProfilePicture = async (newPictureUrl) => {
    try {
      const response = await axios.put(`/api/users/${userId}/profile-picture`, {
        profilePicture: newPictureUrl,
      });
      console.log(response.data.message); // Success message
      setUserData((prev) => ({
        ...prev,
        data: { ...prev.data, profilePicture: newPictureUrl },
      }));
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  // Handle form submission
  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const tokenData = sessionStorage.getItem("token");
      const user = JSON.parse(tokenData);
      const token = user?.token;
      const userId = user.user?._id;

      const response = await axios.put(
        `http://localhost:8081/api/v1/users/update/${userId}`,
        {
          username,
          email,
          profilePicture,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUserData(response.data);
      closeModal();
      NotificationSucess("User updated", response.data.message);
    } catch (error) {
      ErrorCtrl(error, "Update");
    }
  };

  return (
    <div className="dashboard-container">
      {loading ? (
        <p>Loading...</p>
      ) : userData ? (
        <>
          <h2>Welcome, {userData.data.username}</h2>
          <p>Email: {userData.data.email}</p>
          <p>Role: {userData.data.role}</p>

          <section className="user-profile">
            <h3>Profile Info</h3>
            <div className="profile-details">
              <img
                src={userData?.data?.profilePicture || defaultProfilePicture}
                alt="Profile"
                className="profile-image"
                onClick={handleProfileClick} // Click event handler
              />
              <div>
                <h4>Username:</h4>
                <p>{userData.data.username}</p>
                <h4>Email:</h4>
                <p>{userData.data.email}</p>
                <h4>Role:</h4>
                <p>{userData.data.role}</p>
              </div>
            </div>
          </section>

          <section className="user-actions">
            <h3>Your Actions</h3>
            <button className="edit-profile-btn" onClick={openModal}>
              Edit Profile
            </button>
            <button className="view-activity-btn" onClick={openActivitiesModal}>
              View Activities
            </button>
          </section>

          <section className="user-activity">
            <h3>Recent Activity</h3>
            <ul>
              {userActivities && userActivities.length > 0 ? (
                userActivities
                  .slice(-3) // Get the last three activities
                  .map((activity, index) => (
                    <li key={index}>
                      <p>{activity.activityDescription}</p>
                      <small>
                        {activity.timestamp
                          ? new Date(activity.timestamp).toLocaleString()
                          : "Time not available"}
                      </small>
                    </li>
                  ))
              ) : (
                <li>No recent activities.</li>
              )}
            </ul>
          </section>

          {/* Edit Profile Modal */}
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h3>Edit Profile</h3>

                <form onSubmit={handleProfileUpdate}>
                  <div>
                    <label>Username:</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Email:</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label>Profile Picture URL:</label>
                    <input
                      type="text"
                      value={profilePicture}
                      onChange={(e) => setProfilePicture(e.target.value)}
                    />
                  </div>
                  <div className="center">
                    <button type="submit">Update Profile</button>
                    <button type="button" onClick={closeModal}>
                      Close
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* Activities Modal */}
          {isActivitiesModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h3>Recent Activities</h3>
                <button
                  className="close-modal-btn"
                  onClick={closeActivitiesModal}
                >
                  <AiOutlineClose size={24} /> {/* Close icon */}
                </button>
                <ul>
                  {userActivities.length > 0 ? (
                    userActivities.map((activity, index) => (
                      <li key={index}>{activity.activityDescription}</li>
                    ))
                  ) : (
                    <li>No recent activities.</li>
                  )}
                </ul>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>User data not found</p>
      )}
    </div>
  );
}

export default Dashboard;
