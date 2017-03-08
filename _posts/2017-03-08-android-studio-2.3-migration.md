---
layout: post
title: Migrate to Android Studio 2.3
tags: [android, Android Studio, gradle, annotation processor]
comments: true
--- 

![Android Studio Logo]({{site.baseurl}}/images/android_studio_logo.png)

### New features

Android Studio 2.3 has finally been released in the [Stable Channel](http://tools.android.com/download/studio/builds/2-3-0). There are many improvements compared to version 2.2, including:
- *Instant run*: now there are two different icons, one for restart the app and another one for apply changes without restart.
![Screen Shot 2017-03-02 at 9.12.10 AM.png]({{site.baseurl}}/images/instant_run_2.3.png)
- *Build cache*: it's used to have faster clean builds by caching exploded AARs and pre-dexed external libraries.
- *App Links Assistant* (Tools → App Link Assistant): it allows you to create new intent filters for your URLs, declare your app's website association through a Digital Asset Links file, and test your Android App Links support.
- Support to *WebP lossless image format*: the WebP format is . Android Studio 2.3 has a new wizard that converts any non-launcher PNG file to WebP (up to 25% smaller than a PNG) and WebP back to PNG.
- *Constraint Layout* with Chains and Ratios: this new version of Android Studio includes the stable release of ConstraintLayout. You can now chain two or more Android views bi-directionally together to form a group on one dimension (helpful when you want to place two views close together but want to spread them across empty space).

### Problems and issues 

Migration from Android Studio 2.2 to Android Studio 2.3 may not be completely painless.

This is a list of things that you may need to check to have everything working correctly.

- In your root build.gradle file the **gradle version should be updated to 2.3.0**:
	
    classpath 'com.android.tools.build:gradle:2.3.0'
    
- The **gradle distribution** should be updated to **version 3.3**, so check for the following line in file gradle/wrapper/gradle-wrapper.properties:

	distributionUrl=https\://services.gradle.org/distributions/gradle-3.3-all.zip

- If you are using **Kotlin**, update both the Android Studio plugin and the dependency in your build.gradle to **version 1.1.0**

- If you use **annotation processors** (like *ButterKnife* for example):
	- remove the following line:
    	
        apply plugin: 'android-apt'
	
    - change all occurrences of "apt" to "annotationProcessor":
		
        compile 'com.jakewharton:butterknife:8.4.0'
    	
        annotationProcessor 'com.jakewharton:butterknife-compiler:8.4.0'


You can find a complete list of improvements in the original blog post: [https://android-developers.googleblog.com/2017/03/android-studio-2-3.html](https://android-developers.googleblog.com/2017/03/android-studio-2-3.html)


