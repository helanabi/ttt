const readline = require("readline");

const tasks = [
    {
	name: "fso",
	duration: "36:07:00"
    },
    {
	name: "cs61a",
	duration: "987:12:15"
    },
    {
	name: "mdn",
	duration: "87:03:20"
    },
    {
	name: "ttt",
	duration: "00:30:24"
    }
];

function list() {
    if (tasks.length === 0)
	console.log("No tasks are currenlty saved.\n" +
		    "Use 'ttt -a TASK' to add one.");
    else {
	console.log("NAME\tDURATION");
	tasks.map(task => `${task.name}\t${task.duration}`)
	    .forEach(task => console.log(task));
    }
}

function secondsSince(date) {
    return Math.floor((new Date() - date) / 1000);
}

function makeTimeArray(seconds) {
    return [
	Math.floor(seconds / 3600),
	Math.floor(seconds % 3600 / 60),
	seconds % 60
    ];	
}

function timeArrayToSeconds(timeArray) {
    return timeArray[0]*3600 + timeArray[1]*60 + timeArray[2];
}

function addTime(timeArray, seconds) {
    return makeTimeArray(timeArrayToSeconds(timeArray) + seconds);
}

function printTime(timeArray, overwrite=true) {
    const tty = process.stdout;
    
    const print = (clear=true) => {
	tty.write(`${timeArray.join(":")}\n`);
	if (clear) tty.clearScreenDown();
    };
    
    if (tty.isTTY && overwrite) { // TODO: Abandon support for non-terminal stdout
	tty.moveCursor(null, -1, () => {
	    tty.cursorTo(0, null, print);
	});
    } else print(false);
}

function start(taskName) {
    const task = tasks.find(t => t.name === taskName);

    if (!task) {
	console.log(`Task '${taskName}' does not exist.\n` +
		    `Use 'ttt -a ${taskName}' to add it.`);
	process.exit();
    }

    let startTime;
    let totalTime;
    let printer;

    const eventHandlers = {
	resume() {
	    startTime = new Date();
	    totalTime = task.duration.split(":").map(s => +s);

	    const print = (update=true) => {
		printTime(addTime(totalTime, secondsSince(startTime)), update);
	    };

	    console.log("Resuming");
	    print(false);
	    printer = setInterval(print, 1e3); // Change this to 60e3 in production
	},
	
	pause(msg) {
	    clearInterval(printer);
	    console.log(msg);
	    task.duration = addTime(totalTime,
				    secondsSince(startTime)).join(":");
	}
    };

    console.log(`Tracking task: ${taskName}`);
    eventHandlers.resume();
    handleUserInput(eventHandlers);
}

function handleUserInput(handler) {
    let paused = false;
    
    const terminal = process.stdin;
    readline.emitKeypressEvents(terminal);
    terminal.setRawMode(true);

    terminal.on("keypress", (str, key) => {
	switch (key.name) {
	case "space":
	    if (paused) {
		handler.resume();
		paused = false;
	    } else {
		handler.pause("Paused");
		paused = true;
	    }
	    
	    break;
	    
	case "q":
	    if (!paused) handler.pause("Stopped");
	    process.exit();
	    break;
	}
    });
}

module.exports = { list, start };