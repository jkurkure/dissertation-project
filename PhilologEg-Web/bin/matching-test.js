// // Sample input arrays
// const tr = ["This is a test <123> string with <456> numbers.", "Another example <789> string.", "Third<666>example","df<42>ifgweui<66>hdnndnd<12>jj", "jw mwt m-Hr=j mjn mj<139> kft pt mj s sxtRead A1 as A2. <140> jm"];
// const tl = ["Test <123> for regex <456>.", "Sample <789> string.", "fun<666>cat", "Go qu<42>ietly int<66>o the sweet n<12>ight.", "Death is in my sight today, like <139> the sky's clearing, like a man's grasping<140> thereby"];

// // Loop through the arrays
// for (let i = 0; i < tr.length; i++) {
//     let trString = tr[i];
//     let tlString = tl[i];

//     // Regular expression to match "<n>" pattern
//     const regex = /<(\d+)>/g;

//     // Arrays to store matches
//     const trMatches = [];
//     const tlMatches = [];

//     let match;
//     while ((match = regex.exec(trString)) !== null) {
//         trMatches.push({
//             index: match.index,
//             value: match[1]
//         });
//     }

//     while ((match = regex.exec(tlString)) !== null) {
//         tlMatches.push({
//             index: match.index,
//             value: match[1]
//         });
//     }

//     // Pad trString to align with tlString
//     tr_realign = 0;
//     tl_realign = 0;
//     for (const tlMatch of tlMatches) {
//         const trMatch = trMatches.find(trMatch => trMatch.value === tlMatch.value);
//         if (trMatch) {
//             let catchup = (tlMatch.index + tl_realign) - (trMatch.index + tr_realign);
//             if (catchup > 0) {
//                 const padding = ' '.repeat(catchup);
//                 trString = trString.slice(0, trMatch.index+tr_realign) + padding + trString.slice(trMatch.index+tr_realign);
//                 tr_realign += catchup;
//             }
//             else if (catchup < 0) {
//                 const padding = ' '.repeat(-catchup);
//                 tlString = tlString.slice(0, tlMatch.index+tl_realign) + padding + tlString.slice(tlMatch.index+tl_realign);
//                 tl_realign -= catchup;
//             }
//         }
//     }
    
//     tr[i] = trString;
//     tl[i] = tlString;
// }

// for (let i = 0; i < tr.length; i++) {
//     console.log(tr[i]);
//     console.log(tl[i]);
//     console.log();
// }

// // Sample input string
// let tableRows = "<hi>Some content</hi> and more text <note>Another note</note>.";

// // Regular expressions to match the patterns
// const regex = /(<\/?hi>|<\/?note>)/g;

// // Replace the matched instances with the instance plus whitespace
// tableRows = tableRows.replace(regex, match => match + ' '.repeat(match.length));

// console.log(tableRows);

// Your input array of strings
const tr = [
    "like a praise singer does: \"This is one who goes forth, as he has brought himself!\"",
    "before I have come to it.  The west gives me pleasure.  Is it suffering? It is a turning-point of life",
    "trees fall.  Trample on evil, and cast aside my misery!"
  ];

  // Define the regex pattern to match full-stops, exclamation points, and question marks at the end of sentences
const regex = /([.!?])(?=\s|$)/g;

// Iterate through the array and split each string based on the regex
for (let i = 0; i < tr.length; i++) {
  tr[i] = tr[i].split(regex).map((substring, index, array) => {
    if (substring.match(regex)) {
      // Include the split character in the substring
      return index === array.length - 1 ? substring : substring + array[index + 1];
    } else {
      return substring;
    }
  });
}

// Now the `tr` array contains arrays of sub-strings with split characters included
console.log(tr);