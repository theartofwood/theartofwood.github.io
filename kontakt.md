---
layout: page
title: Kontakt
navigation_weight: 5
---

<h1>Schicken Sie mir eine Nachricht</h1>

<form id="contact-form">
  <p>
    <input name="_replyto" type="email" placeholder="E-Mail-Adresse" required>
    <sup>*</sup>
  </p>
  <p>
    <textarea type="text" name="message" placeholder="Die Nachricht" required></textarea>
  </p>
  <input type="hidden" name="_subject" value="Neue Nachricht">
  <input type="hidden" name="_format" value="plain">
  <input type="text" name="_gotcha" style="display:none">
  <p>
    <button id="submit">Abschicken</button>
  </p>
</form>

<p>
<sup>*</sup> Die E-Mail-Adresse wird benötigt, um auf die Nachricht antworten zu können; sie wird nicht veröffentlicht.
</p>

<script>
  window.addEventListener('DOMContentLoaded', function() {
    var submit = $('#submit');
    var form   = $('#contact-form');

    $(document).bind('submit', '#contact-form', function(e) {
      e.preventDefault();
      submit.prop('disabled', true);

      $.ajax({
        url: 'https://formspree.io/{{ site.email }}',
        method: 'POST',
        data: $('#contact-form').serialize(),
        dataType: 'json',
        success: function(response) {
          $('h1').text('Nachricht erfolgreich abgeschickt!');
          window.setTimeout(function() { submit.prop('disabled', false); }, 5000);
        },
        error: function(response) {
          $('h1').text('Es ist ein Problem aufgetreten, versuche es erneut.');
          submit.prop('disabled', false);
        }
      });
    });
  });
</script>
