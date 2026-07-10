class EDLEvent {
    constructor(eventNumber, duration, recordIn, recordOut) {
        this.eventNumber = eventNumber;
        this.duration = duration;
        this.recordIn = recordIn;
        this.recordOut = recordOut;
        this.slug = "";
    }
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

        // ----------------------------
        // EVENT LINE
        // Supports BOTH:
        //
        // 000003 BL ... 00:00:19:01 01:00:32:01 01:00:51:02
        //
        // and
        //
        // 003 BL ... 00:00:00:00 00:00:19:01 01:00:32:01 01:00:51:02
        // ----------------------------

        const timecodes = line.match(/\d\d:\d\d:\d\d:\d\d/g);

        if (/^\d+/.test(line) && timecodes) {

            const eventNumber = line.match(/^(\d+)/)[1];

            if (timecodes.length === 3) {

                // Old export style
                currentEvent = new EDLEvent(
                    eventNumber,
                    timecodes[0],
                    timecodes[1],
                    timecodes[2]
                );

                continue;
            }

            if (timecodes.length >= 4) {

                // New export style
                currentEvent = new EDLEvent(
                    eventNumber,
                    timecodes[1], // Source Out = Duration
                    timecodes[2], // Record In
                    timecodes[3]  // Record Out
                );

                continue;
            }
        }

        // ----------------------------
        // TITLE / SLUG LINE
        //
        // Supports:
        // *T+:
        // * T+:
        // " *T+: "
        // ----------------------------

        const slugMatch = line.match(/^"?\*\s*T\+:\s*(.*)"?$/);

        if (slugMatch && currentEvent) {

            currentEvent.slug = slugMatch[1];

            events.push(currentEvent);

            currentEvent = null;
        }

    }

    return events;

}
