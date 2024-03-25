self.addEventListener('push', function(event) {
  if (event.data) {
      const dataText = event.data.text();
      try {
          const dataObject = JSON.parse(dataText);
          // Now you can use dataObject to show a notification
          // For example:
          self.registration.showNotification(dataObject.title, {
              body: dataObject.description,
          });
      } catch (e) {
          console.error('Error parsing push notification data:', e);
      }
  } else {
      console.log('Push event but no data');
  }
});