// جلب جميع المستخدمين وعرضهم في الجدول
async function fetchUsers() {
    try {
        const response = await fetch("http://localhost:9000/users");
        const users = await response.json();
        const userTableBody = document.getElementById("userTableBody");

        userTableBody.innerHTML = ""; // تفريغ الجدول قبل إعادة التعبئة

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.accountStatus}</td>
                <td>
                    <button class="btn approve-btn" onclick="approveUser('${user._id}')">Accept</button>
                    <button class="btn reject-btn" onclick="rejectUser('${user._id}')">Regect</button>
                    <button class="btn delete-btn" onclick="deleteUser('${user._id}')">Delete</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire("خطأ!", "حدث خطأ أثناء تحميل المستخدمين.", "error");
    }
}

// الموافقة على المستخدم
async function approveUser(userId) {
    try {
        const response = await fetch(`http://localhost:9000/users/approve/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();

        if (response.ok) {
            Swal.fire("تم!", "تمت الموافقة على المستخدم بنجاح.", "success").then(fetchUsers);
        } else {
            Swal.fire("خطأ!", result, "error");
        }
    } catch (error) {
        console.error("Error approving user:", error);
        Swal.fire("خطأ!", "حدث خطأ أثناء الموافقة على المستخدم.", "error");
    }
}

// رفض المستخدم
async function rejectUser(userId) {
    try {
        const response = await fetch(`http://localhost:9000/users/reject/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();

        if (response.ok) {
            Swal.fire("تم!", "تم رفض المستخدم بنجاح.", "success").then(fetchUsers);
        } else {
            Swal.fire("خطأ!", result, "error");
        }
    } catch (error) {
        console.error("Error rejecting user:", error);
        Swal.fire("خطأ!", "حدث خطأ أثناء رفض المستخدم.", "error");
    }
}

// حذف المستخدم
async function deleteUser(userId) {
    try {
        const response = await fetch(`http://localhost:9000/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();

        if (response.ok) {
            Swal.fire("تم!", "تم حذف المستخدم بنجاح.", "success").then(fetchUsers);
        } else {
            Swal.fire("خطأ!", result, "error");
        }
    } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("خطأ!", "حدث خطأ أثناء حذف المستخدم.", "error");
    }
}

// تحميل المستخدمين عند فتح الصفحة
window.onload = fetchUsers;

// logout
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
  