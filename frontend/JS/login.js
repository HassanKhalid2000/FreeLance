document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:9000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.message);
        window.location.href = data.redirect; // إعادة التوجيه بناءً على الرد
      } else {
        alert(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred. Please try again.");
    }
  });
  