window.addEventListener('load', function() {
  var audio = document.getElementById('back-music');
  if (audio) {
    audio.play().catch(function(error) {
    console.error('Failed to play background music:', error);
    });
  }
});