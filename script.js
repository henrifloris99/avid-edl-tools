let results = [];

function displayResults(events) {

    const resultsDiv = document.getElementById("results");

    let table = `
        <table border="1">
            <tr>
                <th>#</th>
                <th>Record In</th>
                <th>Record Out</th>
                <th>Duration</th>
                <th>Slug</th>
            </tr>
    `;

    events.forEach((event, index) => {

        table += `
            <tr>
                <td>${index + 1}</td>
                <td>${event.recordIn}</td>
                <td>${event.recordOut}</td>
                <td>${event.duration}</td>
                <td>${event.slug}</td>
            </tr>
        `;

    });

    table += `</table>`;

    resultsDiv.innerHTML = table;
}


document.addEventListener("DOMContentLoaded", () => {

    const dropZone = document.getElementById("dropZone");

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

            results = parseEDL(edlText);

            console.log("Parsed Events:");
            console.log(results);

            displayResults(results);

            dropZone.innerHTML = `
                <h3>EDL Loaded</h3>
                <p>${results.length} slug events found</p>
            `;
        };

        reader.readAsText(file);
    });

});
