
// sidebarの開閉処理
const sidebar = document.getElementById("sidebar");
const toggleBtn = document.getElementById("toggleBtn");
const main = document.querySelector(".main");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("closed");
    main.classList.toggle("full");
});