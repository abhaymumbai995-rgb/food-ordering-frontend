import { useEffect, useState } from "react";

const PROFILE_URL =
  "https://food-ordering-backend-9xyo.onrender.com/api/profile";

const emptyProfile = {
  name: "",
  email: "",
  mobile: "",
  address: "",
  city: "",
  pincode: ""
};

function Profile({ setPage }) {
  const [profile, setProfile] = useState(emptyProfile);
  const [draft, setDraft] = useState(emptyProfile);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState(() =>
    localStorage.getItem("token")
      ? "Loading profile..."
      : "Please log in to view your profile."
  );

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch(PROFILE_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.user) {
          setMessage(data.message || "Unable to load profile.");
          return;
        }

        const loadedProfile = {
          ...emptyProfile,
          ...data.user
        };

        setProfile(loadedProfile);
        setDraft(loadedProfile);
        setMessage("");
      })
      .catch(() => {
        setMessage("Unable to connect to the profile service.");
      });
  }, []);

  function handleChange(event) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      [event.target.name]: event.target.value
    }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    setMessage("Saving profile...");

    try {
      const response = await fetch(PROFILE_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(draft)
      });
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to update profile.");
        return;
      }

      const updatedProfile = {
        ...draft,
        ...(data.user || {})
      };

      setProfile(updatedProfile);
      setDraft(updatedProfile);
      localStorage.setItem("userName", updatedProfile.name || "");
      setEditing(false);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("Unable to connect to the profile service.");
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setPage("login");
  }

  return (
    <section className="profile-box">
      <div className="profile-avatar">👤</div>
      <h2>My Profile</h2>

      {message && <p className="profile-message">{message}</p>}

      {editing ? (
        <form className="profile-edit" onSubmit={saveProfile}>
          {Object.entries(draft).map(([field, value]) => (
            <label key={field}>
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {field === "address" ? (
                <textarea
                  name={field}
                  value={value}
                  onChange={handleChange}
                />
              ) : (
                <input
                  name={field}
                  value={value}
                  disabled={field === "email"}
                  onChange={handleChange}
                />
              )}
            </label>
          ))}

          <button type="submit">Save Profile</button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setDraft(profile);
              setEditing(false);
              setMessage("");
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <div className="profile-info">
            {Object.entries(profile).map(([field, value]) => (
              <p key={field}>
                <strong>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </strong>
                <span>{value || "Not provided"}</span>
              </p>
            ))}
          </div>

          <button type="button" onClick={() => setEditing(true)}>
            Edit Profile
          </button>
          <button type="button" onClick={() => setPage("orders")}>
            My Orders
          </button>
          <button type="button" onClick={() => setPage("cart")}>
            My Cart
          </button>
          <button type="button" className="logout-button" onClick={logout}>
            Logout
          </button>
        </>
      )}
    </section>
  );
}

export default Profile;
