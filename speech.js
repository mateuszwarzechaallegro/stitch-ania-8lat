/* speech.js — TTS helper for Misja Ania
   Simulates a high-pitched, energetic voice (Stitch-like approximation)
   using the Web Speech API with the system Polish TTS voice.
   Usage: initTTS("Tekst do przeczytania…")  — call once per page */

(function () {
  var PITCH = 1.45;   // higher = more playful / Stitch-like
  var RATE  = 1.05;   // slightly faster for energy
  var LANG  = 'pl-PL';

  var speaking       = false;
  var keepAliveTimer = null;

  function getPolishVoice() {
    var voices = window.speechSynthesis.getVoices();
    return voices.find(function (v) { return v.lang.startsWith('pl'); }) || null;
  }

  function stopKeepAlive() {
    if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;

    // Second tap = stop
    if (speaking) {
      window.speechSynthesis.cancel();
      stopKeepAlive();
      speaking = false;
      updateBtn();
      return;
    }

    window.speechSynthesis.cancel(); // clear any leftover

    var utter = new SpeechSynthesisUtterance(text);
    utter.lang  = LANG;
    utter.pitch = PITCH;
    utter.rate  = RATE;
    var voice = getPolishVoice();
    if (voice) utter.voice = voice;

    utter.onstart = function () {
      speaking = true;
      updateBtn();
      // Android Chrome bug: speechSynthesis pauses itself spontaneously
      // (triggered by touch events, audio focus changes, etc.).
      // Poll every 250 ms and immediately resume if paused.
      keepAliveTimer = setInterval(function () {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          // Speech finished naturally
          stopKeepAlive();
          speaking = false;
          updateBtn();
        }
      }, 250);
    };

    utter.onend = function () {
      stopKeepAlive(); speaking = false; updateBtn();
    };

    utter.onerror = function () {
      stopKeepAlive(); speaking = false; updateBtn();
    };

    window.speechSynthesis.speak(utter);
  }

  function updateBtn() {
    var btn = document.getElementById('tts-btn');
    if (!btn) return;
    btn.textContent      = speaking ? '⏹ Stop' : '🔊 Czytaj';
    btn.style.background = speaking ? '#a0207a' : '#6b00b6';
  }

  /* Public API — call once per page with the text to read */
  window.initTTS = function (text) {
    // Pre-load voice list (async in some browsers)
    if ('speechSynthesis' in window) {
      speechSynthesis.getVoices();
      speechSynthesis.onvoiceschanged = function () {};
    }

    function createBtn() {
      var btn = document.createElement('button');
      btn.id = 'tts-btn';
      btn.textContent = '🔊 Czytaj';
      btn.setAttribute('aria-label', 'Przeczytaj tekst na głos');
      btn.style.cssText =
        'position:fixed;bottom:22px;right:18px;z-index:500;' +
        'background:#6b00b6;color:#fff;border:none;border-radius:50px;' +
        'padding:11px 20px;font-size:0.92rem;font-weight:700;cursor:pointer;' +
        'box-shadow:0 3px 14px rgba(0,0,0,0.4);' +
        'touch-action:manipulation;-webkit-tap-highlight-color:transparent;';
      btn.onclick = function () { speak(text); };
      document.body.appendChild(btn);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBtn);
    } else {
      createBtn();
    }
  };
})();
