
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
              window.location.href = "./pages/loginPage.html";
          } else {
              alert("Failed to log out. Please try again.");
          }
      })
      .catch((error) => {
          console.error("Error logging out:", error);
          alert("An error occurred. Please try again.");
      });
});


// 
document.getElementById('readMoreBtn').addEventListener('click', function () {
    const extraText = document.getElementById('extraText');
    const readMoreBtn = this;

    if (extraText.style.display === 'none') {
        extraText.style.display = 'block';
        readMoreBtn.textContent = 'Read Less';
    } else {
        extraText.style.display = 'none';
        readMoreBtn.textContent = 'Read More';
    }
});



// // فتح النافذة المنبثقة عند الضغط على صورة
// فتح النافذة المنبثقة عند الضغط على صورة
// فتح النافذة المنبثقة عند الضغط على صورة
const images = document.querySelectorAll('.imgaes');
const modal = document.getElementById('modal');
const closeModal = document.querySelector('.close');
const modalImages = document.getElementById('modal-images');

// إغلاق النافذة المنبثقة
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// فتح النافذة المنبثقة عند الضغط على أي صورة
images.forEach(image => {
  image.addEventListener('click', (e) => {
    const category = e.currentTarget.getAttribute('data-category');
    displayImages(category);  // عرض الصور بناءً على الفئة
    modal.style.display = 'block';
  });
});

// دالة لعرض الصور بناءً على الفئة
function displayImages(category) {
  let images = [];

  // روابط صور ثابتة بناءً على الفئة
  if (category === 'design & art') {
    images = [
      'https://images.pexels.com/photos/1050344/pexels-photo-1050344.jpeg',
      'https://images.pexels.com/photos/1050345/pexels-photo-1050345.jpeg',
      'https://images.pexels.com/photos/1050347/pexels-photo-1050347.jpeg',
    ];
  } else if (category === 'web development') {
    images = [
      'https://images.pexels.com/photos/1181255/pexels-photo-1181255.jpeg',
      'https://images.pexels.com/photos/267607/pexels-photo-267607.jpeg',
      'https://images.pexels.com/photos/1181344/pexels-photo-1181344.jpeg',
    ];
  } else if (category === 'seo monitoring') {
    images = [
      'https://images.pexels.com/photos/325154/pexels-photo-325154.jpeg',
      'https://images.pexels.com/photos/448157/pexels-photo-448157.jpeg',
      'https://images.pexels.com/photos/2661760/pexels-photo-2661760.jpeg',
    ];
  } else if (category === 'video editing') {
    images = [
      'https://images.pexels.com/photos/1542295/pexels-photo-1542295.jpeg',
      'https://images.pexels.com/photos/3030336/pexels-photo-3030336.jpeg',
      'https://images.pexels.com/photos/3079225/pexels-photo-3079225.jpeg',
    ];
  } else if (category === 'logo design') {
    images = [
      'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
      'https://images.pexels.com/photos/1614793/pexels-photo-1614793.jpeg',
      'https://images.pexels.com/photos/3740109/pexels-photo-3740109.jpeg',
    ];
  } else if (category === 'game design') {
    images = [
      'https://images.pexels.com/photos/2760247/pexels-photo-2760247.jpeg',
      'https://images.pexels.com/photos/3498640/pexels-photo-3498640.jpeg',
      'https://images.pexels.com/photos/3268155/pexels-photo-3268155.jpeg',
    ];
  }

  // إضافة الصور إلى النافذة المنبثقة
  modalImages.innerHTML = '';
  images.forEach(imgSrc => {
    const img = document.createElement('img');
    img.src = imgSrc;
    modalImages.appendChild(img);
  });
}
