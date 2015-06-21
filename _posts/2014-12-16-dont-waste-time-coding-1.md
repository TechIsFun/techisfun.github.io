---
layout: post
title: Don't waste your time coding - part 1
tags:
- android
- programming
---

Life is too short: please, don't waste your time writing code!
I'm not saying that you don't have to code, but many people tend to waste too much time typing on the keyboard instead of producing code. Mee too.

<em>Following examples relate to Android's world, but that can be easily adapted to other languages and programming tasks.</em>

Aliases
-------

Android developers, how many times do you have to call the command `adb`? If your installation directory is something like

`/opt/android/sdk` 

maybe you're going to write `/opt/android/sdk/platform-tools/adb` many many times a day.

<em>Don't do it!</em> Instead add the android `/opt/android/sdk/platform-tools/` directory to your path or create an alias so you will only need to write `adb`!

I've also an alias for writing only `logcat` instead of `adb logcat`! ;-)

Some other alias examples:

* [android] `alias amstart='adb shell am start -n'`
* [android] `alias amkill='adb shell am kill'`
* [android] `alias media_scan='adb shell am broadcast -a android.intent.action.MEDIA_MOUNTED -d file:///mnt/sdcard'`
* [android] `alias packages='adb shell pm list packages'`
* [android w/ant] `alias install='ant debug install'`
* [android w/gradle] `alias install='./gradlew installDebug'`
* [svn] `alias svnlog='svn log | less'`
* [svn] `alias svn_ignore_edit='svn propedit svn:ignore . --editor-cmd nano'`
* [git] `alias revert='git checkout --'`

Snippets and Templates
----------------------
Every modern IDE has the support for <em>snippets</em> and <em>templates</em>.

Explore the built-in snippets and templates included in your IDE and use them as an example to write your own. You can create small blocks like a <em>try/catch</em> implementation or generate an entire class.

I've changed the default <strong>Android Studio</strong> template for <em>try/catch</em> block including exception logging. Go to <em>File -> Settings -> File and Code Templates</em>, select <em>Catch Statement Body</em> and change the default implementation with:

`Log.d(TAG, "got exception", ${EXCEPTION});`

If you use <em>Robolectric</em> you can change the default <em>Junit4 Test Class implementation</em> with the following, so annotations and basic imports are added automatically:

{% highlight java %}
import static org.junit.Assert.*;
import static org.fest.assertions.api.Assertions.*;

import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.annotation.Config;

@Config(emulateSdk = 18)
@RunWith(RobolectricTestRunner.class)
public class ${NAME} {
  ${BODY}
}
{% endhighlight %}

In <strong>Eclipse</strong> templates are under <em>Preferences -> Java -> Code Style -> Code Templates</em> and <em>Preferences -> Java -> Editor -> Templates</em>.

If you prefere <strong>Sublime Text</strong> you can find some useful Android Snippets in this repo: [http://github.com/ribot/SublimeAndroidSnippets](https://github.com/ribot/SublimeAndroidSnippets)
