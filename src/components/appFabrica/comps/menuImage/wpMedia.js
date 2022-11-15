const getWpMedia = (title = 'Choose a Picture', text = 'Choose Picture', alert = 'You are working out of the WP') => {
  try {
    return wp.media({
      title,
      button: { text },
      multiple: false,
    });
  } catch (err) {
    // Alert(alert);
  }
  return null;
}

export default getWpMedia;
