class EDLEvent {

    constructor(eventNumber, reel, sourceIn, sourceOut, recordIn, recordOut) {

        this.eventNumber = eventNumber;

        // BL is an Avid placeholder, not useful metadata
        this.reel = (reel === "BL") ? "" : (reel || "");

        this.sourceIn = sourceIn || "";
        this.sourceOut = sourceOut || "";

        this.recordIn = recordIn || "";
        this.recordOut = recordOut || "";

        this.duration = "";

        this.clipName = "";

        this.slug = "";

        this.auxData = "";

    }

}



function parseEDL(edlText) {


    const events = [];

    const lines = edlText.split(/\r?\n/);

    let currentEvent = null;



    for (let line of lines) {


        line = line.trim();


        if (!line) {
            continue;
        }



        /*
            UNIVERSAL AVID EVENT FORMAT

            Archive:
            000001 REEL V C SOURCE-IN SOURCE-OUT RECORD-IN RECORD-OUT

            Slug:
            000003 BL V C SOURCE-IN SOURCE-OUT RECORD-IN RECORD-OUT
        */


        let eventMatch = line.match(
            /^(\d+)\s+(\S+)\s+V\s+C\s+(\d\d:\d\d:\d\d:\d\d)\s+(\d\d:\d\d:\d\d:\d\d)\s+(\d\d:\d\d:\d\d:\d\d)\s+(\d\d:\d\d:\d\d:\d\d)\s*$/
        );



        if (eventMatch) {


            currentEvent = new EDLEvent(

                eventMatch[1],   // event number
                eventMatch[2],   // reel

                eventMatch[3],   // source in
                eventMatch[4],   // source out

                eventMatch[5],   // record in
                eventMatch[6]    // record out

            );


            currentEvent.duration = calculateDuration(
                eventMatch[3],
                eventMatch[4]
            );


            continue;

        }





        /*
            AUX DATA

            Example:

            M2 DJD_0668_FTG...
        */


        if (line.startsWith("M2") && currentEvent) {


            currentEvent.auxData = line;


            continue;

        }





        /*
            CLIP NAME

            Example:

            *FROM CLIP NAME: filename.JPG
        */


        if (line.includes("*FROM CLIP NAME:") && currentEvent) {


            currentEvent.clipName =
                line.replace(
                    /^\*FROM CLIP NAME:\s*/,
                    ""
                );


            events.push(currentEvent);


            currentEvent = null;


            continue;

        }





        /*
            SLUG

            Example:

            * T+: RECRE: STORAGE UNIT...
        */


        if (line.includes("*T+:") && currentEvent) {


            currentEvent.slug =
                line.replace(
                    /^.*\*T\+:\s*/,
                    ""
                )
                .replace(/^"/, "")
                .replace(/"$/, "");



            events.push(currentEvent);


            currentEvent = null;


            continue;

        }


    }



    return events;

}





function calculateDuration(start, end) {


    const s = start.split(":").map(Number);

    const e = end.split(":").map(Number);



    let frames = e[3] - s[3];

    let seconds = e[2] - s[2];

    let minutes = e[1] - s[1];

    let hours = e[0] - s[0];



    if (frames < 0) {

        frames += 30;

        seconds--;

    }



    if (seconds < 0) {

        seconds += 60;

        minutes--;

    }



    if (minutes < 0) {

        minutes += 60;

        hours--;

    }



    return (

        String(hours).padStart(2,"0")
        + ":" +
        String(minutes).padStart(2,"0")
        + ":" +
        String(seconds).padStart(2,"0")
        + ":" +
        String(frames).padStart(2,"0")

    );

}
