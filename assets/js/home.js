const userName = document.getElementById("userName");
console.log(userName)
if(userName.value === ""){
    document.addEventListener("DOMContentLoaded", function () {
        const modal = document.getElementById("myModal");
        const submitBtn = document.getElementById("submitName");
        const nameInput = document.getElementById("nameInput");
        const gameForm = document.getElementById("gameForm");
        modal.style.display = "block";
        submitBtn.onclick = function () {
          const userName = nameInput.value.trim();
          gameForm.elements["userName"].value = userName ? userName : "Guest";
          document.getElementById("hi").innerText = "Hi, " + userName
          modal.style.display = "none";
        };
      });  
}




