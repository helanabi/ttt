# Task Time Tracker (ttt)

ttt is a command-line tool that helps you track time spent on different activities.


## Motivation ##

The motivation behind writing this program was the lack of a lightweight utility with an intuitive interface, that can keep track of time spent on various tasks, handy for people working on an hourly-basis.

## Dependencies ##

All you need to run the program is to have Node.js installed.  No third-party packages are needed, it is written in vanilla JavaScript.

## Usage ##

* Add a new task

`$ ttt -a taskname`

* List all tasks

`$ ttt` shows a list of tasks

* Start tracking a task

`$ ttt taskname`

* Use spacebar to pause/resume tracking, and 'q' to quit.


## Manual ##

```
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
```

## Copyright ##

Copyright (C) 2022 Hassan El anabi (al-annabi.tech)
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>

This is free software; you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.
