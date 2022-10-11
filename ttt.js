#!/usr/bin/env node

const lib = require("./lib.js");

const VERSION_NUM = "0.1.0";

const doc = `
   ttt - Task Time Tracker

   Keep track of time spent on specific tasks


   SYNOPSIS

   ttt [[-s] TASK]
   ttt -a TASK
   

   DESCRIPTION

   Invokation with no arguments lists all known tasks.
   If TASK is provided, it will cause the program to start tracking
   time spent on the specified task.  Tracking can be paused then resumed
   by pressing the spacebar, or halted by pressing 'q'.
   Pressing 'a' will cause the program to abort without saving time tracked during
   the current session.


   OPTIONS

   -a, --add TASK	Add a new task
   -s, --seconds        Display seconds while tracking TASK
   -h, --help		Show help
   -v, --version	Display version and copyright information


   AUTHORS

   Copyright (C) 2022 Hassan El anabi (al-annabi.tech)
`;

const version = `ttt version ${VERSION_NUM}
Copyright (C) 2022 Hassan El anabi (al-annabi.tech)
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>

This is free software; you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
`;

function main(argv) {
    if (argv.length === 0)
	lib.list();
    
    else if (argv[0] === "-h")
	console.log(doc);
    
    else if (argv[0] === "-v")
	console.log(version);
    
    else if (argv.length === 1)
	lib.start(argv[0]);
    
    else if (argv.length === 2 && argv[0] === "-s")
	lib.start(argv[1], true);
    
    else if (argv.length === 2 && argv[0] === "-a")
	lib.add(argv[1]);
    
    else {
	console.error("Invalid usage.  Use -h for help");
	process.exit(1);
    }
}

main(process.argv.slice(2));
