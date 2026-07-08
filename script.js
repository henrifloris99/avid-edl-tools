const sampleEDL = `
000003  BL                               V     C         00:00:19:01 01:00:32:01 01:00:51:02
*T+: RECRE: DEBRA'S STORAGE UNIT JOHN'S THINGS ARE IN BOXES OR ON TABLES
000004  BL                               V     C         00:00:02:04 01:00:51:02 01:00:53:06
000005  BL                               V     C         00:00:06:15 01:00:53:06 01:00:59:21
*T+: RECRE: DEBRA'S STORAGE UNIT PHOTO OF JOHN'S SCRUBS, THEN MUGSHOT
`;

const results = parseEDL(sampleEDL);

console.log(results);
