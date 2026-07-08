const dropZone = document.getElementById("drop-zone");

dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.style.border = "2px solid blue";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.border = "";
});

dropZone.addEventListener("drop", (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {
        const edlText = e.target.result;

        console.log("Loaded EDL:");
        console.log(edlText.substring(0,500));

        const results = parseEDL(edlText);

        console.log("Parsed Events:");
        console.log(results);

        dropZone.innerHTML = `
            <h3>EDL Loaded</h3>
            <p>${results.length} slug events found</p>
        `;
    };

    reader.readAsText(file);
});
