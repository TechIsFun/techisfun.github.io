---
layout: post
title: Android Auto Fit TextView
tags: [android]
---

Android framework provides no support for creating a TextView that can fit its content to its size.

There are some libraries out there that try to solve this problem, like:
- [AutoFitTextView](github.com/AndroidDeveloperLB/AutoFitTextView)
- [android-autofittextview](github.com/grantland/android-autofittextview)

But no one of them seems to work in every situation.
Looking into <em>stackoverflow</em> I've come to this [post](http://stackoverflow.com/questions/16017165/auto-fit-textview-for-android/21851239) which seems to hold the best working answer that I've tried.

Except when I've tried to use it when <em>textAllCaps="true"</em>.
The solution to this issue has already been reported in one of the comments.
So I put up all togheter, and the result is the following <em>AutoResizeTextView</em> implementation:

<script src="https://gist.github.com/TechIsFun/df5270aea46968ea165fb52d41bde803.js"></script>
