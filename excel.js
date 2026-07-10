window.exportExcel = function(events, selectedFields) {


    const headers = {
        eventNumber: "Event Number",
        sourceIn: "Source In",
        sourceOut: "Source Out",
        recordIn: "Record In",
        recordOut: "Record Out",
        duration: "Duration",
        slug: "Slug"
    };


    const worksheetData = [];


    worksheetData.push(
        selectedFields.map(field => headers[field])
    );


    events.forEach((event, index) => {

        worksheetData.push(

            selectedFields.map(field => {

                if (field === "eventNumber") {
                    return event.eventNumber;
                }

                return event[field] || "";

            })

        );

    });



    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);


    worksheet["!autofilter"] = {
        ref: worksheet["!ref"]
    };


    worksheet["!cols"] = selectedFields.map(field => {

        if (field === "slug") {
            return { width: 70 };
        }

        return { width: 18 };

    });


    const workbook = XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "EDL Export"
    );


    XLSX.writeFile(
        workbook,
        "EDL_Report.xlsx"
    );

};
