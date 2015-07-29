---
layout: page
title: Curriculum Vitae
description: "A short recap of my education and work experience"
image:
  feature: abstract-12.jpg
share: true
comments: false
tags: [android, java, developer, teacher, code review]
---

<!-- WORK TIMELINE -->

<div class="timeline">

  <div class="timeline-item">
    <div class="timeline-head">
      <span class="fa fa-lightbulb-o"><i></i></span>
    </div>
    <div class="timeline-arrow"><i></i></div>
    <div class="timeline-head-content">
        <h3>work experience</h3>
    </div>
  </div>

  {% for item in site.data.curriculum.work %}
   <!-- Timeline item -->
  <div class="timeline-item">
    <div class="timeline-item-date">{{ item.date_short }}</div><!-- date -->
      <div class="timeline-item-trigger"><span class="fa fa-plus" data-toggle="collapse" data-target="#{{ item.id }}"><i></i></span>    
      </div>

      <div class="timeline-arrow"><i></i></div>
      <!-- Timeline main content -->
      <div class="timeline-item-content">
        <h3 class="timeline-item-title" data-toggle="collapse" data-target="#{{ item.id }}">{{ item.title }}
        </h3>
        <div class="collapse 0" id="{{ item.id }}">
          <p>
            <small class="muted">{{item.date_long}}</small>
          </p>
          {{ item.description }}
          {% if item.url %}
            <p>
              <a href="{{ item.url }}" title="{{ item.url_title }}" class="noprint">→ View website</a>
            </p>
          {% endif %}            
        </div>
      </div>
      <!-- /end of timeline content -->
  </div>
  <!-- /end of timeline item -->
  {% endfor %}

</div>
<!-- END OF WORK TIMELINE -->


<!-- EDUCATION TIMELINE -->

<div class="timeline">

  <div class="timeline-item">
    <div class="timeline-head">
      <span class="fa fa-lightbulb-o"><i></i></span>
    </div>
    <div class="timeline-arrow"><i></i></div>
    <div class="timeline-head-content">
        <h3>education</h3>
    </div>
  </div>

  {% for item in site.data.curriculum.education %}
   <!-- Timeline item -->
  <div class="timeline-item">
    <div class="timeline-item-date">{{ item.date_short }}</div><!-- date -->
      <div class="timeline-item-trigger"><span class="fa fa-plus" data-toggle="collapse" data-target="#{{ item.id }}"><i></i></span>    
      </div>

      <div class="timeline-arrow"><i></i></div>
      <!-- Timeline main content -->
      <div class="timeline-item-content">
        <h3 class="timeline-item-title" data-toggle="collapse" data-target="#{{ item.id }}">{{ item.title }}
        </h3>
        <div class="collapse 0" id="{{ item.id }}">
          

          <p>
            <small class="muted">{{item.date_long}}</small>
          </p>
          <p>
            <h4 class="media-heading primary-color">{{item.organization}}</h4>
          </p>
          {{ item.description }}
          {% if item.url %}
            <p>
              <a href="{{ item.url }}" title="{{ item.url_title }}" class="noprint">→ View website</a>
            </p>
          {% endif %}   



        </div>
      </div>
      <!-- /end of timeline content -->
  </div>
  <!-- /end of timeline item -->
  {% endfor %}

</div>
<!-- END OF EDUCATION TIMELINE -->
