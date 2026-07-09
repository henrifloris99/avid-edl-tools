window.exportExcel = function(events) {

    const worksheetData = [
        [
            "#",
            "Record In",
            "Record Out",
            "Duration",
            "Slug"
        ]
    ];

    events.forEach((event, index) => {

        worksheetData.push([
            index + 1,
            event.recordIn,
            event.recordOut,
            event.duration,
            event.slug
        ]);

    });


    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

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
