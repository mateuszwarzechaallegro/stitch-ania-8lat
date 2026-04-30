/* speech.js — TTS helper for Misja Ania
   Splits text into sentences and chains them via onend to work around
   the Android Chrome bug where long utterances are silently killed.
   Usage: initTTS("Tekst do przeczytania…")  — call once per page */

(function () {
  var PITCH = 1.45;
  var RATE  = 1.05;
  var LANG  = 'pl-PL';

  var speaking = false;
  var queue    = [];   // sentence chunks still to play
  var stopFlag = false;

  function getPolishVoice() {
    var voices = window.speechSynthesis.getVoices();
    return voices.find(function (v) { return v.lang.startsWith('pl'); }) || null;
  }

  /* Split on sentence-ending punctuation, keeping delimiters */
  function toChunks(text) {
    var raw = text.match(/[^.!?—]+[.!?—]*/g) || [text];
    // Trim and drop empty strings
    return raw.map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 0; });
  }

  function playNext() {
    if (stopFlag || queue.length === 0) {
      speaking  = false;
      stopFlag  = false;
      queue     = [];
      updateBtn();
      return;
    }

    var chunk = queue.shift();
    var utter = new SpeechSynthesisUtterance(chunk);
    utter.lang  = LANG;
    utter.pitch = PITCH;
    utter.rate  = RATE;
    var voice = getPolishVoice();
    if (voice) utter.voice = voice;

    utter.onend   = function () { playNext(); };
    utter.onerror = function (e) {
      // 'interrupted' fires when we cancel intentionally — ignore it
      if (e.error === 'interrupted') return;
      playNext(); // skip broken chunk, continue with rest
    };

    window.speechSynthesis.speak(utter);
  }

  function speak(text) {
    if (!('speechSynthesis' in window)) return;

    // Second tap = stop
    if (speaking) {
      stopFlag = true;
      queue    = [];
      window.speechSynthesis.cancel();
      speaking = false;
      updateBtn();
      return;
    }

    window.speechSynthesis.cancel();
    stopFlag = false;
    queue    = toChunks(text);
    speaking = true;
    updateBtn();
    playNext();
  }

  function updateBtn() {
    var btn = document.getElementById('tts-btn');
    if (!btn) return;
    btn.textContent      = speaking ? '⏹ Stop' : '🔊 Czytaj';
    btn.style.background = speaking ? '#a0207a' : '#6b00b6';
  }

  /* Public API */
  window.initTTS = function (text) {
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
