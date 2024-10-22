document.querySelector(".guess").addEventListener("click", ()=> {
    document.querySelector(".mainBoard").style.display = 'none';
    document.querySelector(".guess-word").style.display = 'flex'; 
});

document.querySelector(".decline").addEventListener("click", () => {
    document.querySelector(".guess-word").style.display = 'none'; 
    document.querySelector(".mainBoard").style.display = 'block';
});

document.querySelectorAll(".reload").forEach((element) => {
    element.addEventListener("click", () => {
        location.reload();
    });
});

document.getElementById("minimizar").addEventListener("click", () => {
    document.querySelector(".jFrame").style.display = "none";
    document.querySelector(".notepad").style.display = "flex";
});

document.getElementById("encerrar").addEventListener("click", () => {
    document.querySelector(".jFrame").style.display = "flex";
    document.querySelector(".notepad").style.display = "none";
});