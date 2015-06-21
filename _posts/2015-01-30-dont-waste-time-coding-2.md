---
layout: post
title: Don't waste your time coding - part 2
comments: true
tags: [android, programming]
image:
  feature: sea.png
---

You can find the first part of this article [here]({{site.baseurl}}/{% post_url 2014-12-16-dont-waste-time-coding-1 %})

Automatic code formatting and import organizing
------------------------------------------------
<em>Code styling is important. A well formatted piece of code becomes more readable and more comprehensible.</em>

But sometimes trying to keep the code formatted can be negative: you lose your time and your focus.
You will soon start to count the number of spaces at the beginning of the current line, or you will think about questions like "should I use 2 or 4 spaces for tabs?" or "should I put a space before this bracket?" or again "lets remove some unused imports because my IDE is saying that I'm not using them", and you will lose your focus on that great algorithm that sits in your mind waiting to become the core of a great application. Then you have to spend some other time trying to get to the point, and restart writing code.

I think that it's better to leave all the annoying stuff about code formatting to your IDE.
Every modern IDE has an automatic formatting function, that can be triggered automatically when the file is saved or when it's committed. And the same functionality exists for automatic imports organizing.

<strong>Eclipse</strong>

* Settings: Java -> Code style -> Formatter
* Auto format code: CTRL + SHIFT + F
* Auto organize imports: CTRL + SHIFT + O

<strong>Android Studio</strong>

* Settings: Code style -> Formatter -> Java
* Auto format code: CTRL + ALT + L
* Auto organize imports: CTRL + ALT + O

With Android Studio I prefer to let the IDE reformat my code before committing, as you can see in the following screenshot:
![Android Studio commit dialog]({{site.baseurl}}/images/studio_commit_dialog.png)

<em>When you're writing code, think about writing code</em>, no matter how beautiful it is. You can think about formatting later, or even don't think about formatting at all because your IDE will do it for you.
But also don't forget to produce well formatted code!

Bonus: don't waste your time formatting JSON strings or long SQL queries! Ask Google for "json formatter" or "sql formatter", and try some online time-saving tools.

Online tools for code generation
--------------------------------
Talkin' about boilerplate code, you can find many tools that will take care to generate code for you. This leads to time saving, less annoyances, and (most important) less bugs.

Here are some tools that I love to use in my activity as Android developer:

- [Android Fragment Code Generator](http://andreamaglie.com/android-fragment-generator/) (self-promotion, sorry!)
- [parcelabler](http://www.parcelabler.com/)
- [Android Layout Finder](https://www.buzzingandroid.com/tools/android-layout-finder/)

Do you know some other useful tool? Don't forget to write a comment about it!

Again, <em>don't waste your time coding!</em> Type just what you need to type, you'll become more productive and less stressed.