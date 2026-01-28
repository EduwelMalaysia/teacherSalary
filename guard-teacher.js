const teacherId = sessionStorage.getItem("teacherId");
if (!teacherId) {
  location.href = "index.html";
}
