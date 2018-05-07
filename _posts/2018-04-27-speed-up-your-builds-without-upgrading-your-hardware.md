---
layout: post
title: Speed up your builds… without upgrading your hardware
tags: [android, gradle]
---

Often the only way to (really) speed up slow builds is to add more RAM, replace the old HDD with an SSD or buy a complete new PC (or Laptop). All those solutions requires investing (a lot of) money. What if we can just keep current hardware and delegate the build to another, more powerful, machine?

![I wish every build could look like this :)](https://cdn-images-1.medium.com/max/2000/1*lQW-9dRX_LSBkxClIF9akA.png)

*I wish every build could look like this :)*

I usually develop for Android, and everyone knows that Android builds are slow. Waiting for a build to complete is one of the things that make me feel like I’m wasting my day. Edit, launch the build, wait 4 to 5 minutes to have the app compiled and installed, run the app, test, edit, launch another build, wait again… no, I really hate it! So what can I do?

*(I won’t write here about all the fine tunings that can be done inside your gradle configurations files, they’re not in the scope of this article)*

## Test Driven Development

I’m a fan of *TDD*, so I try to skip many of those cycle of builds + manual testing by writing unit tests. The cycle becomes: write test, implement your code, build and run tests. You’ll skip the time-consuming manual testing (and you’ll gain all the well-known benefits of TDD).

But sometimes it’s not enough, for example when you’re fine-tuning the layout of the app, or when you need to debug a specific use-case. If the project is quite big, also running unit tests can become time consuming.

## Hardware upgrade or…?

So, should I upgrade my hardware? But my hardware is quite enough for everything that I do every day, except for code compiling! I’d like to have a machine just for compiling. Maybe a *Virtual Machine*, that can be launched only when I need it, and than I’ll pay just for the time I use it…

## …welcome to Mainframer

Then I’ve discovered a great tool: [Mainframer](https://github.com/gojuno/mainframer). It’s a command line tool that lets you easily launch your build on a remote machine! No need to buy a new laptop anymore!(*)

When you launch a build through Mainframer, it will:

1. Establish a *ssh* connection with the remote machine.

1. Use *rsync* to sync current directory with the remote machine.

1. Lunch the build command on the remote machine.

1. Sync back the directory when build finishes.

Here are the steps I’ve taken for my configuration:

* Create a Linux Virtual Machine on AWS

* Launch the Virtual Machine, ssh into it and install all the build tools that you need. For Android I’ve installed just the JDK and Android SDK (more details on configurations of the remote machine [here](https://github.com/gojuno/mainframer/blob/development/docs/SETUP_REMOTE.md)). Configure the Virtual Machine with the hardware features that fits your needs.

* Configure ssh on your local machine (more info [here](https://github.com/gojuno/mainframer/blob/development/docs/SETUP_LOCAL.md)).

* Download a copy of mainframer.sh in the root of your project.

* Test that everything is configured correctly with the following command:

    ./mainframer echo "It works!" > success.txt

Yeah, just this simple one-time setup! Now you can launch your build like this:

    ./mainframer ./gradle assembleDebug

end enjoy a faster compilation!

Another great advantage of this approach is that, if the build still requires “long time”, your local machine won’t be overloaded by the build process and you can use it for other stuff.

Mainframer supports the following build systems:

* [Gradle](https://github.com/gojuno/mainframer/blob/development/samples/gradle)

* [Gradle Android](https://github.com/gojuno/mainframer/blob/development/samples/gradle-android)

* [Rust](https://github.com/gojuno/mainframer/blob/development/samples/rust)

* [Clang](https://github.com/gojuno/mainframer/blob/development/samples/clang)

* [GCC](https://github.com/gojuno/mainframer/blob/development/samples/gcc)

* [Maven](https://github.com/gojuno/mainframer/blob/development/samples/mvn)

* [Buck](https://github.com/gojuno/mainframer/blob/development/samples/buck)

* [Go](https://github.com/gojuno/mainframer/blob/development/samples/go)

And there’s also an [IntelliJ Plugin](https://github.com/elpassion/mainframer-intellij-plugin)!

## Bonus

You can get the maximum boost to your development process by applying both TDD and Mainframer!

(*)Yes, I know, you don’t have to pay for a new laptop but you have to pay for VM usage. But it’s much cheaper, and you can upgrade or throw away the VM according to your budget and your needs.
