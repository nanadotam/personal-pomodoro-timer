self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('message', event => {
  if (event.data.type === 'START_TIMER') {
    const endTime = event.data.endTime;
    
    setTimeout(() => {
      self.registration.showNotification('Pomodoro Timer', {
        body: 'Time to take a break!',
        icon: '/icon.png',
        vibrate: [200, 100, 200]
      });
    }, endTime - Date.now());
  }
}); 