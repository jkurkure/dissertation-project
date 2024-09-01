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

// create a function that finds the top ten characters with the lowest penalty for a given line
// it should print the character with 5 surrounding characters on either side and the penalty
let findBestBreaks = (line, type) => {
    let penalties = [];
    for (let i = 0; i < line.length; i++) {
        penalties.push(penalty(line, i, type));
    }
    let topTen = [];
    for (let i = 0; i < 10; i++) {
        let min = Math.min(...penalties);
        let index = penalties.indexOf(min);
        topTen.push({char: line[index], penalty: min});
        penalties.splice(index, 1);
    }
    console.log(topTen);
}

findBestBreaks("<1> An excellent follower says: 'May it please you, count, we have reached <3> home, the maul has been taken, <4> the mooring post has been driven in, and the prow rope has been thrown <5> on land, praise is given, and the god is thanked, every man is embracing his fellow <7> and our crew has come back safe, without <8> loss to our expedition.", "tl");