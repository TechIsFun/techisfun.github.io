---
layout: post
title: Android Fragment Code Generator
tags: [android]
---

There are many ways to create a fragment in Android, but to create a fragment properly you need to follow specific guidelines.

For example, it's required that the class has a public zero-parameters constructor. If we need to pass parameters to the fragment, we need to use the method `setArguments()`.

Try to pass some parameters to the constructor as you do with any other class and then look at what happens after a device rotation: parameters will be lost. On screen rotation the fragment is automatically destroyed and re-created, and to do that Android uses the default constructor (public with no parameters). Nevertheless, the arguments will be saved and retrieved from the operating system if these have been set by the method `setArguments()`. 

With the *Android Fragment Code Generator* tool you can generate in few seconds the necessary code to successfully implement a fragment, without having to worry too much of the aspects mentioned above.

Try it here: [Android Fragment Code Generator](http://www.andreamaglie.com/fragment-generator-android/)
