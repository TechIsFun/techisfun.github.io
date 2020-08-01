---
layout: post
title: ReactiveX, RxJava and RxAndroid - where to start
comments: true
tags: [android, programming, rxjava]
---

The next library you will learn should definetly be <em>ReactiveX</em>.

## What is ReactiveX?
From the [website](http://reactivex.io/): <em>ReactiveX is a combination of the best ideas from
the Observer pattern, the Iterator pattern, and functional programming</em>.

(But it's a lot more.)

The key concept to start with ReactiveX is: **think reactive programming as operating on a stream of data.**

## Can I use ReactiveX with my favourite language?
Actually you can find a ReactiveX implementation for the following languages:

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

## Ok, but wait: why should I use ReactiveX?
Because it will make your life easier! Let me give you a couple of examples, based on Java/Android development.

### Example 1: Nested API calls

Suppose that we need to call a remote API to authenticate a user, than another one to get user's data and again another API to get user's contacts.
Tipically we would have to write nested API calls like this:

{% highlight java %}
User user = null;

serviceEndpoint.login(username, password, new Callback<AccessToken>() {

  @Override
  public void success(User user, Response response) {

    // store accessToken somewhere

    serviceEndpoint.getUser(new Callback<User>() {
      @Override
      public void success(User userResponse, Response response) {

        user = userResponse;

        serviceEndpoint.getUserContact(user.getId(), new Callback<Contact>() {
          @Override
          public Contact success(Contact contact, Response response) {
        	user.setContact(contact);
          }

          @Override
          public void failure(RetrofitError error) {
        	// handle error here...
          }
        });
      }

      @Override
      public void failure(RetrofitError error) {
        // handle error here...
      }
    });

  }

  @Override
  public void failure(RetrofitError error) {
    // handle error here...
  }
});
{% endhighlight %}

Ok, maybe these APIs are not well designed, but sometimes you have to deal with it! ;-)

If we use RxJava + Retrofit (Retrofit is already compatible with RxJava), the code above will become:

{% highlight java %}
serviceEndpoint.login()
    .doOnNext(accessToken -> storeCredentials(accessToken))
    .flatMap(accessToken -> serviceEndpoint.getUser())
    .flatMap(user -> serviceEndpoint.getUserContact(user.getId()))
{% endhighlight %}

Cool, right?
There are actually many ways to achieve the same result using RxJava, but they're all better than using nested calls.

### Example 2: Android - forget about AsyncTasks

For Android developers, it gets even better. RxJava (and it's extension RxAndroid) can handle all the stuff about running long tasks in a background thread and present results on the main thread. Starting from the example above, if we want to login the user and display it's name, we can write just some lines of code:

{% highlight java %}
AppObservable.bindActivity(
    this,
    serviceEndpoint.login()
                .doOnNext(accessToken -> storeCredentials(accessToken))
                .flatMap(accessToken -> serviceEndpoint.getUser())
                .flatMap(user -> serviceEndpoint.getUserContact(user.getId()))
).subscribe(user -> mUserNameTextView.setText(user.getName()));
{% endhighlight %}

Ok, I know, it seems hard to understand at first. But _AppObservable.bindActivity_ will make the network call (line 4 to 7) in a background thread, while the result will be delivered in the main thread, so we can change the view (line 8). Plus, the method is automatically binded to the activity lifecycle, so the result will not be delivered if the activity is paused.

_This is super!_


## Good, I think I will learn it! Where should I start?
You can find many articles about ReactiveX, but only a few of them are easy to understand for a newbie.

- I suggest you to start from my book [*Reactive Java Programming*, available on Amazon](https://amzn.to/30hejXq).

[<img src="/assets/img/rxjava-book.jpg">](https://amzn.to/30hejXq)

- Here is a good talk about RxJava by *Ivan Morgillo* at droidconDE 2015. It's focused on Android programming only in the last part. The most of the talk covers aspects of reactive programming that can be applied to all languages.
<iframe width="560" height="315" src="https://www.youtube.com/embed/JCLZ55M2gVo" frameborder="0" allowfullscreen></iframe>

## Some other references?
- RxJava on Github: [https://github.com/ReactiveX/RxJava](https://github.com/ReactiveX/RxJava)
- Alphabetical List of Observable Operators: [https://github.com/ReactiveX/RxJava/wiki/Alphabetical-List-of-Observable-Operators](https://github.com/ReactiveX/RxJava/wiki/Alphabetical-List-of-Observable-Operators)
- Grokking RxJava: [http://blog.danlew.net/2014/09/15/grokking-rxjava-part-1/](http://blog.danlew.net/2014/09/15/grokking-rxjava-part-1/)
