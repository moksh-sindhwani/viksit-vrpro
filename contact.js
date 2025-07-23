document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".contact-form");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Grab form data
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    const password = document.getElementById("password")?.value.trim();

    // Simple validations
    if (!name || !email || !subject || message.length < 10) {
      alert("Please fill all required fields properly. Message should be at least 10 characters.");
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Password strength (if field exists and is filled)
    if (password) {
      const passRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passRegex.test(password)) {
        alert("Password must be at least 8 characters long and include at least one number and one letter.");
        return;
      }
    }

    // If all good, submit via Formspree
    try {
      const response = await fetch("https://formspree.io/f/yourFormID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          password
        })
      });

      if (response.ok) {
        alert("Message sent successfully!");
        form.reset();
      } else {
        alert("There was an error. Please try again later.");
      }
    } catch (error) {
      alert("Network error. Please try again later.");
      console.error(error);
    }
  });
});
