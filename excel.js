window.exportExcel = function(events) {

    const worksheetData = [
        [
            "#",
            "Source In",
            "Source Out",
            "Record In",
            "Record Out",
            "Duration",
            "Slug"
        ]
    ];


    events.forEach((event, index) => {

        worksheetData.push([
            index + 1,
            event.sourceIn,
            event.sourceOut,
            event.recordIn,
            event.recordOut,
            event.duration,
            event.slug
        ]);

    });


    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);


    // Freeze header row
    worksheet["!freeze"] = {
        xSplit: 0,
        ySplit: 1
    };


    // Add filters
    worksheet["!autofilter"] = {
        ref: worksheet["!ref"]
    };


    // Auto-size columns
    worksheet["!cols"] = [
        { width: 8 },   // #
        { width: 15 },  // Source In
        { width: 15 },  // Source Out
        { width: 15 },  // Record In
        { width: 15 },  // Record Out
        { width: 15 },  // Duration
        { width: 70 }   // Slug
    ];


    // Wrap slug text
    for (let cell in worksheet) {

        if (cell.startsWith("G")) {

            worksheet[cell].s = {
                alignment: {
                    wrapText: true,
                    vertical: "top"
                }
            };

        }

    }


    const workbook = XLSX.utils.book_new();


    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "EDL Slugs"
    );


    XLSX.writeFile(
        workbook,
        "EDL_Slug_Report.xlsx"
    );

};
