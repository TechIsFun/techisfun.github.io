---
layout: post
title: OutOfMemoryError while compiling Android projects
tags: [android, gradle]
---


Have you ever got a `OutOfMemoryError` while compiling an Android project, just like this?

	{% raw %}
	:app:dexDebug
	Unknown source file : Uncaught translation error: java.util.concurrent.ExecutionException: java.lang.OutOfMemoryError: Java heap space
	Unknown source file : 1 error; aborting

	:app:dexDebug FAILED

	FAILURE: Build failed with an exception.

	* What went wrong:
	Execution failed for task ':app:dexDebug'.
	> com.android.ide.common.process.ProcessException: org.gradle.process.internal.ExecException: Process 'command '/Library/Java/JavaVirtualMachines/jdk1.8.0_45.jdk/Contents/Home/bin/java'' finished with non-zero exit value 1
	{% endraw %}

The quick solution is: add `javaMaxHeapSize` to `dexOptions` in your build.gradle, adjusting the value on your needs.

	{% raw %}
	android {
		...

        dexOptions {
            javaMaxHeapSize "2g"
        }

        ...
    }
    {% endraw %}
