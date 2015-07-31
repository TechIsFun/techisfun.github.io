---
layout: post
title: ReactiveX, RxJava and RxAndroid - where to start
comments: true
tags: [android, programming, rxjava]
---

The next library you will learn should definetly be <em>Reactivex</em>.

### What is Reactivex?
From the [website](http://reactivex.io/): <em>ReactiveX is a combination of the best ideas from
the Observer pattern, the Iterator pattern, and functional programming</em>.

(But it's a lot more.)

The key concept to start with Reactivex is: **think reactive programming as operating on a stream of data.**

### Can I use Reactivex with my favourite language?
Actually you can find a Reactivex implementation for the following languages:

- Java: RxJava
- JavaScript: RxJS
- C#: Rx.NET
- C#(Unity): UniRx
- Scala: RxScala
- Clojure: RxClojure
- C++: RxCpp
- Ruby: Rx.rb
- Python: RxPY
- Groovy: RxGroovy
- JRuby: RxJRuby
- Kotlin: RxKotlin
- Swift: RxSwift

### Ok, but wait: why should I use Reactivex?
Because it will make your life easier! Let me give you a couple of examples, based on Android development.

TODO: esempio di concatenazione di chiamate rest


TODO: esempio di bind al ciclo di vita dell'activity e delle view, con uso automatico degli opportuni schedules



### Good, I think I will learn it. Where should I start?
You can find many articles about Reactivex, but only a few of them are easy to understand for a newbie.

- I can suggest you to start from this: [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754). I've found it very clear and comprehensive of many aspects of reactive programming.

- Here is a good talk about RxJava by *Ivan Morgillo* at droidconDE 2015. It's focused on Android programming only in the last part. The most of the talk covers aspects of reactive programming that can be applied to all languages.
<iframe width="560" height="315" src="https://www.youtube.com/embed/JCLZ55M2gVo" frameborder="0" allowfullscreen></iframe>

### Some other references?
- RxJava on Github: [https://github.com/ReactiveX/RxJava](https://github.com/ReactiveX/RxJava)
- Alphabetical List of Observable Operators: [https://github.com/ReactiveX/RxJava/wiki/Alphabetical-List-of-Observable-Operators](https://github.com/ReactiveX/RxJava/wiki/Alphabetical-List-of-Observable-Operators)
- Grokking RxJava: [http://blog.danlew.net/2014/09/15/grokking-rxjava-part-1/](http://blog.danlew.net/2014/09/15/grokking-rxjava-part-1/)
