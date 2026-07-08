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

        // Skip empty lines
        if (line.length === 0)
            continue;

        // EVENT LINE
        // Example:
        // 000003 BL V C 00:00:19:01 01:00:32:01 01:00:51:02

        const eventMatch = line.match(
            /^(\d+)\s+\S+.*?(\d\d:\d\d:\d\d:\d\d)\s+(\d\d:\d\d:\d\d:\d\d)\s+(\d\d:\d\d:\d\d:\d\d)$/
        );

        if (eventMatch) {

            currentEvent = new EDLEvent(
                eventMatch[1], // Event Number
                eventMatch[2], // Duration
                eventMatch[3], // Record In
                eventMatch[4]  // Record Out
            );

            continue;
        }

        // TITLE LINE
        if (line.includes("*T+:") && currentEvent) {

            let slug = line.replace(/^"?\*T\+:\s*/, "");
            slug = slug.replace(/"$/, "");

            currentEvent.slug = slug;

            events.push(currentEvent);

            currentEvent = null;
        }

    }

    return events;

}
