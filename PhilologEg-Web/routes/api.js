const express = require('express');
const router = express.Router();

const request = require('request');
const prompt = require("prompt-sync")({ sigint: true });

let breakCheck = (tr, tl, colWidth) => {
    if (colWidth >100) {var buffer = 0;} else
    if (colWidth >50) {var buffer = 1;} else
    if (colWidth >30) {var buffer = 3;} else
    {var buffer = 4;}
    let penalty = (line, index, type) => {
        switch (type) {
            case "tl":
                if (line[index] == " " && line[index+1] == "<") {
                    return -30;
                }
                else if ((line[index] == "." || line[index] == "!" || line[index] == "?") && line[index+1] == " ") {
                    return -20;
                }
                else if (line[index] == "," || line[index] == ";" || line[index] == ":") {
                    return -10;
                }
                else if (line[index] == " ") {
                    return (index/line.length)*-25;
                }
                else if ((line[index] == "\"" || line[index] == "\'") && (line[index-1] == "." || line[index-1] == "!" || line[index-1] == "?")) {
                    return -15;
                }
                else {
                    return (index/line.length)*-5;
                }
            case "tr":
                if (line[index] == " " && line[index+1] == "<") {
                    return -30;
                }
                else if (line[index] == " ") {
                    return (index/line.length)*-25;
                }
                else {
                    return (index/line.length)*-5;
                }
        }
    }

    for (let i = 0; i < tl.length; i++) {
        if (tl[i].length > colWidth-buffer) {
            // console.log(tr[i]);
            // console.log(tl[i]);
            // console.log(i);
            
            let breakPlan = [];
            for (let j = 0; j < colWidth-buffer; j++) {
                breakPlan.push(penalty(tl[i], j, "tl"));
            }

            let breakIndex = breakPlan.indexOf(Math.min(...breakPlan));
            let a = tl[i].slice(0, breakIndex+1);
            let b = tl[i].slice(breakIndex+1);
            let c;
            let d;
            
            if (b.match(/<(\d+)>/)) {
                align_val = b.match(/<(\d+)>/)[1];
                align_indx_tr = tr[i].indexOf('<'+align_val+'>');
                // console.log("We realigned at " + align_val);
                c = tr[i].slice(0, align_indx_tr);
                d = tr[i].slice(align_indx_tr);
                
            }
            else if (breakIndex < tr[i].length) {
                c = tr[i].slice(0, breakIndex+1);
                d = tr[i].slice(breakIndex+1);
            }
            else {
                c = tr[i]
                d = "";
            }
            
            if (tr[i+1] == undefined) {
                tr.push("");
            }
            if (tl[i+1] == undefined) {
                tl.push("");
            }
            tl[i] = a;
            tl[i+1] = b + " " + tl[i+1];
            tr[i] = c;
            if (d != "") {
                tr[i+1] = d + " " + tr[i+1];
            }
            else {
                tr[i+1] = tr[i+1];
            }
            
            // console.log(breakIndex);

            // prompt("");
            [tr, tl] = breakCheck(tr, tl, colWidth);
            tr = tr.filter(item => item !== "");
            tl = tl.filter(item => item !== "");
            break;
        }
    }

    outerloop:
    for (let i = 0; i < tr.length; i++) {
        if (tr[i].length > colWidth-buffer) {
            // console.log(tr[i]);
            // console.log(tl[i]);
            // console.log(i);

            let breakPlan = [];
            for (let j = 0; j < colWidth-buffer; j++) {
                breakPlan.push(penalty(tr[i], j, "tr"));
            }

            let breakIndex = breakPlan.indexOf(Math.min(...breakPlan));
            let a = tr[i].slice(0, breakIndex+1);
            let b = tr[i].slice(breakIndex+1);
            
            try{
                if (i+1 == tr.length || tr[i+1].match(/^\s*$/)) {
                    tr[i] = a;
                    tr[i+1] = b;
                }
            }
            catch (error){
                console.log(tr);
                console.log(tr.length, i+1, b);
                exit();
            }
        }
        else if (tr[i].match(/<(\d+)>/)){
            let align_val = tr[i].match(/<(\d+)>/)[1];
            let align_indx_tr = tr[i].indexOf('<'+align_val+'>');

            for (let j = i+1; j < tl.length; j++) {
                if (tl[j].match(/<(\d+)>/) && tl[j].match(/<(\d+)>/)[1]==align_val && j>i) {
                    let padding  = [];
                    for (let k = i; k < j; k++) {
                        padding.push(" ");
                    }
                    tr = tr.slice(0, i).concat(padding).concat(tr.slice(i));
                    break outerloop;
                }
            }
        }
        
    }

    return [tr, tl];
}

let processTrFile = (result, colWidth, strength=0) => {
    let tr = [];
    let tl = [];


    for (let i = 0; i < result.length; i++) {
        result[i] = result[i].replaceAll('&quot', '\"');
        tr.push(result[i].split(';')[0].replaceAll('\n', '').replaceAll('###', ''));
        tl.push(result[i].split(';').slice(1).join('').replaceAll('\n', '').replaceAll('###', ''));
    }


    //find all substrings in tr that start with <note> and end with </note> and remove them into a separate array called notes
    const notes = [];
    for (let i = 0; i < tr.length; i++) {
        if (tr[i].includes('<note>')) {
            const startIndex = tr[i].indexOf('<note>');
            const endIndex = tr[i].indexOf('</note>');
            const note = tr[i].substring(startIndex, endIndex + 7);
            notes.push(note);
            tr[i] = tr[i].replace(note, '<sup>' + notes.length + '</sup>');
        }
    }

    for (let i = 0; i < tl.length; i++) {
        if (tl[i].includes('<note>')) {
            const startIndex = tl[i].indexOf('<note>');
            const endIndex = tl[i].indexOf('</note>');
            const note = tl[i].substring(startIndex, endIndex + 7);
            notes.push(note);
            tl[i] = tl[i].replace(note, '<sup>' + notes.length + '</sup>');
        }
    }

    // switch (strength) {
    //     case 0:
    //         break;
    //     case 2:
    //         for (let i = 0; i < tl.length; i++) {
    //             if (tl[i].includes('.')){
    //                 let a = tl[i].split('.')[0]+".";
    //                 let b = tl[i].split('.')[1];
    //                 let c = tr[i].slice(0, (a.length/tl[i].length)*tr[i].length);
    //                 let d = tr[i].slice((a.length/tl[i].length)*tr[i].length);

    //                 tl = tl.slice(0, i).concat(a).concat(b).concat(tl.slice(i+1));
    //                 tr = tr.slice(0, i).concat(c).concat(d).concat(tr.slice(i+1));
    //             }
    //         }
    //         break;
    // }

    // for (let i = 0; i < tl.length; i++) {
    //     if (tl[i].includes(';') || tl[i].includes(',')) {
    //         const separator = /[,;]/; // define the separator as a regular expression

    //         const splitLine = tl[i].split(separator); // split the line using the separator
    //         if (splitLine.length > 1) {
    //                 splitLine[0] += tl[i].match(separator)[0]; // concatenate the separator with the first element
    //         }
    //             tl[i] = splitLine; // replace the original line with the split line
    //         }
    //     }
    

    for (let i = 0; i < tl.length - 1; i++) {
        const combinedLine = tl[i] + ' ' + tl[i + 1];
        const combinedLine_tr = tr[i] + ' ' + tr[i + 1];
        if (combinedLine.length <= colWidth && combinedLine_tr.length <= colWidth) {
            tl[i] = combinedLine;
            tl.splice(i + 1, 1);

            tr[i] = combinedLine_tr;
            tr.splice(i + 1, 1);
            
            i--;
        }
    }

    // Loop through the arrays
    for (let i = 0; i < tr.length; i++) {
        let trString = tr[i];
        let tlString = tl[i];

        // Regular expression to match "<n>" pattern
        const regex = /<(\d+)>/g;

        // Arrays to store matches
        const trMatches = [];
        const tlMatches = [];

        let match;
        while ((match = regex.exec(trString)) !== null) {
            trMatches.push({
                index: match.index,
                value: match[1]
            });
        }

        while ((match = regex.exec(tlString)) !== null) {
            tlMatches.push({
                index: match.index,
                value: match[1]
            });
        }

        // Pad trString to align with tlString
        tr_realign = 0;
        tl_realign = 0;
        for (const tlMatch of tlMatches) {
            const trMatch = trMatches.find(trMatch => trMatch.value === tlMatch.value);
            if (trMatch) {
                let sup_tags_tr = 0;
                let sup_tags_tl = 0;
                try {
                    sup_tags_tr = trString.slice(0, trMatch.index+tr_realign).match(/<sup>/g).length*5 + trString.slice(0, trMatch.index+tr_realign).match(/<\/sup>/g).length*6;
                    sup_tags_tl = tlString.slice(0, tlMatch.index+tl_realign).match(/<sup>/g).length*5 + tlString.slice(0, tlMatch.index+tl_realign).match(/<\/sup>/g).length*6;
                } catch (TypeError) {
                }
                let catchup = (tlMatch.index + tl_realign - sup_tags_tl) - (trMatch.index + tr_realign - sup_tags_tr);
                if (catchup > 0) {
                    const padding = ' '.repeat(catchup);
                    trString = trString.slice(0, trMatch.index+tr_realign) + padding + trString.slice(trMatch.index+tr_realign);
                    tr_realign += catchup;
                }
                else if (catchup < 0) {
                    const padding = ' '.repeat(-catchup);
                    tlString = tlString.slice(0, tlMatch.index+tl_realign) + padding + tlString.slice(tlMatch.index+tl_realign);
                    tl_realign -= catchup;
                }
            }
        }
        
        tr[i] = trString;
        tl[i] = tlString;
    }

    [tr, tl] = breakCheck(tr, tl, colWidth);

    const combined = [];
    const lengths = [];
    for (let i = 0; i < tl.length; i++) {
        if (i < tr.length) {
            combined.push(tr[i]);
        }
        else {
            combined.push("");
        }
        combined.push(tl[i]);
        if (tr[i]!=undefined){
            if (!tr[i].match(/^\s*$/)){
                lengths.push(tr[i].length);
            }
        }
        if (tl[i]!=undefined){
            if (!tl[i].match(/^\s*$/)){
                lengths.push(tl[i].length);
            }
        }

        // if (combined[combined.length - 1].length >= colWidth) {
        //     console.log(combined[combined.length - 1]);
        // }
    }
    if (tr.length > tl.length) {
        for (let i = tl.length; i < tr.length; i++) {
            combined.push(tr[i]);
            combined.push("");
        }
    }

    let utilised = ((lengths.reduce((a, b) => a + b, 0) / lengths.length) || 0) / colWidth * 100;
    
    return {'data': combined, 'foot': notes, 'utilised': utilised};
}

router.post('/trs', (req, res) => {
    console.log("Trying to create lines of size ", req.body['col-width']);
    const start = performance.now();

    const fileUrl = req.body['file-url'];
    request(fileUrl, (error, response, body) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error fetching file');
        } else if (response.statusCode !== 200) {
            res.status(response.statusCode).send('Error fetching file');
        } else {
            const lines = body.split('\n\n');
            const startIndex = lines.findLastIndex(line => line.includes('###'));
            const result = lines.slice(startIndex).filter(line => line.trim() !== '');

            let processedTiers = processTrFile(result, req.body['col-width'], 2);
            const end = performance.now();
            console.log(`\nExecution time: ${end - start} ms\n`);
            res.json(processedTiers);
        }
    });
});


router.post('/hi', (req, res) => {
    const fileUrl = req.body['file-url'];
});


module.exports = router;
