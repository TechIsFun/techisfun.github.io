---
layout: post
title: Auto-increment versionCode in build.gradle file
---

Starting from this [blog post by Bryan Rosenbaum](http://bryankrosenbaum.com/2013/11/27/getting-to-know-gradle-auto-increment-version-and-signing-releases/), here is a gradle task to auto increment **versionCode** inside your build.gradle file.

{% highlight groovy %}
import java.util.regex.Pattern

...

task incrementVersionCode << {
    println(":incrementVersionCode - Incrementing Version Code...")
    def buildGradleFile = file("build.gradle")
    def patternVersionCode = Pattern.compile("versionCode (\\d+)")
    def buildGradleFileText = buildGradleFile.getText()
    def matcherVersionCode = patternVersionCode.matcher(buildGradleFileText)
    matcherVersionCode.find()
    def mVersionCode = Integer.parseInt(matcherVersionCode.group(1))
    def mNextVersionCode = mVersionCode + 1
    def manifestContent = matcherVersionCode.replaceAll("versionCode " + mNextVersionCode)
    println(":incrementVersionCode - current versionCode=" + mVersionCode);
    println(":incrementVersionCode - next versionCode=" + mNextVersionCode);
    buildGradleFile.write(manifestContent)
}
{% endhighlight %}

Now run `gradle incrementVersionCode` and your build.gradle will be automatically updated.