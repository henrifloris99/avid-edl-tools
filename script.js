let results = [];

let detectedFields = [];


const fieldLabels = {

    eventNumber: "Event Number",

    reel: "Reel",

    clipName: "Clip Name",

    sourceIn: "Source In",

    sourceOut: "Source Out",

    recordIn: "Record In",

    recordOut: "Record Out",

    duration: "Duration",

    slug: "Slug",

    auxData: "Aux Data"

};



function detectFields(events) {


    const fields = [];


    Object.keys(fieldLabels).forEach(field => {


        const exists = events.some(event => {

            return event[field] && event[field].trim() !== "";

        });


        if (exists) {

            fields.push(field);

        }


    });


    return fields;

}




function buildFieldSelector(fields) {


    const selector = document.getElementById("fieldSelector");


    if (!selector) {
        return;
    }



    selector.innerHTML = `

        <h3>Excel Export Fields</h3>

    `;



    fields.forEach(field => {


        selector.innerHTML += `

            <label>

                <input 
                    type="checkbox"
                    value="${field}"
                    checked
                >

                ${fieldLabels[field]}

            </label>

            <br>

        `;


    });



}




function displayResults(events) {


    const resultsDiv = document.getElementById("results");


    let table = `

        <table border="1">

            <tr>

                <th>#</th>
                <th>Reel</th>
                <th>Clip Name</th>
                <th>Source In</th>
                <th>Source Out</th>
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

                <td>${event.reel || ""}</td>

                <td>${event.clipName || ""}</td>

                <td>${event.sourceIn || ""}</td>

                <td>${event.sourceOut || ""}</td>

                <td>${event.recordIn || ""}</td>

                <td>${event.recordOut || ""}</td>

                <td>${event.duration || ""}</td>

                <td>${event.slug || ""}</td>

            </tr>

        `;


    });



    table += `

        </table>

    `;



    resultsDiv.innerHTML = table;


}





document.addEventListener("DOMContentLoaded", () => {


    const dropZone = document.getElementById("dropZone");

    const exportButton = document.getElementById("exportButton");

    const fieldSelector = document.getElementById("fieldSelector");



    dropZone.addEventListener("dragover", event => {


        event.preventDefault();


        dropZone.style.border = "2px solid blue";


    });




    dropZone.addEventListener("dragleave", () => {


        dropZone.style.border = "";


    });




    dropZone.addEventListener("drop", event => {


        event.preventDefault();



        const file = event.dataTransfer.files[0];



        if (!file) {

            return;

        }




        const reader = new FileReader();




        reader.onload = function(e) {


            const edlText = e.target.result;



            const selectedEDLType = document.querySelector(
                'input[name="edlType"]:checked'
            ).value;



            console.log("Selected EDL Type:");
            console.log(selectedEDLType);



            results = parseEDL(
                edlText,
                selectedEDLType
            );



            console.log("Parsed Events:");

            console.log(results);




            detectedFields = detectFields(results);



            console.log("Detected Fields:");

            console.log(detectedFields);




            displayResults(results);



            buildFieldSelector(detectedFields);




            dropZone.innerHTML = `

                <h3>EDL Loaded</h3>

                <p>${results.length} events found</p>

            `;



            if (fieldSelector) {

                fieldSelector.style.display = "block";

            }



            if (exportButton) {

                exportButton.style.display = "block";

            }



        };



        reader.readAsText(file);



    });





    if (exportButton) {


        exportButton.addEventListener("click", () => {



            const checkedFields = Array.from(

                document.querySelectorAll("#fieldSelector input:checked")

            )

            .map(input => input.value);




            exportExcel(results, checkedFields);



        });


    }



});
