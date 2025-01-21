// انشاء حساب جديد
// document.getElementById('registrationForm').addEventListener('submit', async (e) => {
//     e.preventDefault();

//     // جمع البيانات من النموذج
//     const formData = {
//         fullName: document.getElementById('fullName').value,
//         phoneNumber: document.getElementById('phoneNumber').value,
//         address: document.getElementById('address').value,
//         email: document.getElementById('email').value,
//         password: document.getElementById('password').value,
//         theJob: document.getElementById('theJob').value,
//         jobDescription: document.getElementById('jobDescription').value,
//         communicationLink: document.getElementById('communicationLink').value,
//         pdf: document.getElementById('pdf').value,
//         image: document.getElementById('image').value,
//     };

//     try {
//         // إرسال البيانات إلى الخادم
//         const response = await fetch('http://localhost:9000/api/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });

//         const data = await response.json();

//         if (response.ok) {
//             Swal.fire(" تم انشاء الحساب الرجاء الانتظار حتى يتم قبول طلبك", result.message, "success").then(() => {
//                 window.location.href = "./loginPage.html";
//             });
//         } else {
//             Swal.fire("خطأ!", result.message, "error");
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         Swal.fire({
//             icon: 'error',
//             title: 'فشل الاتصال!',
//             text: 'تعذر الاتصال بالخادم. يرجى التحقق من الشبكة.',
//         });
//     }
// });





// تحديث الحقول بناءً على نوع الحساب






document.getElementById("accountType").addEventListener("change", (e) => {
    const accountType = e.target.value;
    const jobSeekerFields = document.getElementById("JobSeekerFields");
    const employerFields = document.getElementById("EmployerFields");

    if (accountType === "Seeker") {
        jobSeekerFields.style.display = "block";
        employerFields.style.display = "none";
    } else if (accountType === "Employer") {
        jobSeekerFields.style.display = "none";
        employerFields.style.display = "block";
    } else {
        jobSeekerFields.style.display = "none";
        employerFields.style.display = "none";
    }
});

// إرسال البيانات
document.getElementById("registrationForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = {
        fullName: document.getElementById("fullName").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
        accountType: document.getElementById("accountType").value,
        image: document.getElementById("image").value || null,
    };

    const accountType = formData.accountType;
    if (accountType === "Seeker") {
        formData.theJob = document.getElementById("theJob")?.value || null;
        formData.pdf = document.getElementById("pdf")?.value || null;
    } else if (accountType === "Employer") {
        formData.jobDescription = document.getElementById("jobDescription")?.value || null;
        formData.communicationLink = document.getElementById("communicationLink")?.value || null;
    }

    try {
        const response = await fetch("http://localhost:9000/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire(" تم انشاء الحساب الرجاء الانتظار حتى يتم قبول طلبك", result.message, "success").then(() => {
                window.location.href = "./loginPage.html";
            });
        } else {
            Swal.fire("خطأ!", result.message, "error");
        }
    } catch (error) {
        Swal.fire("خطأ!", "حدث خطأ أثناء الاتصال بالخادم", "error");
    }
});
