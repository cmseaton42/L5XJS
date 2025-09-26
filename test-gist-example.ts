import { Document, Program, Routine, Rung } from './src/index';

// Mock xlsx data for testing
const mockData = [
  { Tag: 'StartButton', 'Input/Output': 'Input' },
  { Tag: 'StopButton', 'Input/Output': 'Input' },
  { Tag: 'RunningLight', 'Input/Output': 'Output' },
  { Tag: 'AlarmLight', 'Input/Output': 'Output' }
];

// Define useful constants
const WORKSHEET_NAME = "IO_Schedule";
const ROUTINE_NAME = "NewRoutine";

// Use mock data instead of reading Excel file
const data = mockData;

// Initialize L5X primitives
const doc = new Document(); // Highest level in the L5X hierarchy
const prog = new Program({ name: "JustContext" }); // We need a program to append our routine to
const rout = new Routine({ name: ROUTINE_NAME });

// Mount routine within program
prog.addRoutine(rout);

// Mount program into document
doc.addProgram(prog);

// Build rungs for routine
for (let i = 0; i < data.length; i++) {
    const tagName = data[i]["Tag"];
    
    // Check if is input or not based on column in sheet
    const isInput = data[i]["Input/Output"] === "Input" ? true : false;
    
    // Generate appropriate rung content
    // if input then  -> |---||---------(tagname)---|
    // if output then -> |----|tagname|-------()----|
    const content = isInput ? `XIC()OTE(${tagName});` : `XIC(${tagName})OTE();`;
    
    // Generate new rung instance with desired content
    const rung = new Rung({ logic: content });
    
    // Mount rung in program
    rout.addRung(rung);
}

// Set Target of Document to TempRoutine
//   -> Rockwell will need a target to successfully
//      import the file, since we are building a routine
//      we set the target to our generated routine
doc.setTarget(rout);

// Test that it works
console.log('✅ Gist example works!');
console.log(`Generated ${data.length} rungs in ${ROUTINE_NAME}`);
console.log('XML preview:', doc.toString().substring(0, 200) + '...');
