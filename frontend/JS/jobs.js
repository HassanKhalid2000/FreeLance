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
  










document.addEventListener("DOMContentLoaded", () => {
    const companiesContainer = document.getElementById("companies-container");
    const modal = document.getElementById("apply-modal");
    const closeModal = modal.querySelector(".close-button");
    const applyForm = document.getElementById("applyForm");

    let currentCompanyEmail = null;

    // إغلاق النافذة
    closeModal.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // إرسال الرسالة
    applyForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const message = document.getElementById("message").value;

        fetch("http://localhost:9000/api/send-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: currentCompanyEmail, message }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert(data.message);
                modal.style.display = "none"; // إغلاق النافذة
            })
            .catch((error) => {
                console.error("Error sending email:", error);
                alert("حدث خطأ أثناء إرسال الرسالة.");
            });
    });

    // جلب بيانات الشركات
    fetch("http://localhost:9000/api/Companyes")
        .then((response) => response.json())
        .then((companies) => {
            if (companies.length === 0) {
                companiesContainer.innerHTML = "<p>No companies available at the moment.</p>";
                return;
            }

            companies.forEach((company) => {
                const companyCard = document.createElement("div");
                companyCard.classList.add("company-card");

                companyCard.innerHTML = `
                    <h2>${company.fullName}</h2>
                    <p><strong>Email:</strong> ${company.email}</p>
                    <p><strong>Phone:</strong> ${company.phoneNumber || 'N/A'}</p>
                    <p><strong>Address:</strong> ${company.address || 'N/A'}</p>
                    <p><strong>Description:</strong> ${company.jobDescription || 'No description available'}</p>
                    <button class="apply-button" data-email="${company.email}">تقديم</button>
                `;

                companiesContainer.appendChild(companyCard);
            });

            // إضافة الأحداث لأزرار التقديم
            document.querySelectorAll(".apply-button").forEach((button) => {
                button.addEventListener("click", (e) => {
                    currentCompanyEmail = e.target.getAttribute("data-email");
                    modal.style.display = "flex"; // عرض النافذة
                });
            });
        })
        .catch((error) => {
            console.error("Error fetching companies:", error);
            companiesContainer.innerHTML = "<p>Failed to load companies. Please try again later.</p>";
        });
});
