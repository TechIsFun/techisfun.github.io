---
layout: post
title: RxJava&#58; convert a listener into an Observable
tags: [java,android]
---

In Java it's common to work with listeners. And if you work with RxJava, you will prefer to use an Observable instead of listeners. But what if you have to deal with a library and you cannot change the source code?

There's a simple way to create an Observable around a listener.

Suppose we have an interface `ValueUpdateListener` and an object `ValueUpdater` that will call our listener:

{% highlight java %}
public interface ValueUpdateListener {
    
    void onValueChanged(@NonNull String value);

}

public class ValueUpdater {
    
    // in some point of the class...
    
    public void registerListener(ValueUpdateListener listener) {
        //...
    };
    
    public void unregisterListener(ValueUpdateListener listener) {
        //...
    };
}
{% endhighlight %}

We can create an Observable like this:

{% highlight java %}
public Observable<String> observableListenerWrapper() {

    return Observable.create(new Observable.OnSubscribe<String>() {

        @Override
        public void call(Subscriber<? super String> subscriber) {
            ValueUpdateListener listener = new ValueUpdateListener() {

                @Override
                public void onValueChanged(@NonNull String value) {
                    if (subscriber.isUnsubscribed()) {
                        registerListener.unregisterListener(this);
                    } else {
                        subscriber.onNext(value);
                    }
                }
            };

            registerListener.registerListener(listener);
        }
    });
}
{% endhighlight %}

Now you just have to subscribe:

{% highlight java %}
observableListenerWrapper().subscribe(value -> {
    // do something with the new value
});
{% endhighlight %}


Note that the listener will be automatically unregistered if the method `onValueChanged` is called and the observable is unsubscribed.