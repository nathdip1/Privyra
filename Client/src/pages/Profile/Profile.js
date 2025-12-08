import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

function Profile() {
  const { currentUser } = useContext(UserContext);

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {currentUser}</p>
      <p>Optionally: Stop sharing images, change password, etc.</p>
    </div>
  );
}

export default Profile;
