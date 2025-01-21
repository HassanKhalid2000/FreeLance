document.addEventListener("DOMContentLoaded", () => {
    const cardsContainer = document.getElementById("cards-container");

    // إنشاء نافذة منبثقة
    const modal = document.createElement("div");
    modal.id = "contact-modal";
    modal.style.display = "none";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button">&times;</span>
            <h2>Send Invitation</h2>
            <p><strong>Email:</strong> <span id="freelancer-email"></span></p>
            <textarea id="invitation-message" rows="5" placeholder="Write your invitation message here..."></textarea>
            <button id="send-invitation">Send</button>
        </div>
    `;
    document.body.appendChild(modal);

    const closeButton = modal.querySelector(".close-button");
    const freelancerEmailSpan = document.getElementById("freelancer-email");
    const invitationMessageTextarea = document.getElementById("invitation-message");
    const sendButton = document.getElementById("send-invitation");

    // إغلاق النافذة المنبثقة
    closeButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // جلب بيانات المستخدمين من نوع "Freelancer" من الخادم
    fetch("http://localhost:9000/api/freelancers")
        .then((response) => response.json())
        .then((freelancers) => {
            if (freelancers.length === 0) {
                cardsContainer.innerHTML = "<p>No freelancers available at the moment.</p>";
                return;
            }

            // إنشاء البطاقات لكل Freelancer
            freelancers.forEach((freelancer) => {
                const card = document.createElement("div");
                card.classList.add("card");

                card.innerHTML = `
                    <img src="${freelancer.image || '../images/default-image.jpg'}" alt="${freelancer.fullName}">
                    <h3>${freelancer.fullName}</h3>
                    <p><strong>Phone:</strong> ${freelancer.phoneNumber || 'N/A'}</p>
                    <p><strong>Address:</strong> ${freelancer.address || 'N/A'}</p>
                    <p><strong>Email:</strong> ${freelancer.email || 'N/A'}</p>
                    <p><strong>Job:</strong> ${freelancer.theJob || 'N/A'}</p>
                    <p><strong>Description:</strong> ${freelancer.jobDescription || 'N/A'}</p>
                    <p><strong>PDF:</strong> <a href="${freelancer.pdf || '#'}" target="_blank">View PDF</a></p>
                    <a href="#" class="contact-button" data-email="${freelancer.email}">Contact</a>
                `;

                cardsContainer.appendChild(card);
            });

            // ربط أزرار "Contact" بفتح النافذة المنبثقة
            const contactButtons = document.querySelectorAll(".contact-button");
            contactButtons.forEach((button) => {
                button.addEventListener("click", (e) => {
                    e.preventDefault();
                    const email = button.getAttribute("data-email");
                    freelancerEmailSpan.textContent = email;
                    invitationMessageTextarea.value = ""; // تفريغ الرسالة السابقة
                    modal.style.display = "flex";
                });
            });
        })
        .catch((error) => {
            console.error("Error fetching freelancers:", error);
            cardsContainer.innerHTML = "<p>Failed to load freelancers. Please try again later.</p>";
        });

    // إرسال الدعوة
    sendButton.addEventListener("click", () => {
        const email = freelancerEmailSpan.textContent;
        const message = invitationMessageTextarea.value.trim();

        if (!message) {
            alert("Please write a message before sending.");
            return;
        }

        // تنفيذ الإجراء المطلوب مثل إرسال البريد الإلكتروني أو حفظ الرسالة
        console.log(`Invitation sent to ${email}: ${message}`);
        alert("Invitation sent successfully!");
        modal.style.display = "none";
    });
});


document.getElementById("logoutLink").addEventListener("click", (e) => {
    e.preventDefault();
  
    fetch("http://localhost:9000/api/logout", {
        method: "POST",
        credentials: "include", // لضمان إرسال ملفات تعريف الارتباط
    })
        .then((response) => {
            if (response.ok) {
                // إزالة بيانات المستخدم من التخزين المحلي
                sessionStorage.clear();
                localStorage.clear();
  
                // إعادة التوجيه إلى صفحة تسجيل الدخول
                window.location.href = "../pages/loginPage.html";
            } else {
                alert("Failed to log out. Please try again.");
            }
        })
        .catch((error) => {
            console.error("Error logging out:", error);
            alert("An error occurred. Please try again.");
        });
  });
  