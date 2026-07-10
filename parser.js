class EDLEvent {
    constructor(eventNumber, sourceIn, sourceOut, recordIn, recordOut) {
        this.eventNumber = eventNumber;
        this.sourceIn = sourceIn;
        this.sourceOut = sourceOut;
        this.recordIn = recordIn;
        this.recordOut = recordOut;
        this.duration = "";
        this.slug = "";
    }
}


function timecodeToFrames(timecode) {

    const parts = timecode.split(":");

    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    const seconds = Number(parts[2]);
    const frames = Number(parts[3]);

    // Assumes 30fps for duration calculation
    return (
        ((hours * 60 + minutes) * 60 + seconds) * 30
    ) + frames;
}


function framesToTimecode(frames) {

    const fps = 30;

    const hours = Math.floor(frames / (fps * 3600));
    frames %= fps * 3600;

    const minutes = Math.floor(frames / (fps * 60));
    frames %= fps * 60;

    const seconds = Math.floor(frames / fps);
    const remainingFrames = frames % fps;

    return [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
        remainingFrames.toString().padStart(2, "0")
    ].join(":");
}


function calculateDuration(recordIn, recordOut) {

    const durationFrames =
        timecodeToFrames(recordOut) -
        timecodeToFrames(recordIn);

    return framesToTimecode(durationFrames);
}


function parseEDL(edlText) {

    const events = [];

    const lines = edlText.split(/\r?\n/);

    let currentEvent = null;


    for (let line of lines) {

        line = line.trim();


        if (line.length === 0) {
            continue;
        }


        // Find all timecodes on an event line
        const timecodes = line.match(/\d\d:\d\d:\d\d:\d\d/g);


        if (/^\d+/.test(line) && timecodes) {

            const eventNumberMatch = line.match(/^(\d+)/);

            if (!eventNumberMatch) {
                continue;
            }

            const eventNumber = eventNumberMatch[1];


            if (timecodes.length === 3) {

                // Older Avid EDL format:
                // Duration, Record In, Record Out

                currentEvent = new EDLEvent(
                    eventNumber,
                    "",
                    "",
                    timecodes[1],
                    timecodes[2]
                );

                currentEvent.duration = timecodes[0];

            }


            else if (timecodes.length >= 4) {

                // Standard CMX3600:
                // Source In, Source Out, Record In, Record Out

                currentEvent = new EDLEvent(
                    eventNumber,
                    timecodes[0],
                    timecodes[1],
                    timecodes[2],
                    timecodes[3]
                );

                currentEvent.duration = calculateDuration(
                    timecodes[2],
                    timecodes[3]
                );

            }


            continue;
        }



        // Handles:
        // *T+:
        // * T+:
        // "*T+:"

        const slugMatch = line.match(/^"?\*\s*T\+:\s*(.*)"?$/);


        if (slugMatch && currentEvent) {

            currentEvent.slug = slugMatch[1];

            events.push(currentEvent);

            currentEvent = null;
        }

    }


    return events;

}
