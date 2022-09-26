const fs = require("fs/promises");
const readline = require("readline");

const TASKS_FILENAME = `${__dirname}/tasks.json`;

function Duration(s=0) {
    this.seconds = s;

    this.addTimeSince = function(date) {
	return new Duration(this.seconds + Math.floor((Date.now() - date) / 1000));
    };

    this.toString = function(includeSeconds) {
	const arr = [
	    Math.floor(this.seconds / 3600),
	    Math.floor(this.seconds % 3600 / 60)
	];
	
	if (includeSeconds) {
	    arr.push(this.seconds % 60);
	}
	
	return arr.map(n => String(n).padStart(2, "0")).join(":");
    };
}

Duration.fromStr = function(str) {
    const arr = str.split(":").map(s => +s);
    return new Duration(arr[0]*3600 + arr[1]*60 + arr[2]);
};

function loadTasks() {
    try {
	return require(TASKS_FILENAME);
    } catch (_) {
	return [];
    }
}

function formatName(name, col=15, gap=5) {
    return (name.length <= col - gap ?
	    name :
	    name.slice(0, col-gap) + "...")
	.padEnd(col, " ");
}

function list() {
    const tasks = loadTasks();
    
    if (tasks.length === 0)
	console.log("No tasks are currenlty saved.\n" +
		    "Use 'ttt -a TASK' to add one.");
    else {
	console.log(`${formatName("NAME")}DURATION`);
	tasks.map(task => `${formatName(task.name)}${task.duration}`)
	    .forEach(task => console.log(task));
    }
}

function printTime(duration, overwrite=true, printSeconds) {
    const tty = process.stdout;
    
    const print = () => {
	tty.write(`${duration.toString(printSeconds)}\n`);
	tty.clearScreenDown();
    };
    
    if (overwrite) {
	tty.moveCursor(null, -1, () => {
	    tty.cursorTo(0, null, print);
	});
    } else print();
}

function start(taskName, printSeconds) {
    if (!process.stdout.isTTY) {
	console.error("stdout is not a terminal.  Exiting...");
	process.exit(1);
    }
    
    const tasks = loadTasks();
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
	    startTime = Date.now();
	    totalTime = Duration.fromStr(task.duration);

	    const print = (update=true) => {
		printTime(totalTime.addTimeSince(startTime), update, printSeconds);
	    };

	    console.log("Resuming");
	    print(false);
	    printer = setInterval(print, printSeconds ? 1e3 : 60e3);
	},
	
	pause(msg) {
	    clearInterval(printer);
	    console.log(msg);
	    task.duration = totalTime.addTimeSince(startTime).toString(true);
	},

	async save() {
	    console.log("Saving data...");
	    await fs.writeFile(TASKS_FILENAME, JSON.stringify(tasks));
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
	case "a":
	    console.log("aborting...");
	    process.exit();
	    break;
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
	    if (!paused) {
		handler.pause("Stopped");
		paused = true;
	    }

	    handler.save()
		.then(() => {
		    console.log("Done.");
		    process.exit();
		})
		.catch(err => {
		    console.error(err.name, err.message);
		    console.error("Press 'q' to try again, " +
				  "or 'a' to abort without saving.");
		});
	    break;
	}
    });
}

module.exports = { list, start };
