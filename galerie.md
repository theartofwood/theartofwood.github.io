---
layout: page
title: Galerie
navigation_weight: 3
---

{% assign galleries = site.galleries | sort: date | reverse %}
{% for gallery in galleries %}
  {% assign folder = gallery.path | replace: '_galleries/', '' | replace: '.html', '' %}
  <div class="gallery overview">
    <a href="{{ gallery.url }}">
      <div class="gallery-image small">
      <img src="/images/galleries/{% if gallery.folder %}{{ gallery.folder }}{% else %}{{ folder }}{% endif %}/small/{{ gallery.overview }}" alt="{{ gallery.title }}">
      </div>
      <p class="gallery-title">{{ gallery.title }}</p>
    </a>
  </div>
{% endfor %}
